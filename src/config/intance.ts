import { TokenJwt } from '@config/store';
import axios, { AxiosInstance } from 'axios';

const baseURL = 'http://127.0.0.1:8000';
const instance: AxiosInstance = axios.create({
  baseURL: `${baseURL}/api`,
});

instance.interceptors.request.use(
  config => {
    const token = TokenJwt.getState().token;
    config.headers.Authorization = `Bearer ${token}`;
    config.headers.Accept = 'application/json';
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export { instance, baseURL };
