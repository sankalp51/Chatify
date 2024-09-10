export default function MessageSkeleton() {
    return (
        <article className="flex flex-col gap-2 py-2">
            {/* Skeleton for the message header */}
            <div className="flex items-center justify-between">
                <div className="flex gap-3 items-center">
                    <div className="skeleton w-10 h-10 rounded-full shrink-0"></div>
                    <div className="flex flex-col gap-1">
                        <div className="skeleton h-4 w-32"></div>
                        <div className="skeleton h-4 w-24"></div>
                    </div>
                </div>
                <div className="skeleton h-4 w-16"></div>
            </div>

            {/* Skeleton for the message body */}
            <div className="skeleton h-5 w-full mt-2"></div>
            <div className="skeleton h-5 w-3/4"></div>
        </article>
    );
}
