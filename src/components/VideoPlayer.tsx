import React, { useRef, useEffect, useState } from "react";
import type { Video } from "../types";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

interface VideoPlayerProps {
  video: Video;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { user } = useAuth();
  const [streamUrl, setStreamUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStreamUrl = async () => {
      try {
        setLoading(true);
        const API_URL =
          import.meta.env.VITE_API_URL || "https://mockerchat.hulkbase.com/api";
        const response = await axios.get(
          `${API_URL}/videos/stream/${video._id}?token=${user?.token}`
        );
        setStreamUrl(response.data.streamUrl);
      } catch (err: any) {
        console.error("Error fetching stream URL:", err);
        setError(err.response?.data?.message || "Failed to load video");
      } finally {
        setLoading(false);
      }
    };

    if (user && video) {
      fetchStreamUrl();
    }
  }, [video, user]);

  useEffect(() => {
    if (videoRef.current && streamUrl) {
      videoRef.current.load();
    }
  }, [streamUrl]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center p-4 border-b bg-white sticky top-0 z-10">
          <h2 className="text-xl font-bold">{video.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 text-2xl font-bold w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        <div className="p-4">
          {loading && (
            <div className="flex items-center justify-center h-96 bg-gray-100 rounded">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading video...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {!loading && !error && streamUrl && (
            <div className="bg-black rounded overflow-hidden">
              <video
                ref={videoRef}
                controls
                controlsList="nodownload"
                className="w-full max-h-[70vh] object-contain"
                src={streamUrl}
                style={{ display: "block" }}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          <div className="mt-4 p-4 bg-gray-50 rounded text-sm text-gray-600">
            <div className="grid grid-cols-2 gap-2">
              <p>
                <strong>Status:</strong>{" "}
                <span className="text-green-600">{video.status}</span>
              </p>
              <p>
                <strong>Sensitivity:</strong>{" "}
                <span
                  className={
                    video.sensitivity === "safe"
                      ? "text-blue-600"
                      : "text-red-600"
                  }
                >
                  {video.sensitivity}
                </span>
              </p>
              <p>
                <strong>Size:</strong>{" "}
                {(video.fileSize / (1024 * 1024)).toFixed(2)} MB
              </p>
              <p>
                <strong>Type:</strong> {video.mimeType}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
