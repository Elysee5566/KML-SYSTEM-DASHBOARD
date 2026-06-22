import { useEffect, useState } from "react";
import { X, Video, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";

import {
  useCreateOnboardingVideoMutation,
  useUpdateOnboardingVideoMutation,
} from "../../../api/onBoardingApi";

const VideoDrawer = ({ open, onClose, editingVideo }: any) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [video, setVideo] = useState<File | null>(null);
  const [isActive, setIsActive] = useState(true);

  //   const videoPreview = useRef<HTMLVideoElement | null>(null);

  const [createVideo, { isLoading }] = useCreateOnboardingVideoMutation();

  const [updateVideo, { isLoading: isUpdating }] =
    useUpdateOnboardingVideoMutation();

  // RESET / FILL FORM
  useEffect(() => {
    if (editingVideo) {
      setTitle(editingVideo.title || "");
      setDescription(editingVideo.description || "");
      setIsActive(editingVideo.is_active);
      setCategory(editingVideo.category);
      setVideo(null);
    } else {
      setTitle("");
      setDescription("");
      setIsActive(true);
      setVideo(null);
    }
  }, [editingVideo, open]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("is_active", String(isActive));
    formData.append("category", category);
    if (video) {
      formData.append("video", video);
    }

    try {
      if (editingVideo) {
        await updateVideo({
          id: editingVideo.id,
          formData,
        }).unwrap();

        toast.success("Video updated successfully");
      } else {
        await createVideo(formData).unwrap();
        toast.success("Video uploaded successfully");
      }

      onClose();
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* OVERLAY */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* DRAWER */}
      <div className="ml-auto w-full sm:w-120 h-full bg-white shadow-2xl flex flex-col z-50">
        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b bg-linear-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-lg font-semibold">
              {editingVideo ? "Edit Video" : "Upload New Video"}
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Manage onboarding experience content
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X />
          </button>
        </div>

        {/* BODY */}
        <form
          onSubmit={handleSubmit}
          className="p-5 space-y-5 overflow-y-auto flex-1"
        >
          {/* MODE BANNER */}
          <div
            className={`p-3 rounded-xl text-sm flex items-center gap-2 ${
              editingVideo
                ? "bg-amber-50 text-amber-700 border border-amber-200"
                : "bg-blue-50 text-blue-700 border border-blue-200"
            }`}
          >
            {editingVideo ? (
              <>
                <Video size={16} />
                Editing existing onboarding video
              </>
            ) : (
              <>
                <CheckCircle size={16} />
                Creating new onboarding video
              </>
            )}
          </div>

          {/* TITLE */}
          <div>
            <label className="text-sm text-gray-600">Video Title</label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
              className="w-full mt-1 border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Video Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full mt-1 border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="login">Login / Signup</option>
              <option value="application">Loan Application</option>
              <option value="payment">Payment Flow</option>
              <option value="contract">Contract Signing</option>
            </select>

            <p className="text-xs text-gray-400 mt-1">
              This determines where the video will be used in the app
            </p>
          </div>
          {/* DESCRIPTION */}
          <div>
            <label className="text-sm text-gray-600">Description</label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe this onboarding video..."
              className="w-full mt-1 border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* VIDEO UPLOAD */}
          <div>
            <label className="text-sm text-gray-600">Upload Video</label>

            <div className="mt-2 border-2 border-dashed rounded-xl p-4 text-center hover:border-blue-400 transition">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideo(e.target.files?.[0] || null)}
                className="w-full"
              />

              {video && (
                <p className="text-xs text-gray-500 mt-2">
                  Selected: {video.name}
                </p>
              )}
            </div>
          </div>

          {/* ACTIVE TOGGLE (MODERN SWITCH) */}
          <div className="flex items-center justify-between p-3 rounded-xl border bg-gray-50">
            <div>
              <p className="text-sm font-medium">Set as Active Video</p>

              <p className="text-xs text-gray-500">
                This video will be shown to new users
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                isActive ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full shadow-md transform transition ${
                  isActive ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={isLoading || isUpdating}
            className="w-full py-3 rounded-xl text-white font-medium bg-linear-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] transition"
          >
            {editingVideo
              ? isUpdating
                ? "Updating..."
                : "Update Video"
              : isLoading
                ? "Uploading..."
                : "Upload Video"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VideoDrawer;
