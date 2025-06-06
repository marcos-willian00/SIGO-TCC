import httpClient from './api';

export const loginService = async (email, password) => {
  const params = new URLSearchParams();
  params.append('username', email);
  params.append('password', password);

  const response = await httpClient.post('/auth/login', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  if (response.status !== 200 || !response.data.access_token) return false;

  const { access_token } = response.data;
  localStorage.setItem('token', access_token);

  // Buscar dados do usuário autenticado
  const userResponse = await httpClient.get('/auth/me');
  const user = userResponse.data;
  console.log("Usuário retornado:", user);

  // Checagem robusta:
  if (!user || !user.id || !user.nome || !user.user_type) {
    alert("Usuário desconhecido ou não autenticado.");
    return false;
  }

  // Salve o nome e tipo no localStorage
  localStorage.setItem('nome', user.nome);
  localStorage.setItem('user_type', user.user_type);

  return { user };
};