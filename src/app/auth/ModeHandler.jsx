// app/auth/ModeHandler.jsx
"use client";

import React, { useEffect } from "react";

export default function ModeHandler({ setIsLogin }) {
  const { useSearchParams } = require("next/navigation"); // dynamic import for safety
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  useEffect(() => {
    if (mode === "signup") {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [mode, setIsLogin]);

  return null; // no UI, just handles the mode
}
