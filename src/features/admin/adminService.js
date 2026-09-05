import axios from "axios";
import { backendUrl } from "../../url";

export const getAllCorporateSpeechStatistics = async (licenceId) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };
    const response = await axios.get(
      `${backendUrl}/api/dashboard/admin/satistics/${licenceId}`,
      config
    );
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
};
export const getAllCorporateLicensesAdmin = async () => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };
    const response = await axios.get(`${backendUrl}/api/license/corporate`, config);
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
};
export const assignLicense = async (email, licenseId) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };
    const response = await axios.post(
      `${backendUrl}/api/licenseManager`,
      { email, licenseId },
      config
    );
    return response.data;
  } catch (error) {
    throw error.response.data.error;
  }
};
export const addExpert = async (email, licenseId,firstName,lastName,maxEvaluation) => {
  try {

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };
    const response = await axios.post(
      `${backendUrl}/api/signup/expert`,
      { email, licenseId,firstName,lastName,maxEvaluation },
      config
    );
    return response.data;
  } catch (error) {

    throw error.response.data.message;
  }
};
export const getUnassignedExperts = async (licenceId) => {
  try {
 
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };
    const response = await axios.get(
      `${backendUrl}/api/admin/unassignedExperts/${licenceId}`,
      
      config
    );
    return response.data;
  } catch (error) {

    throw error.response.data.message;
  }
};
