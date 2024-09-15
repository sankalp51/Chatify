export default function ChatSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-2">
      <div className="self-start w-3/4">
        <div className="skeleton h-10 w-full rounded-lg"></div>
      </div>
      <div className="self-end w-2/3">
        <div className="skeleton h-10 w-full rounded-lg"></div>
      </div>
      <div className="self-start w-1/2">
        <div className="skeleton h-10 w-full rounded-lg"></div>
      </div>
    </div>
  );
}
