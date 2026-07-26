"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { handleGetNotifications, handleMarkNotificationRead, handleMarkAllNotificationsRead, handleDeleteNotification } from "@/lib/actions/notifications-action";
import Link from "next/link";

interface Notification {
    _id: string;
    type: string;
    title: string;
    message: string;
    relatedId?: string;
    read: boolean;
    createdAt: string;
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        const res = await handleGetNotifications();
        if (res.success) {
            setNotifications(res.data || []);
        }
        setLoading(false);
    };

    const handleMarkRead = async (id: string) => {
        const res = await handleMarkNotificationRead(id);
        if (res.success) {
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
        }
    };

    const handleMarkAll = async () => {
        const res = await handleMarkAllNotificationsRead();
        if (res.success) {
            toast.success(res.message);
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        }
    };

    const handleDelete = async (id: string) => {
        const res = await handleDeleteNotification(id);
        if (res.success) {
            setNotifications(prev => prev.filter(n => n._id !== id));
        }
    };

    const typeIcon = (type: string) => {
        switch (type) {
            case "application_received":
                return <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm">📥</span>;
            case "application_accepted":
                return <span className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center text-sm">✅</span>;
            case "application_rejected":
                return <span className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center text-sm">❌</span>;
            case "review_received":
                return <span className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 flex items-center justify-center text-sm">⭐</span>;
            default:
                return <span className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 flex items-center justify-center text-sm">🔔</span>;
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] py-8 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
                        {unreadCount > 0 && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{unreadCount} unread</p>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAll}
                            className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                        >
                            Mark all as read
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 animate-pulse">
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                                    <div className="flex-1">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl">
                        <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No notifications</h3>
                        <p className="text-gray-500 dark:text-gray-400">You&apos;re all caught up!</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {notifications.map(notif => (
                            <div
                                key={notif._id}
                                className={`bg-white dark:bg-gray-800 rounded-xl p-4 border transition-colors ${
                                    notif.read
                                        ? "border-gray-100 dark:border-gray-700"
                                        : "border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-900/10"
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    {typeIcon(notif.type)}
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium ${notif.read ? "text-gray-700 dark:text-gray-300" : "text-gray-900 dark:text-white"}`}>
                                            {notif.title}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{notif.message}</p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{new Date(notif.createdAt).toLocaleString()}</p>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                        {!notif.read && (
                                            <button
                                                onClick={() => handleMarkRead(notif._id)}
                                                className="p-1.5 text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                                                title="Mark as read"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(notif._id)}
                                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
