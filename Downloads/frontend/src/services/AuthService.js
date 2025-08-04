import httpClient from './api';

export const loginService = async (email, password) => {
  try {
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);

    const response = await httpClient.post('/auth/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.status !== 200 || !response.data.access_token) {
      return { success: false, error: 'INVALID_CREDENTIALS' };
    }

    const { access_token } = response.data;
    localStorage.setItem('token', access_token);

    // Buscar dados do usuário autenticado
    const userResponse = await httpClient.get('/auth/me');
    const user = userResponse.data;
    console.log('Usuário retornado:', user);

    // Checagem robusta:
    if (!user || !user.id || !user.nome || !user.user_type) {
      return { success: false, error: 'USER_DATA_INVALID' };
    }

    // Salve o nome e tipo no localStorage
    localStorage.setItem('nome', user.nome);
    localStorage.setItem('user_type', user.user_type);

    return { success: true, user };
  } catch (error) {
    console.error('Erro no loginService:', error);

    if (error.response) {
      // Erro de resposta do servidor
      const status = error.response.status;
      switch (status) {
        case 401:
          return { success: false, error: 'INVALID_CREDENTIALS' };
        case 404:
          return { success: false, error: 'USER_NOT_FOUND' };
        case 422:
          return { success: false, error: 'VALIDATION_ERROR' };
        case 500:
          return { success: false, error: 'SERVER_ERROR' };
        default:
          return { success: false, error: 'UNKNOWN_ERROR' };
      }
    } else if (error.request) {
      // Erro de rede/timeout
      return { success: false, error: 'NETWORK_ERROR' };
    } else {
      // Outro tipo de erro
      return { success: false, error: 'UNKNOWN_ERROR' };
    }
  }
};
