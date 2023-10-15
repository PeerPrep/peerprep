"use client";
import { useEffect, useState } from "react";

const useLoading = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleRouteChangeStart = () => {
      document.body.style.overflow = "hidden";
      setLoading(true);
    };

    const handleRouteChangeComplete = () => {
      document.body.style.overflow = "auto";
      setLoading(false);
    };

    // Add event listeners for route changes
    window.addEventListener("beforeunload", handleRouteChangeStart);
    window.addEventListener("load", handleRouteChangeComplete);

    return () => {
      // Remove event listeners when the component unmounts
      window.removeEventListener("beforeunload", handleRouteChangeStart);
      window.removeEventListener("load", handleRouteChangeComplete);
    };
  }, []);

  return loading;
};

export default useLoading;
