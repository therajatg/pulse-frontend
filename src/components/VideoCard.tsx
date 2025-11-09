import React from "react";
import type { Video } from "../types";

interface VideoCardProps {
  video: Video;
  onPlay: (video: Video) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onPlay }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSensitivityColor = (sensitivity: string) => {
    switch (sensitivity) {
      case "safe":
        return "bg-blue-100 text-blue-800";
      case "flagged":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold truncate">{video.title}</h3>
      </div>

      <div className="flex gap-2 mb-3">
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
            video.status
          )}`}
        >
          {video.status}
        </span>
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${getSensitivityColor(
            video.sensitivity
          )}`}
        >
          {video.sensitivity}
        </span>
      </div>

      <div className="text-sm text-gray-600 mb-3">
        <p>Size: {(video.fileSize / (1024 * 1024)).toFixed(2)} MB</p>
        <p>Uploaded: {new Date(video.uploadedAt).toLocaleDateString()}</p>
      </div>

      {video.status === "completed" && (
        <button
          onClick={() => onPlay(video)}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Play Video
        </button>
      )}

      {video.status === "processing" && (
        <div className="w-full bg-gray-200 rounded h-2">
          <div
            className="bg-blue-600 h-2 rounded animate-pulse"
            style={{ width: "50%" }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default VideoCard;
