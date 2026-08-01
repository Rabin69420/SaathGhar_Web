"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { handleGetPreferences, handleUpdatePreferences, handleResetPreferences } from "@/lib/actions/preferences-action";
import ConfirmModal from "@/app/component/common/ConfirmModal";

const PREFERENCE_OPTIONS = {
    cleanliness: {
        label: "Cleanliness",
        description: "How tidy do you keep your space?",
        options: [
            { value: "High", label: "High", detail: "Very tidy & organized" },
            { value: "Medium", label: "Medium", detail: "Average cleanliness" },
            { value: "Low", label: "Low", detail: "Relaxed about tidiness" },
        ],
    },
    noiseLevel: {
        label: "Noise Level",
        description: "What noise environment do you prefer?",
        options: [
            { value: "Quiet", label: "Quiet", detail: "Prefers peace & calm" },
            { value: "Moderate", label: "Moderate", detail: "Average noise is fine" },
            { value: "Loud", label: "Loud", detail: "Music & activity welcome" },
        ],
    },
    sleepSchedule: {
        label: "Sleep Schedule",
        description: "When do you usually sleep and wake up?",
        options: [
            { value: "Early Bird", label: "Early Bird", detail: "Up early, sleep early" },
            { value: "Night Owl", label: "Night Owl", detail: "Stay up late, wake late" },
            { value: "Flexible", label: "Flexible", detail: "Variable schedule" },
        ],
    },
    diet: {
        label: "Diet",
        description: "Any dietary preferences or restrictions?",
        options: [
            { value: "No preference", label: "No preference", detail: "Eats everything" },
            { value: "Vegetarian", label: "Vegetarian", detail: "No meat" },
            { value: "Vegan", label: "Vegan", detail: "No animal products" },
            { value: "Non-Vegetarian", label: "Non-Vegetarian", detail: "Includes meat" },
        ],
    },
    smoking: {
        label: "Smoking",
        description: "Your smoking habits or tolerance?",
        options: [
            { value: "Non-smoker", label: "Non-smoker", detail: "Doesn't smoke" },
            { value: "Smoker", label: "Smoker", detail: "Smokes regularly" },
            { value: "Outside only", label: "Outside only", detail: "Smokes outdoors" },
        ],
    },
    pets: {
        label: "Pets",
        description: "How do you feel about pets?",
        options: [
            { value: "Pet friendly", label: "Pet friendly", detail: "Loves animals" },
            { value: "No pets", label: "No pets", detail: "Prefers pet-free" },
            { value: "Have pets", label: "Have pets", detail: "Currently has pets" },
        ],
    },
    guests: {
        label: "Guests",
        description: "How often do you have visitors?",
        options: [
            { value: "No guests", label: "No guests", detail: "Prefers no visitors" },
            { value: "Occasionally", label: "Occasionally", detail: "Sometimes has guests" },
            { value: "Frequently", label: "Frequently", detail: "Often has visitors" },
        ],
    },
};

type PrefKey = keyof typeof PREFERENCE_OPTIONS;

const EMPTY: Record<string, string> = {
    cleanliness: "", noiseLevel: "", sleepSchedule: "",
    diet: "", smoking: "", pets: "", guests: "", additionalInfo: "",
};

