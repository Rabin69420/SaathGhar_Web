"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { handleGetListingById, handleDeleteListing, handleGetBookmarkedListings, handleToggleBookmark, handleCheckCompatibility } from "@/lib/actions/listings-action";
import { handleWhoami } from "@/lib/actions/auth-action";
import { handleCreateApplication } from "@/lib/actions/applications-action";
import { handleGetReviewsForListing } from "@/lib/actions/reviews-action";
import { handleGetKycStatus } from "@/lib/actions/kyc-action";
import { toast } from "react-toastify";
import ConfirmModal from "@/app/component/common/ConfirmModal";
import StarRating from "@/app/component/common/StarRating";
import Link from "next/link";

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  const [compatibilityResult, setCompatibilityResult] = useState<any>(null);
  const [checkingCompatibility, setCheckingCompatibility] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applyMessage, setApplyMessage] = useState("");
  const [applyingSubmitting, setApplyingSubmitting] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [kycVerified, setKycVerified] = useState<boolean | null>(null);

  // Preference states for checker
  const [cleanliness, setCleanliness] = useState("Medium");
  const [noiseLevel, setNoiseLevel] = useState("Moderate");
  const [sleepSchedule, setSleepSchedule] = useState("Flexible");
  const [diet, setDiet] = useState("No preference");
  const [smoking, setSmoking] = useState("Non-smoker");
  const [pets, setPets] = useState("Pet friendly");
  const [guests, setGuests] = useState("Occasionally");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const initializePreferences = (userObj: any) => {
    if (!userObj || !userObj.preferences) return;
    const p = userObj.preferences;
    if (p.cleanliness) setCleanliness(p.cleanliness);
    if (p.noiseLevel) setNoiseLevel(p.noiseLevel);
    if (p.sleepSchedule) setSleepSchedule(p.sleepSchedule);
    if (p.diet) setDiet(p.diet);
    if (p.smoking) setSmoking(p.smoking);
    if (p.pets) setPets(p.pets);
    if (p.guests) setGuests(p.guests);
    if (p.additionalInfo) setAdditionalInfo(p.additionalInfo);
  };

  const checkBookmarkStatus = async (userObj: any) => {
    if (!userObj || !params.id) return;
    const res = await handleGetBookmarkedListings();
    if (res.success && res.data) {
      const bookmarked = res.data.some((b: any) => b._id === params.id);
      setIsBookmarked(bookmarked);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const res = await handleWhoami();
      if (res.success && res.data) {
        setCurrentUser(res.data);
        checkBookmarkStatus(res.data);
        initializePreferences(res.data);
      }
    };
    const fetchKycStatus = async () => {
      const res = await handleGetKycStatus();
      if (res.success && res.data) {
        setKycVerified(res.data.kycStatus === "verified");
      }
    };
    fetchUser();
    fetchKycStatus();
  }, [params.id]);

  const loadListing = async () => {
    if (!params.id) return;
    setLoading(true);
    const res = await handleGetListingById(params.id as string);
    if (res.success && res.data) {
      setListing(res.data);
    } else {
      toast.error(res.message || "Failed to load listing details");
      router.push("/dashboard");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadListing();
    loadReviews();
  }, [params.id]);

  const loadReviews = async () => {
    if (!params.id) return;
    const res = await handleGetReviewsForListing(params.id as string);
    if (res.success) {
      setReviews(res.data || []);
    }
  };

  const handleApply = async () => {
    if (applyMessage.length < 10) {
      toast.error("Application message must be at least 10 characters");
      return;
    }
    setApplyingSubmitting(true);
    const res = await handleCreateApplication({ listing: params.id as string, message: applyMessage });
    if (res.success) {
      toast.success("Application submitted successfully!");
      setApplyModalOpen(false);
      setApplyMessage("");
    } else {
      toast.error(res.message);
    }
    setApplyingSubmitting(false);
  };

  const runCompatibilityCheck = async () => {
    if (!params.id) return;
    setCheckingCompatibility(true);
    setCompatibilityResult(null);
    const customPrefs = {
      cleanliness,
      noiseLevel,
      sleepSchedule,
      diet,
      smoking,
      pets,
      guests,
      additionalInfo
    };
    const res = await handleCheckCompatibility(params.id as string, customPrefs);
    if (res.success && res.data) {
      setCompatibilityResult(res.data);
    } else {
      toast.error(res.message || "Failed to analyze compatibility");
    }
    setCheckingCompatibility(false);
  };

  const handleBookmarkToggle = async () => {
    if (!currentUser || !listing) {
      toast.warning("Please log in to bookmark room listings.");
      return;
    }
    const res = await handleToggleBookmark(listing._id);
    if (res.success) {
      setIsBookmarked(!isBookmarked);
    } else {
      toast.error(res.message);
    }
  };

  const handleDelete = async () => {
    if (!listing) return;
    const res = await handleDeleteListing(listing._id);
    if (res.success) {
      toast.success("Listing deleted successfully!");
      router.push("/dashboard");
    } else {
      toast.error(res.message);
    }
    setDeleteConfirmOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!listing) return null;

  const isOwner = currentUser && listing.owner && (listing.owner._id === currentUser._id || listing.owner === currentUser._id);
  const imageUrl = listing.image.startsWith("http")
    ? listing.image
    : `http://localhost:8089/uploads/${listing.image}`;

  const videoUrl = listing.video
    ? listing.video.startsWith("http")
      ? listing.video
      : `http://localhost:8089/uploads/${listing.video}`
    : null;

  return (
    <div className="min-h-screen w-full bg-slate-50 py-8 px-6 md:px-12">
      <div className="max-w-4xl mx-auto bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        {/* Navigation/Back & Owner Actions bar */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-teal-600 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Dashboard
          </button>

          <div className="flex items-center gap-3">
            {currentUser && (
              <button
                onClick={handleBookmarkToggle}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all active:scale-95 flex items-center gap-1.5 border ${
                  isBookmarked
                    ? "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-rose-500"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill={isBookmarked ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                {isBookmarked ? "Bookmarked" : "Bookmark Room"}
              </button>
            )}

            {isOwner && (
              <>
                <Link
                  href={`/dashboard/listings/${listing._id}/edit`}
                  className="px-4 py-2 text-sm font-semibold text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950/30 border border-teal-100 dark:border-teal-900/30 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </Link>
                <button
                  onClick={() => setDeleteConfirmOpen(true)}
                className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 border border-red-100 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete Room
              </button>
              </>
            )}
          </div>
        </div>

        {/* Media (Image/Video) section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 border-b border-slate-100 bg-slate-50/30">
          <div className="relative h-80 rounded-xl overflow-hidden shadow-inner bg-slate-100">
            <img src={imageUrl} alt={listing.title} className="w-full h-full object-cover" />
          </div>
          {videoUrl ? (
            <div className="relative h-80 rounded-xl overflow-hidden shadow-inner bg-black flex items-center justify-center">
              <video src={videoUrl} controls className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className="h-80 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col justify-center items-center text-slate-400 p-6 text-center">
              <svg
                className="w-12 h-12 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <span className="font-semibold text-sm">No video tour available</span>
              <span className="text-xs mt-1">The creator has not attached a video tour for this listing.</span>
            </div>
          )}
        </div>

        {/* Info section */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-1 text-teal-600 text-sm font-bold uppercase tracking-wider mb-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {listing.location}
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800">{listing.title}</h1>
            </div>
            <div className="text-left md:text-right shrink-0">
              <span className="block text-slate-400 text-xs font-bold uppercase tracking-wider">
                Monthly Rent
              </span>
              <span className="text-2xl md:text-3xl font-extrabold text-teal-600">
                Rs. {listing.rent}
              </span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-lg font-bold text-slate-800 mb-3">Room Overview</h2>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">{listing.description}</p>
          </div>

          {/* AI Compatibility Checker Section */}
          {!isOwner && (
          <div className="border-t border-slate-100 pt-6">
            <div className="bg-gradient-to-br from-teal-50/50 to-indigo-50/30 border border-slate-200/50 rounded-2xl p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                    <span className="bg-teal-100 text-teal-700 px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider">AI</span>
                    Lifestyle Compatibility Checker
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">
                    Analyze how well your roommate profile aligns with the landlord's listing preferences.
                  </p>
                </div>
                {currentUser && (
                  <button
                    onClick={() => setIsCustomizing(!isCustomizing)}
                    className="text-xs font-bold text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-1 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs hover:bg-slate-50 active:scale-95"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {isCustomizing ? "Use Default Saved Profile" : "Customize Attributes"}
                  </button>
                )}
              </div>

              {!currentUser ? (
                <div className="bg-white/60 border border-slate-200/50 rounded-xl p-6 text-center">
                  <svg className="w-10 h-10 text-slate-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <p className="text-slate-600 font-semibold text-sm">Authentication Required</p>
                  <p className="text-slate-400 text-xs mt-1">Please log in to your account to check roommate compatibility.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Customized preferences panel */}
                  {isCustomizing && (
                    <div className="bg-white border border-slate-100 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3.5 transition-all text-xs">
                      <div>
                        <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1.5 font-semibold text-[10px]">Cleanliness</label>
                        <select
                          value={cleanliness}
                          onChange={(e) => setCleanliness(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        >
                          <option value="High">High (Tidy)</option>
                          <option value="Medium">Medium (Average)</option>
                          <option value="Low">Low (Relaxed)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1.5 font-semibold text-[10px]">Noise Tolerance</label>
                        <select
                          value={noiseLevel}
                          onChange={(e) => setNoiseLevel(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        >
                          <option value="Quiet">Quiet</option>
                          <option value="Moderate">Moderate</option>
                          <option value="Loud">Loud</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1.5 font-semibold text-[10px]">Sleep Schedule</label>
                        <select
                          value={sleepSchedule}
                          onChange={(e) => setSleepSchedule(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        >
                          <option value="Early Bird">Early Bird</option>
                          <option value="Night Owl">Night Owl</option>
                          <option value="Flexible">Flexible</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1.5 font-semibold text-[10px]">Diet Preference</label>
                        <select
                          value={diet}
                          onChange={(e) => setDiet(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        >
                          <option value="No preference">No preference</option>
                          <option value="Vegetarian">Vegetarian</option>
                          <option value="Vegan">Vegan</option>
                          <option value="Non-Vegetarian">Non-Vegetarian</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1.5 font-semibold text-[10px]">Smoking Policy</label>
                        <select
                          value={smoking}
                          onChange={(e) => setSmoking(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        >
                          <option value="Non-smoker">Non-smoker</option>
                          <option value="Smoker">Smoker</option>
                          <option value="Outside only">Outside only</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1.5 font-semibold text-[10px]">Pets Policy</label>
                        <select
                          value={pets}
                          onChange={(e) => setPets(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        >
                          <option value="Pet friendly">Pet friendly</option>
                          <option value="No pets">No pets</option>
                          <option value="Have pets">I have pets</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1.5 font-semibold text-[10px]">Guest Policy</label>
                        <select
                          value={guests}
                          onChange={(e) => setGuests(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        >
                          <option value="No guests">No guests</option>
                          <option value="Occasionally">Occasionally</option>
                          <option value="Frequently">Frequently</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-slate-400 font-bold uppercase tracking-wider mb-1.5 font-semibold text-[10px]">Additional Self-Description</label>
                        <textarea
                          value={additionalInfo}
                          onChange={(e) => setAdditionalInfo(e.target.value)}
                          rows={2}
                          placeholder="Study habits, hobbies, general lifestyle details..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-teal-500 text-xs resize-none"
                        />
                      </div>
                    </div>
                  )}

                  {!compatibilityResult && !checkingCompatibility && (
                    <button
                      onClick={runCompatibilityCheck}
                      className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-all shadow-sm active:scale-99 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Run AI Compatibility Analysis
                    </button>
                  )}

                  {checkingCompatibility && (
                    <div className="w-full bg-white border border-slate-100 rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-4">
                      <div className="relative w-12 h-12">
                        <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-teal-600 border-t-transparent animate-spin"></div>
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">Calculating Match Score...</p>
                        <p className="text-xs text-slate-400 mt-1">AI model is mapping cleanliness, diet, sleep patterns, and noise thresholds.</p>
                      </div>
                    </div>
                  )}

                  {compatibilityResult && (
                    <div className="bg-white border border-slate-150 rounded-xl p-5 space-y-5 animate-fade-in shadow-2xs">
                      {/* Score Gauge & Summary Row */}
                      <div className="flex flex-col sm:flex-row gap-5 items-center pb-4 border-b border-slate-50">
                        {/* Circular Progress Gauge */}
                        <div className="shrink-0 relative w-24 h-24 flex items-center justify-center rounded-full bg-slate-50 shadow-inner">
                          <svg className="w-20 h-20 transform -rotate-90">
                            <circle
                              cx="40"
                              cy="40"
                              r="34"
                              className="stroke-slate-100"
                              strokeWidth="6"
                              fill="transparent"
                            />
                            <circle
                              cx="40"
                              cy="40"
                              r="34"
                              className={`${
                                compatibilityResult.score >= 80
                                  ? "stroke-teal-500"
                                  : compatibilityResult.score >= 60
                                  ? "stroke-indigo-500"
                                  : "stroke-orange-500"
                              } transition-all duration-1000 ease-out`}
                              strokeWidth="6"
                              strokeDasharray={`${2 * Math.PI * 34}`}
                              strokeDashoffset={`${2 * Math.PI * 34 * (1 - compatibilityResult.score / 100)}`}
                              strokeLinecap="round"
                              fill="transparent"
                            />
                          </svg>
                          <div className="absolute flex flex-col items-center justify-center">
                            <span className={`text-xl font-extrabold ${
                              compatibilityResult.score >= 80
                                ? "text-teal-600"
                                : compatibilityResult.score >= 60
                                ? "text-indigo-600"
                                : "text-orange-600"
                            }`}>
                              {compatibilityResult.score}%
                            </span>
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                              Match
                            </span>
                          </div>
                        </div>

                        {/* Summary description */}
                        <div className="flex-1 text-center sm:text-left space-y-1">
                          <h4 className="font-bold text-slate-800 text-sm">Analysis Overview</h4>
                          <p className="text-slate-500 text-xs leading-relaxed">
                            {compatibilityResult.summary}
                          </p>
                        </div>
                      </div>

                      {/* Alignments vs Conflicts */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Alignments */}
                        <div className="space-y-2">
                          <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <svg className="w-3.5 h-3.5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Key Shared Traits
                          </h5>
                          <ul className="space-y-1.5">
                            {compatibilityResult.matchingPoints?.map((pt: string, idx: number) => (
                              <li key={idx} className="text-xs text-slate-600 flex items-start gap-1.5">
                                <span className="text-teal-500 font-bold shrink-0">✓</span>
                                <span>{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Mismatches */}
                        <div className="space-y-2">
                          <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <svg className="w-3.5 h-3.5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Potential Differences
                          </h5>
                          <ul className="space-y-1.5">
                            {compatibilityResult.conflictPoints?.map((pt: string, idx: number) => (
                              <li key={idx} className="text-xs text-slate-600 flex items-start gap-1.5">
                                <span className="text-orange-500 font-bold shrink-0">•</span>
                                <span>{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Recommendations */}
                      <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-4 space-y-2">
                        <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 01-2 2h0a2 2 0 01-2-2v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          AI Recommendations
                        </h5>
                        <ul className="space-y-1.5">
                          {compatibilityResult.recommendations?.map((rec: string, idx: number) => (
                            <li key={idx} className="text-xs text-slate-600 flex items-start gap-1.5">
                              <span className="text-indigo-500 shrink-0 font-bold">💡</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Action buttons inside analyzer */}
                      <div className="flex flex-col sm:flex-row gap-2 pt-2">
                        <button
                          onClick={runCompatibilityCheck}
                          className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-all active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89L17.6 9" />
                          </svg>
                          Re-run Check
                        </button>
                        <button
                          onClick={handleBookmarkToggle}
                          className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all active:scale-98 flex items-center justify-center gap-1.5 border cursor-pointer ${
                            isBookmarked
                              ? "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100"
                              : "bg-teal-600 border-teal-600 text-white hover:bg-teal-700"
                          }`}
                        >
                          <svg
                            className="w-4 h-4"
                            fill={isBookmarked ? "currentColor" : "none"}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                          {isBookmarked ? "Bookmarked Room" : "Bookmark this Room"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          )}

          {/* Owner details card */}
          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Contact Landlord / Creator</h2>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div className="w-14 h-14 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xl shrink-0">
                {listing.owner?.fullName ? listing.owner.fullName[0].toUpperCase() : "U"}
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-bold text-slate-800 text-base">
                  {listing.owner?.fullName || "Verified User"}
                </h3>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {listing.owner?.email || "No email listed"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {listing.owner?.phoneNumber || "No phone listed"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Apply for Room button (non-owners only) */}
          {!isOwner && currentUser && (
            <div className="border-t border-slate-100 pt-6">
              {kycVerified === false ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-3">
                  <svg className="w-8 h-8 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-sm font-bold text-amber-700">KYC Verification Required</p>
                    <p className="text-xs text-amber-600">Verify your identity to apply for rooms.</p>
                  </div>
                  <Link
                    href="/dashboard/kyc"
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-xs transition-all"
                  >
                    Verify Now
                  </Link>
                </div>
              ) : (
              <button
                onClick={() => setApplyModalOpen(true)}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-sm active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Apply for this Room
              </button>
              )}
            </div>
          )}

          {/* Reviews Section */}
          <div className="border-t border-slate-100 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">Reviews ({reviews.length})</h2>
              {!isOwner && currentUser && listing.owner && (
                <Link
                  href={`/dashboard/reviews/new?reviewee=${listing.owner._id}&listing=${listing._id}`}
                  className="text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                >
                  Write a Review
                </Link>
              )}
            </div>
            {reviews.length === 0 ? (
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-8 text-center">
                <p className="text-slate-400 text-sm">No reviews yet for this listing.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review: any) => (
                  <div key={review._id} className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm shrink-0">
                        {review.reviewer?.fullName?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold text-slate-800 text-sm">{review.reviewer?.fullName || review.reviewer?.username}</span>
                        <div className="flex items-center gap-2">
                          <StarRating rating={review.rating} size="sm" />
                          <span className="text-xs text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm ml-11">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setApplyModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Apply for this Room</h3>
            <p className="text-sm text-slate-500 mb-4">Send a message to the listing owner explaining why you&apos;d be a great roommate.</p>
            <textarea
              value={applyMessage}
              onChange={(e) => setApplyMessage(e.target.value)}
              rows={4}
              placeholder="Introduce yourself, mention your lifestyle, why this room interests you..."
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
              minLength={10}
              maxLength={1000}
            />
            <p className="text-xs text-slate-400 mt-1 mb-4">{applyMessage.length}/1000 (min 10)</p>
            <div className="flex gap-3">
              <button
                onClick={handleApply}
                disabled={applyingSubmitting}
                className="flex-1 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {applyingSubmitting ? "Submitting..." : "Submit Application"}
              </button>
              <button
                onClick={() => setApplyModalOpen(false)}
                className="px-4 py-2.5 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteConfirmOpen}
        title="Delete Room Listing"
        message="Are you sure you want to delete this room listing? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmOpen(false)}
      />
    </div>
  );
}
