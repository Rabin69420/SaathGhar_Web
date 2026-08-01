"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useState, useRef } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { handleUpdateProfile } from "@/lib/actions/auth-action";
import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const updateUserSchema = z.object({
    firstName: z.string().min(2, { message: "Minimum 2 characters" }),
    lastName: z.string().min(2, { message: "Minimum 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    username: z.string().min(3, { message: "Minimum 3 characters" }),
    phoneNumber: z.string().min(10, { message: "Phone number must be at least 10 characters" }),
    image: z
        .instanceof(File)
        .optional()
        .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
            message: "Max file size is 5MB",
        })
        .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
            message: "Only .jpg, .jpeg, .png and .webp formats are supported",
        }),

});

export type UpdateUserData = z.infer<typeof updateUserSchema>;

export default function UpdateUserForm({
    user
}: { user: any }) {
    const { register, handleSubmit, control, formState: { errors, isSubmitting } } =
        useForm<UpdateUserData>({
            resolver: zodResolver(updateUserSchema),
            values: {
                firstName: user?.firstName || '',
                lastName: user?.lastName || '',
                email: user?.email || '',
                username: user?.username || '',
                phoneNumber: user?.phoneNumber || '',
            }
        });

    const [error, setError] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (file: File | undefined, onChange: (file: File | undefined) => void) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
        onChange(file);
    };

    const handleDismissImage = (onChange?: (file: File | undefined) => void) => {
        setPreviewImage(null);
        onChange?.(undefined);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const onSubmit = async (data: UpdateUserData) => {
        setError(null);
        try {
            const formData = new FormData();
            formData.append('firstName', data.firstName);
            formData.append('lastName', data.lastName);
            formData.append('email', data.email);
            formData.append('username', data.username);
            formData.append('phoneNumber', data.phoneNumber);
            if (data.image) {
                formData.append('image', data.image);
            }
            
            const response = await handleUpdateProfile(formData);
            if (!response.success) {
                throw new Error(response.message || 'Update profile failed');
            }

            handleDismissImage();
            toast.success('Profile updated successfully');
        } catch (err: any) {
            toast.error(err.message || 'Profile update failed');
            setError(err.message || 'Profile update failed');
        }
    };

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8089";

    return (
        <div className="bg-card border border-border shadow-lg rounded-2xl p-6 md:p-8 max-w-2xl mx-auto transition-all">
            <h2 className="text-2xl font-bold text-foreground mb-6">Profile Settings</h2>
            
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                {error && (
                    <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm border border-red-100 dark:border-red-900/30">
                        {error}
                    </div>
                )}

                {/* Profile Image Display */}
                <div className="flex flex-col items-center sm:flex-row gap-6 pb-6 border-b border-border">
                    <div className="relative">
                        {previewImage ? (
                            <div className="relative w-24 h-24">
                                <img
                                    src={previewImage}
                                    alt="Profile Image Preview"
                                    className="w-24 h-24 rounded-full object-cover border-2 border-primary shadow-md"
                                />
                                <Controller
                                    name="image"
                                    control={control}
                                    render={({ field: { onChange } }) => (
                                        <button
                                            type="button"
                                            onClick={() => handleDismissImage(onChange)}
                                            className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-destructive/90 transition-all shadow-sm"
                                        >
                                            ✕
                                        </button>
                                    )}
                                />
                            </div>
                        ) : user?.imageUrl ? (
                            <div className="relative w-24 h-24">
                                <Image
                                    src={user.imageUrl.startsWith('http') ? user.imageUrl : `${apiBaseUrl}${user.imageUrl}`}
                                    alt="Profile Image"
                                    width={96}
                                    height={96}
                                    className="w-24 h-24 rounded-full object-cover border-2 border-primary/50 shadow-md"
                                />
                            </div>
                        ) : (
                            <div className="w-24 h-24 bg-muted border border-border rounded-full flex items-center justify-center shadow-inner">
                                <span className="text-muted-foreground text-sm font-medium">No Avatar</span>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 space-y-2 text-center sm:text-left">
                        <label className="block text-sm font-semibold text-foreground">Profile Photo</label>
                        <Controller
                            name="image"
                            control={control}
                            render={({ field: { onChange } }) => (
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    id="avatar-upload"
                                    onChange={(e) => handleImageChange(e.target.files?.[0], onChange)}
                                    accept=".jpg,.jpeg,.png,.webp"
                                />
                            )}
                        />
                        <label 
                            htmlFor="avatar-upload"
                            className="inline-block px-4 py-2 border border-border bg-card hover:bg-muted text-foreground text-sm font-medium rounded-lg cursor-pointer transition-colors shadow-xs"
                        >
                            Choose File
                        </label>
                        <p className="text-xs text-muted-foreground">JPG, JPEG, PNG or WEBP. Max 5MB.</p>
                        {errors.image && <p className="text-xs text-destructive">{errors.image.message}</p>}
                    </div>
                </div>

                {/* Form fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-foreground" htmlFor="firstName">First Name</label>
                        <input
                            id="firstName"
                            type="text"
                            {...register("firstName")}
                            className="w-full bg-input-background text-foreground border border-border rounded-lg px-3.5 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-xs"
                        />
                        {errors.firstName && <p className="text-xs text-destructive mt-1">{errors.firstName.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-foreground" htmlFor="lastName">Last Name</label>
                        <input
                            id="lastName"
                            type="text"
                            {...register("lastName")}
                            className="w-full bg-input-background text-foreground border border-border rounded-lg px-3.5 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-xs"
                        />
                        {errors.lastName && <p className="text-xs text-destructive mt-1">{errors.lastName.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-foreground" htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            {...register("username")}
                            className="w-full bg-input-background text-foreground border border-border rounded-lg px-3.5 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-xs"
                        />
                        {errors.username && <p className="text-xs text-destructive mt-1">{errors.username.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-foreground" htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            {...register("email")}
                            className="w-full bg-input-background text-foreground border border-border rounded-lg px-3.5 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-xs"
                        />
                        {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1.5 text-foreground" htmlFor="phoneNumber">Phone Number</label>
                        <input
                            id="phoneNumber"
                            type="text"
                            {...register("phoneNumber")}
                            className="w-full bg-input-background text-foreground border border-border rounded-lg px-3.5 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-xs"
                            placeholder="e.g. 98XXXXXXXX"
                        />
                        {errors.phoneNumber && <p className="text-xs text-destructive mt-1">{errors.phoneNumber.message}</p>}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg shadow-sm hover:bg-primary/95 hover:scale-[1.01] active:scale-100 disabled:opacity-50 disabled:pointer-events-none transition-all"
                    >
                        {isSubmitting ? 'Updating...' : 'Save Profile'}
                    </button>
                </div>
            </form>
        </div>
    );
}
