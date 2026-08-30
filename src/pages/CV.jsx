import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CVCSS from "../css/CV.module.css";
import artistCV from "../content/artistCV";
import data from "../Data";

function CV() {
  const [lang, setLang] = useState("en");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const content = artistCV[lang];
  const sheetRef = useRef(null);

  const handleDownload = async () => {
    const node = sheetRef.current;
    if (!node || isGeneratingPdf) return;

    setIsGeneratingPdf(true);

    // Force a fixed desktop-like width so the PDF looks the same
    // regardless of the device (mobile) viewport it was generated on.
    const { width: originalWidth, maxWidth: originalMaxWidth } = node.style;
    node.style.width = "800px";
    node.style.maxWidth = "800px";

    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const canvas = await html2canvas(node, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`SooNee_CV_${lang}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Could not generate the PDF. Please try again.");
    } finally {
      node.style.width = originalWidth;
      node.style.maxWidth = originalMaxWidth;
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className={CVCSS.page}>
      <div className={CVCSS.toolbar}>
        <Link to="/about" className={CVCSS.backLink}>
          &larr; {lang === "kr" ? "소개 페이지로 돌아가기" : "Back to About"}
        </Link>
        <div className={CVCSS.toolbarActions}>
          <div
            className={CVCSS.langSwitcher}
            role="group"
            aria-label="Language selector"
          >
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`${CVCSS.langTab} ${
                lang === "en" ? CVCSS.langTabActive : ""
              }`}
              aria-pressed={lang === "en"}
            >
              EN
            </button>
            <span className={CVCSS.langDivider}>|</span>
            <button
              type="button"
              onClick={() => setLang("kr")}
              className={`${CVCSS.langTab} ${
                lang === "kr" ? CVCSS.langTabActive : ""
              }`}
              aria-pressed={lang === "kr"}
            >
              KR
            </button>
          </div>
          <button
            onClick={handleDownload}
            className={CVCSS.toolbarButton}
            disabled={isGeneratingPdf}
          >
            {isGeneratingPdf
              ? lang === "kr"
                ? "생성 중..."
                : "Generating..."
              : content.printButtonLabel}
          </button>
        </div>
      </div>

      <div className={CVCSS.sheet} ref={sheetRef}>
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
