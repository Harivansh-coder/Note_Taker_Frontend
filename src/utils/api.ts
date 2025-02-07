import axios from "axios";
import { AuthResponse, User } from "../types";
import { Note } from "../types/note";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  signup: async (data: {
    name: string;
    email: string;
    dateOfBirth?: string;
    password: string;
  }) => {
    const response = await api.post<AuthResponse>("/auth/signup", data);
    return response.data;
  },
  signin: async (data: { email: string; password: string }) => {
    const response = await api.post<AuthResponse>("/auth/signin", data);

    return response.data;
  },
};

export const userApi = {
  getCurrentUser: async () => {
    const response = await api.get<{ user: User }>("/users/me");
    return response.data.user;
  },
};

export const notesApi = {
  getNotes: async () => {
    const response = await api.get<{ notes: Note[] }>("/notes");
    return response.data.notes;
  },
  createNote: async (content: Note) => {
    const response = await api.post<Note>("/notes", content);
    return response.data;
  },
  updateNote: async (content: Partial<Note>) => {
    const response = await api.put<Note>(`/notes/${content._id}`, content);
    return response.data;
  },
  deleteNote: async (id: string) => {
    await api.delete(`/notes/${id}`);
  },
};

export default api;
