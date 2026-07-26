import { handleWhoami } from "@/lib/actions/auth-action";
import UpdateUserForm from "./_components/UpdateUserForm";
import Navbar from "@/app/component/common/Navbar";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Page() {
    const res = await handleWhoami();

    if (!res.success) {
        throw new Error(res.message || "Failed to fetch user profile details.");
    }

    if (res.data?.role === "admin") {
        redirect("/admin/dashboard");
    }

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Navbar />
            <main className="flex-1 py-12 px-4 md:px-8">
                <div className="max-w-4xl mx-auto">
                    <UpdateUserForm user={res.data} />
                </div>
            </main>
        </div>
    );
}
