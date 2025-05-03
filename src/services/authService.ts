import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const tokenName = process.env.NEXT_PUBLIC_TOKEN_NAME as string || 'defaultTokenName';

export interface AuthData {
  identifier: string;
  password: string;
}

export interface OtpData {
  identifier: string;
}

export interface VerifyOtpData {
  identifier: string;
  otp: string;
}

export interface ResetPasswordData {
  identifier: string;
  resetToken: string;
  newPassword: string;
}

export interface UpdateProfileData {
  [key: string]: any;
}

const AuthService = {
  registerUser: async (data: AuthData): Promise<any> => {
    const response = await axios.post(`${baseUrl}/users/register`, data);
    return response.data;
  },

  getUserDetails: async (): Promise<any> => {
    const response = await axios.get(`${baseUrl}/dashboard/user`);
    return response.data;
  },

  updateUserProfile: async (data: UpdateProfileData): Promise<any> => {
    const response = await axios.post(`${baseUrl}/users/update`, data);
    return response.data;
  },

  generateOTP: async (identifier: string): Promise<any> => {
    const response = await axios.post(`${baseUrl}/users/generate-otp`, { identifier });
    return response.data;
  },

  verifyOTP: async (data: VerifyOtpData): Promise<any> => {
    const response = await axios.post(`${baseUrl}/users/verify-otp`, data);
    return response.data;
  },

  login: async (data: AuthData): Promise<any> => {
    const response = await axios.post(`${baseUrl}/users/login`, data);
    return response.data;
  },

  isLoggedIn: (): boolean => {
    const token = localStorage.getItem(tokenName);
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        return decodedToken.exp * 1000 > Date.now();
      } catch (error) {
        console.error('Error decoding JWT token:', error);
      }
    }
    return false;
  },

  logOutUser: async (): Promise<any> => {
    const response = await axios.get(`${baseUrl}/users/logout`);
    return response.data;
  },

  sendOtpForPasswordReset: async (identifier: string): Promise<any> => {
    const response = await axios.post(`${baseUrl}/auth/password-reset/send-otp`, { identifier });
    return response.data;
  },

  verifyOtpForPasswordReset: async (data: VerifyOtpData): Promise<any> => {
    const response = await axios.post(`${baseUrl}/auth/password-reset/verify-otp`, data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordData): Promise<any> => {
    const response = await axios.post(`${baseUrl}/auth/password-reset`, data);
    return response.data;
  },
};

export default AuthService;
