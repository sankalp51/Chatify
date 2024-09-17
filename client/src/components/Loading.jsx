export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="text-center">
        <span className="loading loading-spinner loading-lg text-white"></span>
        <p className="mt-4 text-white text-lg">Loading...</p>
        <p className="text-white">This might take a while, Sorry about that😅</p>
      </div>
    </div>
  );
}