export default function PreferencesPage() {
    const [preferences, setPreferences] = useState<Record<string, string>>(EMPTY);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [resetModal, setResetModal] = useState(false);
    const router = useRouter();

    useEffect(() => { fetchPreferences(); }, []);

    const fetchPreferences = async () => {
        setLoading(true);
        const res = await handleGetPreferences();
        if (res.success && res.data) {
            setPreferences({ ...EMPTY, ...res.data });
        }
        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        const payload: Record<string, string> = {};
        for (const key of Object.keys(preferences)) {
            payload[key] = preferences[key] || "None";
        }
        const res = await handleUpdatePreferences(payload);
        if (res.success) toast.success(res.message);
        else toast.error(res.message);
        setSaving(false);
    };

    const handleReset = async () => {
        const res = await handleResetPreferences();
        if (res.success) {
            toast.success(res.message);
            setPreferences(EMPTY);
        } else {
            toast.error(res.message);
        }
        setResetModal(false);
    };

    const selectPref = (key: string, value: string) => {
        setPreferences(prev => ({
            ...prev,
            [key]: prev[key] === value ? "" : value,
        }));
    };

    if (loading) {
        return (
            <div className="py-8 px-6 md:px-12">
                <div className="max-w-3xl mx-auto space-y-6">
                    <div className="h-8 bg-muted rounded-lg w-64 animate-pulse" />
                    <div className="h-4 bg-muted rounded w-96 animate-pulse" />
                    <div className="space-y-4 mt-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="bg-card border border-border rounded-2xl p-6 animate-pulse">
                                <div className="h-5 bg-muted rounded w-32 mb-3" />
                                <div className="flex gap-3">
                                    <div className="h-10 bg-muted rounded-lg flex-1" />
                                    <div className="h-10 bg-muted rounded-lg flex-1" />
                                    <div className="h-10 bg-muted rounded-lg flex-1" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-8 px-6 md:px-12">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-1">
                        <button
                            onClick={() => router.back()}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                        <h1 className="text-2xl font-bold text-foreground">Roommate Preferences</h1>
                    </div>
                    <p className="text-sm text-muted-foreground ml-9">
                        Set your lifestyle preferences to find the best match. Click an option to select it, or leave it unselected for no preference.
                    </p>
                </div>

                {/* Preference Cards */}
                <div className="space-y-4">
                    {(Object.keys(PREFERENCE_OPTIONS) as PrefKey[]).map(key => {
                        const pref = PREFERENCE_OPTIONS[key];
                        const selected = preferences[key];

                        return (
                            <div
                                key={key}
                                className="bg-card border border-border rounded-2xl p-5 md:p-6 shadow-xs transition-all"
                            >
                                <div className="mb-3">
                                    <h3 className="text-sm font-semibold text-foreground">{pref.label}</h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">{pref.description}</p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {pref.options.map(opt => {
                                        const isSelected = selected === opt.value;
                                        return (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => selectPref(key, opt.value)}
                                                className={`group relative px-4 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                                                    isSelected
                                                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                                        : "bg-input-background text-foreground border-border hover:border-primary/40 hover:bg-accent"
                                                }`}
                                            >
                                                <span>{opt.label}</span>
                                                <span className={`block text-[11px] font-normal mt-0.5 ${
                                                    isSelected
                                                        ? "text-primary-foreground/75"
                                                        : "text-muted-foreground"
                                                }`}>
                                                    {opt.detail}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {!selected && (
                                    <p className="text-xs text-muted-foreground/70 mt-2 italic">No preference selected</p>
                                )}
                            </div>
                        );
                    })}

                    {/* Additional Info */}
                    <div className="bg-card border border-border rounded-2xl p-5 md:p-6 shadow-xs">
                        <div className="mb-3">
                            <h3 className="text-sm font-semibold text-foreground">About You</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Describe your lifestyle, habits, or anything a potential roommate should know.
                            </p>
                        </div>
                        <textarea
                            value={preferences.additionalInfo || ""}
                            onChange={(e) => setPreferences(prev => ({ ...prev, additionalInfo: e.target.value }))}
                            rows={3}
                            placeholder="E.g. I'm a student studying IT. I value quiet study time and keep things neat..."
                            className="w-full bg-input-background text-foreground border border-border rounded-lg px-3.5 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-xs resize-none"
                            maxLength={500}
                        />
                        <div className="flex justify-end mt-1.5">
                            <span className="text-xs text-muted-foreground">{(preferences.additionalInfo || "").length}/500</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-3">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg shadow-sm hover:bg-primary/95 hover:scale-[1.01] active:scale-100 disabled:opacity-50 transition-all text-sm"
                    >
                        {saving ? "Saving..." : "Save Preferences"}
                    </button>
                    <button
                        onClick={() => setResetModal(true)}
                        className="px-5 py-2.5 text-sm font-medium text-foreground bg-card border border-border rounded-lg hover:bg-muted transition-all"
                    >
                        Reset
                    </button>
                </div>
            </div>

            <ConfirmModal
                isOpen={resetModal}
                title="Reset Preferences"
                message="This will clear all your roommate preferences. Continue?"
                confirmLabel="Reset"
                variant="danger"
                onConfirm={handleReset}
                onCancel={() => setResetModal(false)}
            />
        </div>
    );
}
