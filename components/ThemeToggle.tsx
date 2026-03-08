"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  const saved = localStorage.getItem("blocklog-theme");
  if (saved === "light" || saved === "dark") {
    return saved;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("blocklog-theme", theme);
  }, [theme]);

  return (
    <button
      className="theme-btn"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      type="button"
    >
      {theme === "dark" ? "Light Mode" : "Dark Mode"}
    </button>
  );
}
