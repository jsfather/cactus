export default function LoadingSpinner() {
  return (
    <div className="flex h-[50vh] w-full items-center justify-center">
      <div className="relative">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200"></div>
        <div className="border-primary-500 absolute top-0 left-0 h-16 w-16 animate-spin rounded-full border-4 border-t-transparent"></div>
      </div>
    </div>
  );
}
