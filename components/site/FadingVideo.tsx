"use client";

import { useEffect, useRef } from "react";

const FADE_MS = 500;
const FADE_OUT_LEAD_MS = 550;

type FadingVideoProps = {
  src: string;
  className?: string;
  poster?: string;
  muted?: boolean;
  playsInline?: boolean;
};

export default function FadingVideo({
  src,
  className,
  poster,
  muted = true,
  playsInline = true,
}: FadingVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const startedRef = useRef(false);
  const previousTimeRef = useRef(0);
  const isFadedOutRef = useRef(false);

  const monitorRafRef = useRef<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;
    // Reset state on src change
    startedRef.current = false;
    previousTimeRef.current = 0;
    isFadedOutRef.current = false;

    // Safari autoplay hardening
    video.defaultMuted = true;
    video.muted = muted;

    // Styling
    video.style.opacity = "0";

    video.style.transition =
      `opacity ${FADE_MS}ms linear`;

    video.style.willChange = "opacity";

    video.style.backfaceVisibility = "hidden";

    video.style.transform = "translateZ(0)";

    // Helpers
    const cancelMonitor = () => {
      if (monitorRafRef.current !== null) {
        cancelAnimationFrame(
          monitorRafRef.current
        );

        monitorRafRef.current = null;
      }
    };

    const fadeIn = () => {
      if (!isFadedOutRef.current) return;

      isFadedOutRef.current = false;

      video.style.opacity = "1";
    };

    const fadeOut = () => {
      if (isFadedOutRef.current) return;

      isFadedOutRef.current = true;

      video.style.opacity = "0";
    };

    // Loop monitor
    const monitorLoop = () => {
      if (!video.duration || video.paused) {
        monitorRafRef.current =
          requestAnimationFrame(monitorLoop);

        return;
      }

      const current = video.currentTime;

      const previous =
        previousTimeRef.current;

      const remaining =
        video.duration - current;

      // Native loop detected
      if (current < previous) {
        requestAnimationFrame(() => {
          fadeIn();
        });
      }

      // Fade before loop point
      if (
        remaining <=
        FADE_OUT_LEAD_MS / 1000
      ) {
        fadeOut();
      }

      previousTimeRef.current = current;

      monitorRafRef.current =
        requestAnimationFrame(monitorLoop);
    };

    // Playback
    const startPlayback = async () => {
      try {
        await video.play();

        requestAnimationFrame(() => {
          video.style.opacity = "1";
        });

        cancelMonitor();

        monitorLoop();
      } catch {
        // autoplay blocked
      }
    };

    // Events
    const handleLoadedData = () => {
      if (startedRef.current) return;

      startedRef.current = true;

      startPlayback();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
    };

    // Listeners
    video.addEventListener(
      "loadeddata",
      handleLoadedData
    );

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    // Immediate start fallback
    if (video.readyState >= 2) {
      handleLoadedData();
    }

    // Cleanup
    return () => {
      cancelMonitor();

      video.removeEventListener(
        "loadeddata",
        handleLoadedData
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [src, muted]);

  return (
    <video
      ref={videoRef}
      className={className}
      src={src}
      poster={poster}
      muted={muted}
      playsInline={playsInline}
      preload="auto"
      autoPlay
      loop
      disablePictureInPicture
    />
  );
}