import { useRef, useState } from "react";
import { Edit, Trash2, CheckCircle, Play, Pause } from "lucide-react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import { canManageVideos } from "./VideoCard";

const LibraryVideoCard = ({ video, onEdit, onDelete, onActivate }: any) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const { role } = useSelector((state: RootState) => state.auth);
  const togglePlay = () => {
    if (!videoRef.current) return;

    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }

    setPlaying(!playing);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white border rounded-xl shadow-sm hover:shadow-md overflow-hidden"
    >
      {/* VIDEO AREA */}
      <div className="relative aspect-video bg-black group">
        <video
          ref={videoRef}
          controls
          src={video.video_url}
          className="h-full w-full object-cover"
          onEnded={() => setPlaying(false)}
        />

        {/* PLAY OVERLAY */}
        <div
          onClick={togglePlay}
          className="absolute inset-0 bg-black/20 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition"
        >
          {playing ? (
            <Pause className="text-white" size={30} />
          ) : (
            <Play className="text-white" size={30} />
          )}
        </div>

        {/* ACTIVE BADGE */}
        {canManageVideos(role) && (
          <div className="absolute top-2 left-2">
            {video.is_active ? (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <CheckCircle size={12} />
                Active
              </span>
            ) : (
              <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded-full">
                Inactive
              </span>
            )}
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 line-clamp-1">
          {video.title}
        </h3>

        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
          {video.description}
        </p>
      </div>

      {/* ACTIONS */}
      {!video.is_active && role !== "client" && role !== "reviewer" && (
        <div className="flex items-center justify-between border-t p-3 bg-gray-50">
          {/* EDIT */}
          <button
            onClick={() => onEdit(video)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Edit size={18} />
          </button>

          {/* ACTIVATE */}

          <button
            onClick={() => onActivate(video.id)}
            className="flex items-center gap-1 text-green-600 hover:text-green-800 font-medium"
          >
            <CheckCircle size={18} />
            Activate
          </button>

          {/* DELETE */}
          <button
            onClick={() => onDelete(video.id)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default LibraryVideoCard;
