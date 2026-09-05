import axios from "axios";
import { backendUrl } from "../../url";
export const getClientStatistics = async () => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };
    const response = await axios.get(
      `${backendUrl}/api/dashboard/client/statistics`,
      config
    );
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
};
export const getExpertStatistics = async () => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };
    const response = await axios.get(
      `${backendUrl}/api/dashboard/expert/statistics`,
      config
    );
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
};

export const getUserActiveLicense = async () => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };
    const response = await axios.get(
      `${backendUrl}/api/userlicense/activelicense`,
      config
    );
    return response;
  } catch (error) {
    throw error.response.data.error;
  }
};

export const upgradeUserLicence = async (secret) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };
    const response = await axios.post(
      `${backendUrl}/api/upgrade/license`,
      { secret },
      config
    );
    return response.data;
  } catch (error) {
    throw error.message;
  }
};


export const getUserCreditsService = async () => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };
    const response = await axios.get(`${backendUrl}/api/user/credits`, config);
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
};
export const assignSnackExpert = async (expertId) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };
    const response = await axios.post(`${backendUrl}/api/user/assign`,{expertId}, config);
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
};

export const getClientTransactionsService = async () => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };
    const response = await axios.get(
      `${backendUrl}/api/dashboard/client/transactions`,
      config
    );
    return response?.data;
  } catch (error) {
    throw error.response.data.error;
  }
};
