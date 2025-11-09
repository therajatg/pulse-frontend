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
  s3Key: string; // NEW
  s3Url?: string; // NEW
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
