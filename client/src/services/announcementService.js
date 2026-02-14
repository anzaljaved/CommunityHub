import axios from "axios";

const API = "http://localhost:5000/api/announcements";

export const getAnnouncements = async (token, category) => {
  const response = await axios.get(
    category ? `${API}?category=${category}` : API,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const createAnnouncement = async (token, data) => {
  const response = await axios.post(API, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
