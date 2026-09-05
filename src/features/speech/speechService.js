import axios from "axios";
import { backendUrl } from "../../url";

const buildConfig = () => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
});

export const getAllSpeeches = async () => {
  try {
    const response = await axios.get(`${backendUrl}/api/speeches`, buildConfig());
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.response?.data?.message || error.message;
  }
};

export const getOneSpeech = async (speechId) => {
  try {
    const response = await axios.get(
      `${backendUrl}/api/speeches/${speechId}`,
      buildConfig()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.response?.data?.message || error.message;
  }
};

export const addSpeechAction = async (speechDetails) => {
  try {
    const response = await axios.post(
      `${backendUrl}/api/feature/addspeech`,
      speechDetails,
      buildConfig()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.response?.data?.message || error.message;
  }
};

export const deleteSpeechService = async (id) => {
  try {
    const response = await axios.delete(
      `${backendUrl}/api/speeches/${id}`,
      buildConfig()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || error.response?.data?.message || error.message;
  }
};
