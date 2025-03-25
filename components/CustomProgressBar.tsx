import React, { useEffect, useRef } from "react";
import type { ToastContentProps } from "react-toastify";

export function CustomProgressBar({ isPaused, closeToast }: ToastContentProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPaused && ref.current) {
      const animation = ref.current.animate(
        [{ width: "100%" }, { width: "0%" }],
        { duration: 3000, easing: "linear" },
      );
      animation.onfinish = () => closeToast?.();
      return () => animation.cancel();
    }
  }, [isPaused, closeToast]);

  return (
    <div
      ref={ref}
      style={{
        height: "4px",
        background:
          "linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)",
      }}
    />
  );
}
