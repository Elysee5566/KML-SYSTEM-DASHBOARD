import { useRef, useState } from "react";
import {
  Play,
  Pause,
  Edit,
  Trash2,
  Volume2,
  VolumeX,
  Maximize,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";

interface Props {
  video: any;
  onEdit: (video: any) => void;
  onDelete: (id: number) => void;
}
export const canManageVideos = (role: any) => {
  return ["admin", "manager"].includes(role);
};
const SpotlightVideoCard = ({ video, onEdit, onDelete }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const { role } = useSelector((state: RootState) => state.auth);
  console.log(role);
  const togglePlay = () => {
    if (!videoRef.current) return;

    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }

    setPlaying(!playing);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;

    videoRef.current.muted = !muted;
    setMuted(!muted);
  };

  const fullscreen = () => {
    videoRef.current?.requestFullscreen();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-3xl shadow-2xl bg-black"
    >
      {/* VIDEO */}
      <div className="relative aspect-21/9">
        <video
          ref={videoRef}
          src={video.video_url}
          muted={muted}
          autoPlay
          className="h-full w-full object-cover"
          loop
          onEnded={() => setPlaying(false)}
        />

        {/* DARK CINEMATIC OVERLAY */}
        <div className="absolute inset-0 bg-linear-to-r from-black via-black/70 to-transparent" />

        {/* GREEN GLOW BORDER */}
        <div className="absolute inset-0 ring-2 ring-green-500/30 rounded-3xl shadow-[0_0_120px_rgba(34,197,94,0.25)]" />

        {/* CONTENT */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-10">
          {/* TOP BAR */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 rounded-full bg-green-500/20 px-4 py-2 border border-green-400/30 backdrop-blur-md">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-sm text-green-100 font-medium">
                ACTIVE ONBOARDING VIDEO
              </span>
              {video.category && (
                <span className="text-sm text-green-100 font-medium">
                  {video.category}
                </span>
              )}
            </div>

            {canManageVideos(role) && (
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(video)}
                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md"
                >
                  <Edit className="h-5 w-5 text-white" />
                </button>

                <button
                  onClick={() => onDelete(video.id)}
                  className="p-3 rounded-full bg-red-500/20 hover:bg-red-500/30 backdrop-blur-md"
                >
                  <Trash2 className="h-5 w-5 text-red-200" />
                </button>
              </div>
            )}
          </div>

          {/* CENTER CONTENT */}
          <div className="max-w-2xl">
            <p className="text-xs tracking-[0.3em] text-green-300 mb-2">
              ONBOARDING EXPERIENCE
            </p>

            <h1 className="text-4xl md:text-6xl font-bold text-white">
              {video.title}
            </h1>

            <p className="text-gray-300 mt-4 line-clamp-3">
              {video.description}
            </p>

            {/* ACTIONS */}
            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={togglePlay}
                className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-semibold hover:scale-105 transition"
              >
                {playing ? (
                  <>
                    <Pause size={18} /> Pause
                  </>
                ) : (
                  <>
                    <Play size={18} /> Play
                  </>
                )}
              </button>

              <button
                onClick={toggleMute}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20"
              >
                {muted ? (
                  <VolumeX className="text-white" />
                ) : (
                  <Volume2 className="text-white" />
                )}
              </button>

              <button
                onClick={fullscreen}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20"
              >
                <Maximize className="text-white" />
              </button>
            </div>
          </div>

          {/* FOOTER */}
          <div className="text-sm text-gray-300 flex items-center gap-6">
            <span>
              Created: {new Date(video.created_at).toLocaleDateString()}
            </span>

            <span className="flex items-center gap-2">
              <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
              Live for all new users
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SpotlightVideoCard;
