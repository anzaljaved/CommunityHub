import axios from "axios";

const API = "http://localhost:5000/api/threads";

export const getThreads = async (token, type) => {
  const response = await axios.get(
    type ? `${API}?type=${type}` : API,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const createThread = async (token, data) => {
  const response = await axios.post(API, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getMessages = async (token, threadId) => {
  const response = await axios.get(
    `${API}/${threadId}/messages`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const sendMessage = async (token, threadId, content) => {
  const response = await axios.post(
    `${API}/${threadId}/messages`,
    { content },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
