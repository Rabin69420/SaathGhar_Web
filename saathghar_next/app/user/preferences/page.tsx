"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { handleGetPreferences, handleUpdatePreferences, handleResetPreferences } from "@/lib/actions/preferences-action";
import ConfirmModal from "@/app/component/common/ConfirmModal";

const PREFERENCE_OPTIONS = {
    cleanliness: { label: "Cleanliness", options: ["High", "Medium", "Low"] },
    noiseLevel: { label: "Noise Level", options: ["Quiet", "Moderate", "Loud"] },
    sleepSchedule: { label: "Sleep Schedule", options: ["Early Bird", "Night Owl", "Flexible"] },
    diet: { label: "Diet", options: ["No preference", "Vegetarian", "Vegan", "Non-Vegetarian"] },
    smoking: { label: "Smoking", options: ["Non-smoker", "Smoker", "Outside only"] },
    pets: { label: "Pets", options: ["Pet friendly", "No pets", "Have pets"] },
    guests: { label: "Guests", options: ["No guests", "Occasionally", "Frequently"] },
};

type PrefKey = keyof typeof PREFERENCE_OPTIONS;

export default function PreferencesPage() {
    const [preferences, setPreferences] = useState<Record<string, string>>({
        cleanliness: "Medium",
        noiseLevel: "Moderate",
        sleepSchedule: "Flexible",
        diet: "No preference",
        smoking: "Non-smoker",
        pets: "Pet friendly",
        guests: "Occasionally",
        additionalInfo: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [resetModal, setResetModal] = useState(false);

    useEffect(() => {
        fetchPreferences();
    }, []);

    const fetchPreferences = async () => {
        setLoading(true);
        const res = await handleGetPreferences();
        if (res.success && res.data) {
            setPreferences(prev => ({ ...prev, ...res.data }));
        }
        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        const res = await handleUpdatePreferences(preferences);
        if (res.success) {
            toast.success(res.message);
        } else {
            toast.error(res.message);
        }
        setSaving(false);
    };

    const handleReset = async () => {
        const res = await handleResetPreferences();
        if (res.success) {
            toast.success(res.message);
            setPreferences({
                cleanliness: "Medium",
                noiseLevel: "Moderate",
                sleepSchedule: "Flexible",
                diet: "No preference",
                smoking: "Non-smoker",
                pets: "Pet friendly",
                guests: "Occasionally",
                additionalInfo: "",
            });
        } else {
            toast.error(res.message);
        }
        setResetModal(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] py-8 px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6 animate-pulse"></div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 space-y-6">
                        {[1, 2, 3, 4, 5, 6, 7].map(i => (
                            <div key={i} className="animate-pulse">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] py-8 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Roommate Preferences</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Set your lifestyle preferences to get better compatibility matches.</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {(Object.keys(PREFERENCE_OPTIONS) as PrefKey[]).map(key => (
                            <div key={key}>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {PREFERENCE_OPTIONS[key].label}
                                </label>
                                <select
                                    value={preferences[key] || ""}
                                    onChange={(e) => setPreferences(prev => ({ ...prev, [key]: e.target.value }))}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                >
                                    {PREFERENCE_OPTIONS[key].options.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                        ))}

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Additional Info
                            </label>
                            <textarea
                                value={preferences.additionalInfo || ""}
                                onChange={(e) => setPreferences(prev => ({ ...prev, additionalInfo: e.target.value }))}
                                rows={3}
                                placeholder="Study habits, hobbies, work schedule..."
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                maxLength={500}
                            />
                            <p className="text-xs text-gray-400 mt-1">{(preferences.additionalInfo || "").length}/500</p>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-8">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex-1 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors"
                        >
                            {saving ? "Saving..." : "Save Preferences"}
                        </button>
                        <button
                            onClick={() => setResetModal(true)}
                            className="px-6 py-3 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            Reset to Defaults
                        </button>
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={resetModal}
                title="Reset Preferences"
                message="This will reset all your roommate preferences to default values. Continue?"
                confirmLabel="Reset"
                variant="danger"
                onConfirm={handleReset}
                onCancel={() => setResetModal(false)}
            />
        </div>
    );
}
