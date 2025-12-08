import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use 10.0.2.2 for Android Emulator to access localhost
// Use localhost for iOS Simulator
export const API_URL = 'http://10.0.2.2:3001'; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log('API Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
      console.log('Headers:', error.response.headers);
    } else if (error.request) {
      console.log('No response received:', error.request);
    } else {
      console.log('Error config:', error.config);
    }

    // Handle 401 Unauthorized (e.g., token expired)
    if (error.response && error.response.status === 401) {
      // Optionally clear storage and redirect to login
      // await AsyncStorage.removeItem('accessToken');
    }
    return Promise.reject(error);
  }
);

export default api;
