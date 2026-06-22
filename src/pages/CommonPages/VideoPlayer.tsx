import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { url } from "../../url";
import Header from "../../components/PageHeader";

export default function VideoPlayer() {
  const { id } = useParams();

  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${url}/api/onboarding/video/${id}/`);

        if (!res.ok) throw new Error("Failed to load video");

        const data = await res.json();
        setVideo(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;

    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration;

    if (duration) {
      const percent = Math.floor((current / duration) * 100);
      setProgress(percent);
    }
  };

  const markCompleted = () => {
    setCompleted(true);

    // optional backend call
    // fetch(`${url}/api/video-progress/`, { method: "POST", ... })
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="max-w-5xl mx-auto mt-10 p-6 animate-pulse">
          <div className="h-6 w-1/3 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-2/3 bg-gray-200 rounded mb-8"></div>
          <div className="h-[300px] bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      <div className="relative mt-[10vh]">
        {/* Background Glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-600/20 blur-[180px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-8">
          {/* Spotlight Video */}
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black">
            {video?.video_url ? (
              <video
                ref={videoRef}
                controls
                onTimeUpdate={handleTimeUpdate}
                className="w-full aspect-video"
              >
                <source src={video.video_url} type="video/mp4" />
              </video>
            ) : (
              <div className="aspect-video flex items-center justify-center bg-slate-900">
                <p className="text-slate-400">No video available</p>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="mt-10 grid lg:grid-cols-[1fr_320px] gap-8">
            {/* Main */}
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm">
                Spotlight Lesson
              </span>

              <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">
                {video?.title}
              </h1>

              <p className="mt-5 text-slate-300 text-lg leading-relaxed max-w-3xl">
                {video?.description}
              </p>

              {/* Progress */}
              <div className="mt-10">
                <div className="flex justify-between text-sm text-slate-400 mb-3">
                  <span>Your Progress</span>
                  <span>{progress}%</span>
                </div>

                <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={markCompleted}
                  className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                    completed
                      ? "bg-emerald-500 text-white"
                      : "bg-blue-600 hover:bg-blue-500 text-white hover:scale-105"
                  }`}
                >
                  {completed ? "✓ Completed" : "Mark as Completed"}
                </button>

                <button
                  className="
                  px-6 py-3
                  rounded-2xl
                  bg-white/5
                  border border-white/10
                  hover:bg-white/10
                  transition
                "
                >
                  Skip
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="sticky top-24 space-y-6">
                <div className="rounded-3xl bg-white/5 border border-white/10 p-6 backdrop-blur-xl">
                  <h3 className="font-semibold text-lg">Learning Status</h3>

                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-slate-400">Progress</span>

                    <span className="font-semibold">{progress}%</span>
                  </div>

                  {/* <div className="mt-4 flex items-center justify-between">
                    <span className="text-slate-400">Completed</span>

                    <span
                      className={
                        completed ? "text-emerald-400" : "text-amber-400"
                      }
                    >
                      {completed ? "Yes" : "In Progress"}
                    </span>
                  </div> */}
                </div>

                <div className="rounded-3xl bg-blue-500/10 border border-blue-500/20 p-6">
                  <h4 className="font-semibold text-blue-300">💡 Quick Tip</h4>

                  <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                    Watch the full lesson before marking it complete to get the
                    most value from your onboarding experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
