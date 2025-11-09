import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { videoAPI } from "../services/api";
import type { Video, VideoProgress } from "../types";
import { useAuth } from "../context/AuthContext";
import { getSocket } from "../services/socket";
import VideoCard from "../components/VideoCard";
import VideoPlayer from "../components/VideoPlayer";

const Dashboard: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [filter, setFilter] = useState({ status: "", sensitivity: "" });
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fetchVideos = async () => {
    try {
      const response = await videoAPI.getAll(filter);
      setVideos(response.data.videos);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [filter]);

  useEffect(() => {
    const socket = getSocket();

    if (socket) {
      socket.on("video:processing", (data: VideoProgress) => {
        setVideos((prev) =>
          prev.map((v) =>
            v._id === data.videoId ? { ...v, status: "processing" } : v
          )
        );
      });

      socket.on("video:progress", (data: VideoProgress) => {
        console.log("Progress:", data);
      });

      socket.on("video:completed", (data: VideoProgress) => {
        setVideos((prev) =>
          prev.map((v) => {
            if (v._id === data.videoId) {
              return {
                ...v,
                status: "completed" as const,
                sensitivity:
                  (data.sensitivity as "safe" | "flagged") || v.sensitivity,
              };
            }
            return v;
          })
        );
      });

      socket.on("video:failed", (data: VideoProgress) => {
        setVideos((prev) =>
          prev.map((v) =>
            v._id === data.videoId ? { ...v, status: "failed" } : v
          )
        );
      });
    }

    return () => {
      if (socket) {
        socket.off("video:processing");
        socket.off("video:progress");
        socket.off("video:completed");
        socket.off("video:failed");
      }
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const canUpload = user?.role === "editor" || user?.role === "admin";

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Video Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              {user?.email} ({user?.role})
            </span>
            {canUpload && (
              <button
                onClick={() => navigate("/upload")}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Upload Video
              </button>
            )}
            <button
              onClick={handleLogout}
              className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h3 className="font-semibold mb-3">Filters</h3>
          <div className="flex gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Status</label>
              <select
                value={filter.status}
                onChange={(e) =>
                  setFilter({ ...filter, status: e.target.value })
                }
                className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">All</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Sensitivity
              </label>
              <select
                value={filter.sensitivity}
                onChange={(e) =>
                  setFilter({ ...filter, sensitivity: e.target.value })
                }
                className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">All</option>
                <option value="safe">Safe</option>
                <option value="flagged">Flagged</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Videos Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading videos...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No videos found</p>
            {canUpload && (
              <button
                onClick={() => navigate("/upload")}
                className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
              >
                Upload Your First Video
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <VideoCard
                key={video._id}
                video={video}
                onPlay={setSelectedVideo}
              />
            ))}
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayer
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
