import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { toast } from "react-toastify";

import {
  useActivateVideoMutation,
  useDeleteOnboardingVideoMutation,
  useGetOnboardingVideosQuery,
} from "../../api/onBoardingApi";

import LibraryVideoCard from "./OnBoarding/LibraryVideoCard";
import VideoDrawer from "./OnBoarding/VideoDrawer";
import SpotlightVideoCard, { canManageVideos } from "./OnBoarding/VideoCard";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";

const OnBoarding = () => {
  const {
    data: videos = [],
    isLoading,
    isError,
    refetch,
  } = useGetOnboardingVideosQuery(undefined);
  const { role } = useSelector((state: RootState) => state.auth);
  const [deleteVideo] = useDeleteOnboardingVideoMutation();
  const [activateVideo] = useActivateVideoMutation();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [search, setSearch] = useState("");

  // FILTER
  const filteredVideos = useMemo(() => {
    if (!search) return videos;

    return videos.filter(
      (v: any) =>
        v.title?.toLowerCase().includes(search.toLowerCase()) ||
        v.description?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [videos, search]);

  const activeVideo = filteredVideos.find((v: any) => v.is_active);

  const inactiveVideos = filteredVideos.filter((v: any) => !v.is_active);

  // HANDLERS
  const handleCreate = () => {
    setEditingVideo(null);
    setDrawerOpen(true);
  };

  const handleEdit = (video: any) => {
    setEditingVideo(video);
    setDrawerOpen(true);
  };

  const handleDelete = async (id: any) => {
    if (!window.confirm("Delete this video?")) return;

    try {
      await deleteVideo(id).unwrap();
      toast.success("Video deleted");
    } catch {
      toast.error("Failed to delete video");
    }
  };

  const handleActivate = async (id: any) => {
    try {
      await activateVideo(id).unwrap();
      toast.success("Video activated");
    } catch {
      toast.error("Failed to activate video");
    }
  };

  // LOADING
  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-10 w-64 bg-gray-200 animate-pulse rounded" />
        <div className="grid grid-cols-3 gap-4">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="h-40 bg-gray-200 rounded-xl animate-pulse"
              />
            ))}
        </div>
      </div>
    );
  }

  // ERROR
  if (isError) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Failed to load videos</p>
        <button onClick={refetch} className="mt-3 text-blue-600">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-10 bg-gray-50 min-h-screen">
      {/* HEADER */}
      {canManageVideos(role) && (
        <>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold">
                Onboarding Experience Center
              </h1>

              <p className="text-gray-500 mt-2">
                Manage how users experience onboarding
              </p>
            </div>

            <button
              onClick={handleCreate}
              className="flex flex-row items-center h-fit py-2 gap-x-2   rounded-xl text-white bg-linear-to-r from-blue-600 to-purple-600 hover:scale-105 transition"
            >
              <Plus size={18} />
              Upload Video
            </button>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl shadow">
              <p className="text-gray-500">Total Videos</p>
              <h2 className="text-3xl font-bold">{videos.length}</h2>
            </div>

            <div className="bg-green-500 text-white p-5 rounded-xl shadow">
              <p>Active Video</p>
              <h2 className="text-3xl font-bold">
                {activeVideo ? "Live" : "None"}
              </h2>
            </div>

            <div className="bg-white p-5 rounded-xl shadow">
              <p className="text-gray-500">Inactive</p>
              <h2 className="text-3xl font-bold">{inactiveVideos.length}</h2>
            </div>
          </div>
        </>
      )}
      {!canManageVideos(role) && (
        <div>
          <h1 className="text-md md:text-xl lg:text-2xl font-bold text-gray-600">
            Glab Your experiences On Kigali Microloans Sytem
          </h1>
          <span className="text-gray-600">
            {" "}
            Get familiar with our System by watching different Videos
          </span>
        </div>
      )}

      {/* SEARCH */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search videos..."
          className="w-full border rounded-lg pl-10 py-2"
        />
      </div>

      {/* SPOTLIGHT */}
      {activeVideo && (
        <div>
          <h2 className="text-xl font-bold mb-4">Active Onboarding Video</h2>

          <SpotlightVideoCard
            video={activeVideo}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      )}

      {/* LIBRARY */}
      <div>
        <h2 className="text-xl font-bold mb-4">Video Library</h2>

        {inactiveVideos.length === 0 ? (
          <div className="text-center py-20 border rounded-xl bg-white">
            <p className="text-gray-500">No onboarding videos found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {inactiveVideos.map((video: any) => (
              <LibraryVideoCard
                key={video.id}
                video={video}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onActivate={handleActivate}
              />
            ))}
          </div>
        )}
      </div>

      {/* DRAWER */}
      <VideoDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        editingVideo={editingVideo}
      />
    </div>
  );
};

export default OnBoarding;
