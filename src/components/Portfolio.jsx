import React, { useState, useEffect } from "react";
import PortfolioCSS from "../css/Portfolio.module.css";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import imageMetadata from "./ImageMetadata"; // Mapping of filename to metadata

// Dynamically import all images from the assets/images folder
const importAll = (r) => r.keys().map(r);
let images = importAll(
  require.context("../assets/images", false, /\.(webp|png|jpg|jpeg|gif)$/)
);

// Sort images in descending order (newest first)
images = images.sort((a, b) => {
  const nameA = a.split("/").pop();
  const nameB = b.split("/").pop();
  return nameB.localeCompare(nameA);
});

// Helper function to extract the year from a filename.
function getYearFromFilename(src) {
  const filename = src.split("/").pop();
  const parts = filename.split("_");
  if (parts.length < 2) return null;
  const datePart = parts[1].split(".")[0];
  return datePart.slice(0, 4);
}

function Portfolio() {
  const [selectedYear, setSelectedYear] = useState("All");
  const [currentYear, setCurrentYear] = useState(null);
  // This state will control the vertical position of the floating year (in percentage)
  const [yearTop, setYearTop] = useState("12%");

  // Listen to scroll events and update the vertical position of the floating year
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.pageYOffset;
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          const scrollPercentage = scrollTop / maxScroll;
          // Map scroll progress into a vertical position between 12% and 87%
          const newTop = 12 + scrollPercentage * 75;
          // Round to 1 decimal place to avoid rapid micro updates:
          setYearTop(`${newTop.toFixed(1)}%`);
          ticking = false;
        });
        ticking = true;
      }
    };
  
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get unique years from the image filenames
  const yearsSet = new Set();
  images.forEach((src) => {
    const year = getYearFromFilename(src);
    if (year) yearsSet.add(year);
  });
  const years = Array.from(yearsSet);
  years.sort((a, b) => b - a); // Sort descending by year
  years.unshift("All");

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  // Callback to update the floating year when an image is centered in view
  const handleImageVisible = (year) => {
    setCurrentYear(year);
  };

  // Filter images based on selected year
  const filteredImages =
    selectedYear === "All"
      ? images
      : images.filter((src) => getYearFromFilename(src) === selectedYear);

  return (
    <div className={PortfolioCSS.portfolioContainer}>
      <div className={PortfolioCSS.filter}>
        <label htmlFor="yearSelect">Filter by Year: </label>
        <select
          id="yearSelect"
          value={selectedYear}
          onChange={handleYearChange}
          className={PortfolioCSS.yearDropdown}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Static Vertical Line */}
      <div className={PortfolioCSS.staticLine}></div>

      {/* Floating Year Display */}
      {currentYear && (
        <div
          className={PortfolioCSS.floatingYearWrapper}
          style={{ top: yearTop }}
        >
        <div className={PortfolioCSS.floatingYearLine}></div>

          <motion.div
            key={currentYear}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 0.98 }}
            transition={{ duration: 0.5 }}
            className={PortfolioCSS.floatingYear}
          >
            {currentYear}
          </motion.div>
        </div>
      )}

      <div className={PortfolioCSS.gridContainer}>
        {filteredImages.map((src, index) => (
          <ImageWrapper
            key={index}
            src={src}
            index={index}
            onVisible={handleImageVisible}
          />
        ))}
      </div>
    </div>
  );
}

function ImageWrapper({ src, index, onVisible }) {
  const controls = useAnimation();
  // Main observer for fade-in animation
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });
  
  // Second observer to detect when the image is at the center
  const [yearRef, yearInView] = useInView({
    triggerOnce: false,
    threshold: 0.5,
    // Adjust the rootMargin to control when the image is considered “centered”
    rootMargin: "-25% 0px -25% 0px",
  });

  // Combine the refs so the same element is observed by both hooks
  const setRefs = (node) => {
    ref(node);
    yearRef(node);
  };

  // Extract the filename to look up metadata
  const filename = src.split("/").pop();
  const metadata = imageMetadata[filename] || {};

  React.useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1 });
    } else {
      controls.start({ opacity: 0 });
    }
  }, [controls, inView]);

  // When the image is centered, call the onVisible callback
  React.useEffect(() => {
    if (yearInView && onVisible) {
      const year = getYearFromFilename(src);
      if (year) {
        onVisible(year);
      }
    }
  }, [yearInView, src, onVisible]);

  // Only render caption if metadata is provided
  const hasCaption = metadata.title || metadata.size;

  return (
    <motion.div
      ref={setRefs}
      animate={controls}
      initial={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeIn" }}
      className={PortfolioCSS.imageWrapper}
    >
      <img
        src={src}
        alt={metadata.title || `Portfolio ${index + 1}`}
        className={PortfolioCSS.image}
        draggable="false"
      />
      {hasCaption && (
        <div className={PortfolioCSS.caption}>
          {metadata.title && <h3>{metadata.title}</h3>}
          {metadata.size && <p>{metadata.size}</p>}
        </div>
      )}
    </motion.div>
  );
}

export default Portfolio;
