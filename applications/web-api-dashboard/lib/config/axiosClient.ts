import axios from 'axios';

import dotenv from '../constants/dotenv';

export const axiosClient = axios.create({
  baseURL: dotenv.AUTH_API_URL,
  withCredentials: true,
});
