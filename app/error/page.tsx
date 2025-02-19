"use client";

export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-100 text-red-800">
      <h1 className="text-3xl font-bold">Oops! Something went wrong</h1>
      <p className="mt-2">
        An unexpected error occurred. Please try again later.
      </p>
      <button
        onClick={() => (window.location.href = "/login")}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition">
        Back to Login
      </button>
    </div>
  );
}
