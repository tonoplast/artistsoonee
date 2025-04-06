import React, { useState } from "react";
import PortfolioCSS from "../css/Portfolio.module.css";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Dynamically import all images from the assets/images folder
const importAll = (r) => r.keys().map(r);
const images = importAll(
  require.context("../assets/images", false, /\.(webp|png|jpg|jpeg|gif)$/)
);

// Helper function to extract the year from a filename.
// Assumes filenames are formatted like "00001_YYYYMMDD.jpg"
function getYearFromFilename(src) {
  const filename = src.split('/').pop(); // e.g. "00001_20230415.jpg"
  const parts = filename.split('_');
  if (parts.length < 2) return null;
  const datePart = parts[1].split('.')[0]; // e.g. "20230415"
  return datePart.slice(0, 4); // e.g. "2023"
}

function Portfolio() {
  const [selectedYear, setSelectedYear] = useState("All");

  // Get unique years from the image filenames
  const yearsSet = new Set();
  images.forEach((src) => {
    const year = getYearFromFilename(src);
    if (year) yearsSet.add(year);
  });
  const years = Array.from(yearsSet);
  years.sort((a, b) => b - a); // Sort descending (most recent first)
  years.unshift("All");

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
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
      <div className={PortfolioCSS.gridContainer}>
        {filteredImages.map((src, index) => (
          <ImageWrapper key={index} src={src} index={index} />
        ))}
      </div>
    </div>
  );
}

function ImageWrapper({ src, index }) {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  React.useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1 });
    } else {
      controls.start({ opacity: 0 });
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeIn" }}
      className={PortfolioCSS.imageWrapper}
    >
      <img
        src={src}
        alt={`Portfolio ${index + 1}`}
        className={PortfolioCSS.image}
        draggable="false"
      />
    </motion.div>
  );
}

export default Portfolio;
