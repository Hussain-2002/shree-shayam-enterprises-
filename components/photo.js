"use client";

import { useState } from "react";

export function Photo({ src, alt }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <span className="photo-fallback">{alt || "Shree Shyam Enterprises"}</span>;
  }
  return <img src={src} alt={alt} onError={() => setFailed(true)} />;
}
