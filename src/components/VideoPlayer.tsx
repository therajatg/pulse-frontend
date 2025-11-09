import { useRef, useEffect } from "react";
import type { Video } from "../types";
import { videoAPI } from "../services/api";

interface VideoPlayerProps {
  video: Video;
  onClose: () => void;
}

const VideoPlayer = ({ video, onClose }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [video]);

  const streamUrl = `${videoAPI.getStreamUrl(video._id)}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">{video.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-4">
          <video
            ref={videoRef}
            controls
            className="w-full rounded"
            src={streamUrl}
          >
            Your browser does not support the video tag.
          </video>

          <div className="mt-4 text-sm text-gray-600">
            <p>
              <strong>Status:</strong> {video.status}
            </p>
            <p>
              <strong>Sensitivity:</strong> {video.sensitivity}
            </p>
            <p>
              <strong>Size:</strong>{" "}
              {(video.fileSize / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
