import React, { useState } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CVCSS from "../css/CV.module.css";
import artistCV from "../content/artistCV";
import data from "../Data";

function CV() {
  const [lang, setLang] = useState("en");
  const content = artistCV[lang];

  const toggleLang = () => {
    setLang((prev) => (prev === "en" ? "kr" : "en"));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={CVCSS.page}>
      <div className={CVCSS.toolbar}>
        <Link to="/about" className={CVCSS.backLink}>
          &larr; Back to About
        </Link>
        <div className={CVCSS.toolbarActions}>
          <button onClick={toggleLang} className={CVCSS.toolbarButton}>
            {content.languageToggleLabel}
          </button>
          <button onClick={handlePrint} className={CVCSS.toolbarButton}>
            {content.printButtonLabel}
          </button>
        </div>
      </div>

      <div className={CVCSS.sheet}>
        <h1 className={CVCSS.name}>{content.name}</h1>
        <p className={CVCSS.contactLine}>
          {data.AboutEmail} &middot; artistsoonee.vercel.app
        </p>

        {content.bioParagraphs.map((paragraph, index) => (
          <p key={index} className={CVCSS.bioParagraph}>
            {paragraph.replace(/\*/g, "")}
          </p>
        ))}

        <div className={CVCSS.markdown}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content.careerMarkdown}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

export default CV;
