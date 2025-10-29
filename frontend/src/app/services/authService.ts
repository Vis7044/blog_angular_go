// src/services/authService.js
import axiosInstance from '../utils/axiosInstance'

export const signup = async (userData : any) => {
  try {
    const response = await axiosInstance.post('/register', userData)
    return response.data
  } catch (error) {
    console.error('Signup failed:', error)
    throw error
  }
}

export const login = async (credentials: any) => {
  try {
    const response = await axiosInstance.post('/auth/login', credentials)
    return response.data
  } catch (error) {
    console.error('Login failed:', error)
    throw error
  }
}
