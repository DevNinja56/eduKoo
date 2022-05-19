import axios from 'axios';

import { AWS_USER_BASE_URL, BASE_URL } from './constants';

export const apiService = axios.create({
  baseURL: BASE_URL,
});

export const awsService = axios.create({
  baseURL: AWS_USER_BASE_URL,
});

export const setUserToken = (uid: string) => {
  awsService.interceptors.request.use(
    async config => {
      config.headers = {
        Authorization: uid,
      };

      return config;
    },
    async error => {
      throw error;
    },
  );
};
