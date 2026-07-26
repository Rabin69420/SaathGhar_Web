export default function ReviewsLoading() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f] py-8 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-6 animate-pulse"></div>
                <div className="flex gap-2 mb-6">
                    <div className="h-10 w-40 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                    <div className="h-10 w-36 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                            </div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
