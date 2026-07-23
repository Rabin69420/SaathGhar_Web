"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { handleGetListings, handleDeleteListing, handleGetMyListings, handleGetBookmarkedListings, handleToggleBookmark } from "@/lib/actions/listings-action";
import { getCookieClientSide } from "@/lib/cookies-client";

export default function DashboardPage() {
  const router = useRouter();
  const [listings, setListings] = useState<any[]>([]);
  const [myListings, setMyListings] = useState<any[]>([]);
  const [bookmarkedListings, setBookmarkedListings] = useState<any[]>([]);
  const [filteredListings, setFilteredListings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "my" | "bookmarks">("all");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [maxRent, setMaxRent] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  const loadListings = async (userObj?: any) => {
    setLoading(true);
    const res = await handleGetListings();
    if (res.success && res.data) {
      setListings(res.data);
    }
    const current = userObj || currentUser;
    if (current) {
      const myRes = await handleGetMyListings();
      if (myRes.success && myRes.data) {
        setMyListings(myRes.data);
      }
      const bookmarkRes = await handleGetBookmarkedListings();
      if (bookmarkRes.success && bookmarkRes.data) {
        setBookmarkedListings(bookmarkRes.data);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const userDataStr = await getCookieClientSide("user_data");
      let parsedUser = null;
      if (userDataStr) {
        try {
          parsedUser = JSON.parse(decodeURIComponent(userDataStr));
          if (parsedUser.role === "admin") {
            router.replace("/admin/dashboard");
            return;
          }
          setCurrentUser(parsedUser);
        } catch {}
      }
      loadListings(parsedUser);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    let result = listings;
    if (activeTab === "my") {
      result = myListings;
    } else if (activeTab === "bookmarks") {
      result = bookmarkedListings;
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.location.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q)
      );
    }
    if (maxRent.trim()) {
      const max = parseFloat(maxRent);
      if (!isNaN(max)) {
        result = result.filter((l) => l.rent <= max);
      }
    }
    setFilteredListings(result);
  }, [search, maxRent, listings, myListings, bookmarkedListings, activeTab]);

  const handleBookmarkToggle = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser) {
      alert("Please log in to bookmark room listings.");
      return;
    }
    const res = await handleToggleBookmark(id);
    if (res.success) {
      loadListings();
    } else {
      alert(res.message);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this room listing?")) {
      const res = await handleDeleteListing(id);
      if (res.success) {
        alert("Listing deleted successfully!");
        loadListings();
      } else {
        alert(res.message);
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 py-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Room Listings</h1>
            <p className="text-slate-500 mt-1">Explore rooms and roommates around you.</p>
          </div>
          {currentUser && (
            <Link
              href="/dashboard/listings/new"
              className="px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2"
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
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Post a Room
            </Link>
          )}
        </div>

        {/* Stats Grid */}
        {currentUser && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <button
              onClick={() => setActiveTab("all")}
              className={`text-left p-6 rounded-xl border transition-all flex items-center justify-between group ${
                activeTab === "all"
                  ? "bg-white border-teal-500 shadow-md ring-2 ring-teal-500/20"
                  : "bg-white border-slate-100 hover:border-slate-300 shadow-xs"
              }`}
            >
              <div>
                <span className="block text-slate-400 text-xs font-bold uppercase tracking-wider">
                  Total Rooms
                </span>
                <span className="text-3xl font-extrabold text-slate-800 mt-2 block">
                  {loading ? "..." : listings.length}
                </span>
              </div>
              <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("my")}
              className={`text-left p-6 rounded-xl border transition-all flex items-center justify-between group ${
                activeTab === "my"
                  ? "bg-white border-indigo-500 shadow-md ring-2 ring-indigo-500/20"
                  : "bg-white border-slate-100 hover:border-slate-300 shadow-xs"
              }`}
            >
              <div>
                <span className="block text-slate-400 text-xs font-bold uppercase tracking-wider">
                  My Posted Rooms
                </span>
                <span className="text-3xl font-extrabold text-slate-800 mt-2 block">
                  {loading ? "..." : myListings.length}
                </span>
              </div>
              <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("bookmarks")}
              className={`text-left p-6 rounded-xl border transition-all flex items-center justify-between group ${
                activeTab === "bookmarks"
                  ? "bg-white border-rose-500 shadow-md ring-2 ring-rose-500/20"
                  : "bg-white border-slate-100 hover:border-slate-300 shadow-xs"
              }`}
            >
              <div>
                <span className="block text-slate-400 text-xs font-bold uppercase tracking-wider">
                  My Bookmarks
                </span>
                <span className="text-3xl font-extrabold text-slate-800 mt-2 block">
                  {loading ? "..." : bookmarkedListings.length}
                </span>
              </div>
              <div className="w-12 h-12 bg-rose-50 rounded-lg flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </button>
          </div>
        )}

        {/* Filter bar */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-100 p-4 md:p-6 mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Search by Title, Location
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Kathmandu, Flat, Roommate..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm text-slate-700"
              />
              <svg
                className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div className="w-full md:w-64">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Max Monthly Rent (Rs.)
            </label>
            <input
              type="number"
              placeholder="e.g. 15000"
              value={maxRent}
              onChange={(e) => setMaxRent(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm text-slate-700"
            />
          </div>
        </div>

        {/* Tabs switcher */}
        {currentUser && (
          <div className="border-b border-slate-200 mb-8 flex gap-4">
            <button
              onClick={() => setActiveTab("all")}
              className={`py-3 px-4 text-sm font-bold border-b-2 transition-all ${
                activeTab === "all"
                  ? "border-teal-600 text-teal-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              All Rooms
            </button>
            <button
              onClick={() => setActiveTab("my")}
              className={`py-3 px-4 text-sm font-bold border-b-2 transition-all ${
                activeTab === "my"
                  ? "border-teal-600 text-teal-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              My Posted Rooms
            </button>
            <button
              onClick={() => setActiveTab("bookmarks")}
              className={`py-3 px-4 text-sm font-bold border-b-2 transition-all ${
                activeTab === "bookmarks"
                  ? "border-teal-600 text-teal-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              My Bookmarks
            </button>
          </div>
        )}

        {/* Grid listing */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-100 rounded-xl">
            <svg
              className="w-16 h-16 text-slate-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h3 className="text-lg font-bold text-slate-700">No rooms found</h3>
            <p className="text-slate-400 mt-1">Try updating your filters or search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredListings.map((listing: any) => {
              const isOwner = currentUser && listing.owner && (listing.owner._id === currentUser._id || listing.owner === currentUser._id);
              const imageUrl = listing.image.startsWith("http")
                ? listing.image
                : `http://localhost:8089/uploads/${listing.image}`;

              return (
                <Link
                  key={listing._id}
                  href={`/dashboard/listings/${listing._id}`}
                  className="group bg-white border border-slate-100 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
                >
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-teal-600 text-white font-bold text-sm px-3 py-1 rounded-full shadow-xs">
                      Rs. {listing.rent} / month
                    </div>
                    {currentUser && (
                      <button
                        onClick={(e) => handleBookmarkToggle(listing._id, e)}
                        className={`absolute top-3 left-3 p-2 rounded-full shadow-md backdrop-blur-md transition-all active:scale-95 z-10 ${
                          bookmarkedListings.some((b) => b._id === listing._id)
                            ? "bg-rose-500 text-white hover:bg-rose-600"
                            : "bg-white/85 text-slate-600 hover:bg-white hover:text-rose-500"
                        }`}
                        title={bookmarkedListings.some((b) => b._id === listing._id) ? "Remove Bookmark" : "Bookmark Listing"}
                      >
                        <svg className="w-4 h-4" fill={bookmarkedListings.some((b) => b._id === listing._id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-teal-600 text-xs font-bold uppercase tracking-wider mb-2">
                        <svg
                          className="w-3.5 h-3.5"
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

                      <h3 className="text-lg font-bold text-slate-800 group-hover:text-teal-600 transition-colors line-clamp-1">
                        {listing.title}
                      </h3>

                      <p className="text-slate-500 text-sm mt-2 line-clamp-2">
                        {listing.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs">
                          {listing.owner?.fullName
                            ? listing.owner.fullName[0].toUpperCase()
                            : "U"}
                        </div>
                        <span className="text-xs font-semibold text-slate-600">
                          {listing.owner?.fullName || "Verified User"}
                        </span>
                      </div>

                      {isOwner && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => handleDelete(listing._id, e)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
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
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}