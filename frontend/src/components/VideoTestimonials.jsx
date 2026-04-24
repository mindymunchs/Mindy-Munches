import { useState, useEffect } from "react";

/**
 * Fetches video testimonials from the API.
 * On failure or empty response, returns an empty list so the
 * consuming UI can hide the section gracefully.
 */
export const useVideoTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchTestimonials = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/video-testimonials`
        );
        const contentType = response.headers.get("content-type") || "";
        if (!response.ok || !contentType.includes("application/json")) {
          throw new Error(`Bad response (${response.status})`);
        }

        const data = await response.json();
        if (!cancelled) {
          setTestimonials(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
          setTestimonials([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchTestimonials();
    return () => {
      cancelled = true;
    };
  }, []);

  return { testimonials, loading, error };
};
