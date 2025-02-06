export interface User {
  name: string;
  email: string;
  dateOfBirth?: string;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  userId?: string;
  isFavorite: boolean;
  isAudio: boolean;
  isNew: boolean;
  createdAt: string;
}

export interface AuthResponse {
  user?: User;
  token: string;
}
