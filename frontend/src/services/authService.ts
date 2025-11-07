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


  forgotPassword = async (email: string) => {
    const res = await apiClient.post(`${this.baseRoute}/forgot-password`,  {email} );
    console.log(res);
    return res.data;
  }
  verifyOTP = async (email: string, otp: string) => {
    const res = await apiClient.post(`${this.baseRoute}/verify-otp`, { email, otp });
    return res.data;
  }
  resetPassword = async (email: string, newPassword: string)=> {
    const res = await apiClient.post(`${this.baseRoute}/reset-password`, {
      email,
      new_password: newPassword,
    });
    return res.data;
  }
}

export const authService = new AuthService();
