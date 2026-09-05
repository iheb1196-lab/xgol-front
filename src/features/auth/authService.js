import axios from "axios";
import { backendUrl } from "../../url";
export const login = async (credentials) => {
  try {
    const response = await axios.post(`${backendUrl}/api/login`, credentials);
    return response.data;
  } catch (error) {
    throw error.response;
  }
};
export const logout = async () => {
  try {
    const { data } = await axios.post(`${backendUrl}/api/logout`);
    return data.message;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const refreshToken = async () => {
  try {
    const response = await axios.get(`${backendUrl}/api/logout`);
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
};
export const signup = async (userData) => {
  try {
    const { data } = await axios.post(`${backendUrl}/api/signup/client`, userData);
    return data.message;
  } catch (error) {
    throw error.response;
  }
};

export const activateAccount = async (token) => {
  try {
    const response = await axios.post(`${backendUrl}/api/accountVerification/${token}`);
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${backendUrl}/api/passwordReset`, {
      email,
    });
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const resetPassword = async (token, password) => {
  try {
    const response = await axios.post(`${backendUrl}/api/passwordReset/${token}`, {
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const resetAdminAccount = async (token, password) => {
  try {
    const response = await axios.post(
      `${backendUrl}/api/accountVerification/passwordReset/${token}`,
      {
        password,
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};
export const getUserEmail = async (token) => {
  try {
    const response = await axios.get(`${backendUrl}/api/email/${token}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
