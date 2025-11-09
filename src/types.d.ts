export interface User {
  _id: string;
  email: string;
  role: "viewer" | "editor" | "admin";
  token: string;
}

export interface Video {
  _id: string;
  title: string;
  filename: string;
  originalName: string;
  userId: string;
  status: "uploading" | "processing" | "completed" | "failed";
  sensitivity: "safe" | "flagged" | "pending";
  fileSize: number;
  duration?: number;
  mimeType: string;
  uploadedAt: string;
}

export interface VideoProgress {
  videoId: string;
  status?: string;
  sensitivity?: string;
  progress: number;
}
