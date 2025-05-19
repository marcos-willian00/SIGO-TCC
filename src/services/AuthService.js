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
  localStorage.setItem('token', access_token);

  // Buscar dados do usuário autenticado
  const userResponse = await httpClient.get('/users/current_user');
  const user = userResponse.data;
console.log("Usuário retornado:", user);
  // Salve o nome completo no localStorage
  localStorage.setItem('nome', user.full_name);

  return { user };
};