import React, { useState } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AboutCSS from "../css/About.module.css";
import data from "../Data";
import artistCV from "../content/artistCV";

// Dynamically import the profile image
const importAll = (r) => r.keys().map(r);
const images = importAll(
  require.context("../assets/profile", false, /\.(webp|png|jpg|jpeg|gif)$/)
);
const profileImage = images.length > 0 ? images[0] : null;

function About() {
  const [lang, setLang] = useState("en");
  const content = artistCV[lang];

  const handleClick = () => {
    const email = data.AboutEmail;
    const subject = data.AboutEmailSubject;
    const emailLink = document.createElement("a");
    emailLink.href = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    emailLink.click();
  };

  return (
    <div className={AboutCSS.container}>
      <Header />
      <div className={AboutCSS.content}>
        <div className={AboutCSS.imageWrapper}>
          {profileImage && (
            <img
              src={profileImage}
              alt={content.name}
              className={AboutCSS.image}
            />
          )}
        </div>
        <div className={AboutCSS.textWrapper}>
          <div className={AboutCSS.headingRow}>
            <h1>{content.heading}</h1>
            <div
              className={AboutCSS.langSwitcher}
              role="group"
              aria-label="Language selector"
            >
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`${AboutCSS.langTab} ${
                  lang === "en" ? AboutCSS.langTabActive : ""
                }`}
                aria-pressed={lang === "en"}
              >
                EN
              </button>
              <span className={AboutCSS.langDivider}>|</span>
              <button
                type="button"
                onClick={() => setLang("kr")}
                className={`${AboutCSS.langTab} ${
                  lang === "kr" ? AboutCSS.langTabActive : ""
                }`}
                aria-pressed={lang === "kr"}
              >
                KR
              </button>
            </div>
          </div>
          <div className={AboutCSS.markdown}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content.bioParagraphs.join("\n\n")}
            </ReactMarkdown>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {content.careerMarkdown}
            </ReactMarkdown>
          </div>
          <div
            className={AboutCSS.contactInfo}
            dangerouslySetInnerHTML={{ __html: content.contactInfo }}
          />

          <div className={AboutCSS.buttonRow}>
            <button onClick={handleClick} className={AboutCSS.contactButton}>
              {content.contactButtonLabel}
            </button>
            <Link
              to="/cv"
              target="_blank"
              rel="noopener noreferrer"
              className={AboutCSS.secondaryButton}
            >
              {content.downloadLabel}
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default About;
