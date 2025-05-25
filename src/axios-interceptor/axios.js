import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://api.tak8.com.au/",
});


// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Modify request config, such as adding headers or logging
    return config;
  },
  (error) => {
    // Handle request errors
    return error;
    // return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Modify response data or handle success
    return response;
  },
  async (error) => {
    // Handle response errors
    return error;
    // return Promise.reject(error);
  }
);

export default axiosInstance;
