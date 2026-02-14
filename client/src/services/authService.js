import axios from 'axios';
import api from './api';

const API = 'http://localhost:5000/api/auth';

export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API}/login`, userData);
    return response.data; // Should return { token, user }
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API}/register`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMe = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error;
  }
};
