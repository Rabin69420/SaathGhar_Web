"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { handleCreateListing, handleUploadMedia } from "@/lib/actions/listings-action";

export default function NewListingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [title, setTitle] = useState("");
  const [rent, setRent] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !rent.trim() || !location.trim() || !description.trim() || !imageFile) {
      setErrorMsg("All fields except video are required!");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      // 1. Upload Listing Image
      setUploadProgress(10);
      const imgFormData = new FormData();
      imgFormData.append("file", imageFile);
      const imgUploadRes = await handleUploadMedia(imgFormData);
      if (!imgUploadRes.success || !imgUploadRes.filename) {
        throw new Error(imgUploadRes.message || "Failed to upload image.");
      }
      const uploadedImageFilename = imgUploadRes.filename;

      // 2. Upload Listing Video (If selected)
      let uploadedVideoFilename: string | undefined = undefined;
      if (videoFile) {
        setUploadProgress(50);
        const vidFormData = new FormData();
        vidFormData.append("file", videoFile);
        const vidUploadRes = await handleUploadMedia(vidFormData);
        if (vidUploadRes.success && vidUploadRes.filename) {
          uploadedVideoFilename = vidUploadRes.filename;
        }
      }

      setUploadProgress(80);

      // 3. Submit room details
      const listingInput = {
        title,
        description,
        rent: parseFloat(rent),
        location,
        image: uploadedImageFilename,
        video: uploadedVideoFilename
      };

      const submitRes = await handleCreateListing(listingInput);
      setUploadProgress(100);

      if (submitRes.success) {
        alert("Listing posted successfully!");
        router.push("/dashboard");
      } else {
        throw new Error(submitRes.message || "Failed to submit room details.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 py-8 px-6 md:px-12 flex justify-center items-center">
      <div className="max-w-2xl w-full bg-white rounded-2xl border border-slate-100 shadow-md p-8">
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Post a Room Listing</h1>
            <p className="text-slate-500 text-sm mt-0.5">Fill in the details to publish your room.</p>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg font-semibold mb-6">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Room / Flat Title</label>
            <input
              type="text"
              placeholder="e.g. Spacious flat near Softwarica College"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm text-slate-700"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Monthly Rent (Rs.)</label>
              <input
                type="number"
                placeholder="e.g. 12000"
                value={rent}
                onChange={(e) => setRent(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm text-slate-700"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Location / City</label>
              <input
                type="text"
                placeholder="e.g. Dillibazar, Kathmandu"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm text-slate-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
            <textarea
              rows={4}
              placeholder="Describe room amenities, roommates policy, roommate preferences..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm text-slate-700"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Room Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Room Video (Optional)</label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
              />
            </div>
          </div>

          {loading && uploadProgress > 0 && (
            <div className="space-y-2">
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-teal-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-center text-slate-500 font-semibold">
                Uploading assets: {uploadProgress}%
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Publishing Room...
              </>
            ) : (
              "Publish Room Listing"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
