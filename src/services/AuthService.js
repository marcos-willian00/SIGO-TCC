import httpClient from './api';

export const loginService = async (email, password) => {
  const formData = new FormData();

  formData.append('username', email);
  formData.append('password', password);

  const response = await httpClient.post('/token', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  if (response.status !== 200 || !response.data.access_token) return false;

  const { access_token } = response.data;
  console.log('Login response:', access_token);
  localStorage.setItem('token', access_token);
  return true;
};
