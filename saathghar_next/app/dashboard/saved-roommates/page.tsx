"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { handleGetSavedRoommates, handleToggleSavedRoommate } from "@/lib/actions/saved-roommates-action";
import ConfirmModal from "@/app/component/common/ConfirmModal";

interface SavedRoommate {
    _id: string;
    fullName: string;
    username: string;
    email: string;
    imageUrl?: string;
    phoneNumber?: string;
    preferences?: Record<string, string>;
}

export default function SavedRoommatesPage() {
    const [roommates, setRoommates] = useState<SavedRoommate[]>([]);
    const [loading, setLoading] = useState(true);
    const [removeModal, setRemoveModal] = useState<{ open: boolean; id: string; name: string }>({ open: false, id: "", name: "" });

    useEffect(() => {
        fetchRoommates();
    }, []);

    const fetchRoommates = async () => {
        setLoading(true);
        const res = await handleGetSavedRoommates();
        if (res.success) {
            setRoommates(res.data || []);
        }
        setLoading(false);
    };

    const handleRemove = async (id: string) => {
        const res = await handleToggleSavedRoommate(id);
        if (res.success) {
            toast.success("Roommate removed from saved list");
            setRoommates(prev => prev.filter(r => r._id !== id));
        } else {
            toast.error(res.message);
        }
        setRemoveModal({ open: false, id: "", name: "" });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] py-8 px-4">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Saved Roommates</h1>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                                    <div className="flex-1">
                                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : roommates.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl">
                        <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No saved roommates</h3>
                        <p className="text-gray-500 dark:text-gray-400">Save roommates from listing pages to keep track of potential matches.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {roommates.map(roommate => (
                            <div key={roommate._id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-xl shrink-0">
                                        {roommate.imageUrl ? (
                                            <img
                                                src={roommate.imageUrl.startsWith("http") ? roommate.imageUrl : `http://localhost:8089${roommate.imageUrl}`}
                                                alt={roommate.fullName}
                                                className="w-14 h-14 rounded-full object-cover"
                                            />
                                        ) : (
                                            roommate.fullName?.[0]?.toUpperCase() || "U"
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">{roommate.fullName}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">@{roommate.username}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{roommate.email}</p>
                                        {roommate.preferences && Object.values(roommate.preferences).some(v => v) && (
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                {roommate.preferences.cleanliness && (
                                                    <span className="px-2 py-0.5 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 text-xs rounded-full">{roommate.preferences.cleanliness}</span>
                                                )}
                                                {roommate.preferences.sleepSchedule && (
                                                    <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 text-xs rounded-full">{roommate.preferences.sleepSchedule}</span>
                                                )}
                                                {roommate.preferences.smoking && (
                                                    <span className="px-2 py-0.5 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 text-xs rounded-full">{roommate.preferences.smoking}</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => setRemoveModal({ open: true, id: roommate._id, name: roommate.fullName })}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors shrink-0"
                                        title="Remove"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={removeModal.open}
                title="Remove Saved Roommate"
                message={`Remove ${removeModal.name} from your saved roommates?`}
                confirmLabel="Remove"
                variant="danger"
                onConfirm={() => handleRemove(removeModal.id)}
                onCancel={() => setRemoveModal({ open: false, id: "", name: "" })}
            />
        </div>
    );
}
