"use client";
import { useEffect } from "react";

export default function GoogleSuccessPage() {
  useEffect(() => {
    // Tell the opener (main window) that login succeeded
    if (window.opener) {
      window.opener.postMessage({ type: "GOOGLE_AUTH_SUCCESS" }, "*");
      window.close();
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-500">Completing login...</p>
    </div>
  );
}
