import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

export const uploadPdf = async (file, question) => {
  const formData = new FormData();

  formData.append("pdf", file);
  formData.append("question", question);

  const response = await api.post("/upload", formData);

  return response.data;
};

export default api;