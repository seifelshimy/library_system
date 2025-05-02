import axios from "axios";

const API_URL = "http://localhost:5000/api/books";

export const bookService = {
  getAll: async (token) => {
    const res = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  getById: async (id, token) => {
    const res = await axios.get(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  create: async (bookData, token) => {
    const res = await axios.post(API_URL, bookData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  update: async (id, bookData, token) => {
    const res = await axios.put(`${API_URL}/${id}`, bookData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  delete: async (id, token) => {
    const res = await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};
