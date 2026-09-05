import axios from "axios";

function isTokenExpired(token) {
  if (!token) return true; // Token does not exist, consider it expired
  const expirationTime = getTokenExpirationTime(token);
  return expirationTime < Date.now() / 1000;
}

function getTokenExpirationTime(token) {
  if (!token) return 0;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp;
  } catch (error) {
    console.error("Error parsing token payload:", error);
    return 0;
  }
}

async function refreshAuthToken() {
  try {
    const { data } = await axios.get(`http://localhost:8080/api/refresh`);
    return data;
  } catch (error) {
    return error.response.data.message;
  }
}
// refreshAuthToken();

axios.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("accessToken");

    if (!isTokenExpired(token)) {
      console.log("token  expired");
      // const newToken = await refreshAuthToken();
      //   config.headers.Authorization = `Bearer ${newToken}`;
      //   localStorage.setItem("accessToken", newToken);
    } else {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;
