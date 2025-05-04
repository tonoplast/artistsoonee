// src/components/Slideshow.js
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HighlightCSS from "../css/Highlight.module.css";
import highlightMetadata from "./HighlightMetadata"; // ← your metadata map

// Utility to strip hashes as before:
function stripHash(filenameWithHash) {
  const parts = filenameWithHash.split(".");
  const ext = parts.pop();
  const beforeHash = parts
    .join(".")
    .replace(/\.[0-9a-f]{6,}$/i, "");
  return `${beforeHash}.${ext}`;
}
function getFilenameFromSrc(src) {
  const full = src.split("/").pop();
  return stripHash(full);
}

// Import & sort your images
const importAll = (r) => r.keys().map(r);
const images = importAll(
  require.context("../assets/images_home", false, /\.(webp|png|jpg|jpeg|gif)$/)
).sort((a, b) => {
  const nameA = a.split("/").pop();
  const nameB = b.split("/").pop();
  return nameB.localeCompare(nameA);
});

const FADE_DURATION = 0.5;      // seconds
const AUTO_PLAY_INTERVAL = 5; // seconds

export default function Slideshow() {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);

  const prev = () =>
    setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () =>
    setIndex((i) => (i + 1) % images.length);

  // Auto-advance timer
  useEffect(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(next, AUTO_PLAY_INTERVAL * 1000);
    return () => clearTimeout(timeoutRef.current);
  }, [index]);

  // Grab current slide's metadata
  const filename = getFilenameFromSrc(images[index]);
  const metadata = highlightMetadata[filename] || {};

  return (
    <div className={HighlightCSS.slideshowContainer}>
      {/* <AnimatePresence mode="sync"> */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className={HighlightCSS.slideWrapper}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE_DURATION, ease: "easeInOut" }}
        >
          <img
            src={images[index]}
            alt={metadata.title || `Slide ${index + 1}`}
            className={HighlightCSS.slideshowImage}
            draggable="false"
          />

          {/* Caption */}
          {(metadata.title || metadata.size) && (
            <div className={HighlightCSS.caption}>
              {metadata.title && <h3>{metadata.title}</h3>}
              {metadata.size  && <p>{metadata.size}</p>}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Left/right controls */}
      <button
        className={`${HighlightCSS.arrow} ${HighlightCSS.left}`}
        onClick={prev}
        aria-label="Previous slide"
      >
        ‹
      </button>
      <button
        className={`${HighlightCSS.arrow} ${HighlightCSS.right}`}
        onClick={next}
        aria-label="Next slide"
      >
        ›
      </button>

      {/* Counter */}
      <div className={HighlightCSS.counter}>
        {index + 1} / {images.length}
      </div>
    </div>
  );
}
