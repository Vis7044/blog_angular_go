// src/services/authService.js
import apiClient from '../utils/axiosInstance';
import axiosInstance from '../utils/axiosInstance'

interface LoginCredentials {
  email: string;
  password: string;
}

const baseRoute = '/auth';

export const signup = async (userData : any) => {
  try {
    const response = await axiosInstance.post('/register', userData)
    return response.data
  } catch (error) {
    console.error('Signup failed:', error)
    throw error
  }
}

export const login = async (credentials: LoginCredentials) => apiClient.post(`${baseRoute}/login`, credentials);
