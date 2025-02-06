export interface Note {
  _id?: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  isAudio?: boolean;
  audioDuration?: number;
  isNew?: boolean;
  isFavorite?: boolean;
  images?: string[];
}

export interface NoteFormData {
  title: string;
  content: string;
  images?: string[];
}
