 import axios from 'axios';

const httpClient = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 10000,
  headers: {
    Accept: '*/*',
  },
});

httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erro na resposta:', error.message);
    
    // Se receber 401 (Unauthorized), limpar dados de autenticação
    if (error.response?.status === 401) {
      console.log('Token expirado ou inválido, limpando dados de autenticação');
      
      // Não redirecionar se estivermos em páginas de auth ou se for uma requisição de login/cadastro
      const currentPath = window.location.pathname;
      const isAuthPage = currentPath === '/login' || currentPath === '/signup' || currentPath === '/';
      const isAuthRequest = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');
      
      if (!isAuthPage && !isAuthRequest) {
        localStorage.removeItem('token');
        localStorage.removeItem('nome');
        localStorage.removeItem('userType');
        
        // Redirecionar para login apenas se não estivermos em páginas de auth
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default httpClient;