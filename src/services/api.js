// // passenger-app/src/services/api.js
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // const BASE_URL = 'http://10.0.2.2:8000/api/v1'; // Android emulator localhost
// const BASE_URL = 'http://10.0.2.2:3000'; // Android emulator localhost
// // const BASE_URL = 'http://192.168.X.X:8000/api/v1'; // physical device

// const api = axios.create({
//   baseURL: BASE_URL,
//   timeout: 15000,
//   headers: { 'Content-Type': 'application/json' },
// });

// // Request interceptor — attach JWT
// api.interceptors.request.use(
//   async (config) => {
//     const token = await AsyncStorage.getItem('token');
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
//   },
//   (error) => Promise.reject(error),
// );

// // Response interceptor — handle 401
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401) {
//       await AsyncStorage.removeItem('token');
//       await AsyncStorage.removeItem('user');
//     }
//     return Promise.reject(error);
//   },
// );

// export default api;


// import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const BASE_URL = 'http://10.0.2.2:3000'; // Android emulator

// const rawBaseQuery = fetchBaseQuery({
//   baseUrl: BASE_URL,
//   prepareHeaders: async (headers) => {
//     const token = await AsyncStorage.getItem('token');
//     if (token) {
//       headers.set('Authorization', `Bearer ${token}`);
//     }
//     headers.set('Content-Type', 'application/json');
//     return headers;
//   },
// });

// // Global 401 handler
// export const baseQueryWithAuth = async (args, api, extraOptions) => {
//   const result = await rawBaseQuery(args, api, extraOptions);

//   if (result.error?.status === 401) {
//     await AsyncStorage.multiRemove(['token', 'user']);
//   }

//   return result;
// };
