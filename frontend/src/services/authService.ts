// src/services/authService.js
import apiClient from "../utils/axiosInstance";

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
}

class AuthService {
  baseRoute = "/auth";

  signup = async (userData: SignupData) => apiClient.post(`${this.baseRoute}/register`, userData);
  login = async (credentials: LoginCredentials) => apiClient.post(`${this.baseRoute}/login`, credentials);
  logout = async () => apiClient.post(`${this.baseRoute}/logout`);
  fetchCurrentUser = async () => apiClient.get(`${this.baseRoute}/logedinuser`);
}

export const authService = new AuthService();
