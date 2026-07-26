import Link from "next/link";

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
    onAction?: () => void;
}

export default function EmptyState({ icon, title, description, actionLabel, actionHref, onAction }: EmptyStateProps) {
    return (
        <div className="text-center py-16 px-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
            {icon && <div className="mb-4 flex justify-center">{icon}</div>}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-sm mx-auto">{description}</p>
            {actionLabel && actionHref && (
                <Link href={actionHref} className="inline-block px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
                    {actionLabel}
                </Link>
            )}
            {actionLabel && onAction && !actionHref && (
                <button onClick={onAction} className="px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
                    {actionLabel}
                </button>
            )}
        </div>
    );
}
