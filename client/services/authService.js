import axios from "axios";

const API = "http://localhost:5000/api/auth";

export const registerUser = async (formData) => {
  const response = await axios.post(`${API}/register`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const loginUser = async (data) => {
  const response = await axios.post(`${API}/login`, data);
  return response.data;
};
