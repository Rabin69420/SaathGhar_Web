"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { handleGetListingById, handleUpdateListing, handleUploadMedia } from "@/lib/actions/listings-action";

export default function EditListingPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [rent, setRent] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  useEffect(() => {
    const loadListing = async () => {
      if (!params.id) return;
      const res = await handleGetListingById(params.id as string);
      if (res.success && res.data) {
        setTitle(res.data.title);
        setRent(String(res.data.rent));
        setLocation(res.data.location);
        setDescription(res.data.description);
        setCurrentImage(res.data.image);
      } else {
        toast.error("Failed to load listing");
        router.push("/dashboard");
      }
      setLoading(false);
    };
    loadListing();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !rent.trim() || !location.trim() || !description.trim()) {
      toast.error("All fields are required");
      return;
    }

    setSubmitting(true);
    try {
      const updateData: Record<string, string | number> = {
        title,
        description,
        rent: parseFloat(rent),
        location,
      };

      if (imageFile) {
        const imgFormData = new FormData();
        imgFormData.append("file", imageFile);
        const imgRes = await handleUploadMedia(imgFormData);
        if (imgRes.success && imgRes.filename) {
          updateData.image = imgRes.filename;
        }
      }

      if (videoFile) {
        const vidFormData = new FormData();
        vidFormData.append("file", videoFile);
        const vidRes = await handleUploadMedia(vidFormData);
        if (vidRes.success && vidRes.filename) {
          updateData.video = vidRes.filename;
        }
      }

      const res = await handleUpdateListing(params.id as string, updateData);
      if (res.success) {
        toast.success("Listing updated successfully!");
        router.push(`/dashboard/listings/${params.id}`);
      } else {
        toast.error(res.message || "Failed to update listing");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  const imageUrl = currentImage?.startsWith("http")
    ? currentImage
    : `http://localhost:8089/uploads/${currentImage}`;

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 py-8 px-6 md:px-12 flex justify-center items-start">
      <div className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-md p-8">
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Edit Room Listing</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Update the details of your listing.</p>
          </div>
        </div>

        {currentImage && (
          <div className="mb-6 rounded-xl overflow-hidden h-48 bg-slate-100 dark:bg-slate-800">
            <img src={imageUrl} alt="Current listing" className="w-full h-full object-cover" />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Room / Flat Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm text-slate-700 dark:text-slate-200"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Monthly Rent (Rs.)</label>
              <input
                type="number"
                value={rent}
                onChange={(e) => setRent(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm text-slate-700 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Location / City</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm text-slate-700 dark:text-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm text-slate-700 dark:text-slate-200"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Replace Image (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 dark:file:bg-teal-950 dark:file:text-teal-300"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Replace Video (Optional)</label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 dark:file:bg-teal-950 dark:file:text-teal-300"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Updating...
              </>
            ) : (
              "Update Listing"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
