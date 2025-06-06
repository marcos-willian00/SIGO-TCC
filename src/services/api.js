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
    return Promise.reject(error);
  }
);

export default httpClient;