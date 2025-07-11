import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaDownload, FaEye, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import PDFViewerCSS from '../css/PDFViewer.module.css';

const PDFViewer = ({ pdfUrl, title, description, category, date }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load PDF file dynamically
  useEffect(() => {
    const loadPdfFile = async () => {
      try {
        setIsLoading(true);
        // Extract filename from pdfUrl
        const filename = pdfUrl.split('/').pop();
        const pdfModule = await import(`../assets/articles/${filename}`);
        setPdfFile(pdfModule.default);
      } catch (error) {
        console.error('Error loading PDF:', error);
        setPdfFile(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (pdfUrl) {
      loadPdfFile();
    }
  }, [pdfUrl]);

  const handleDownload = () => {
    if (pdfFile) {
      const link = document.createElement('a');
      link.href = pdfFile;
      link.download = title.replace(/\s+/g, '_') + '.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('PDF file not found. Please check if the file exists.');
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentPage(1);
  };

  const nextPage = () => {
    if (currentPage < numPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Note: onDocumentLoadSuccess is kept for future PDF.js integration if needed
  // eslint-disable-next-line no-unused-vars
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  if (isLoading) {
    return (
      <div className={PDFViewerCSS.articleCard}>
        <div className={PDFViewerCSS.loading}>Loading PDF...</div>
      </div>
    );
  }

  return (
    <div className={PDFViewerCSS.articleCard}>
      <div className={PDFViewerCSS.articleInfo}>
        <div className={PDFViewerCSS.category}>{category}</div>
        <h3 className={PDFViewerCSS.title}>{title}</h3>
        <p className={PDFViewerCSS.description}>{description}</p>
        <div className={PDFViewerCSS.date}>{date}</div>
      </div>
      
      <div className={PDFViewerCSS.actions}>
        <button 
          className={`${PDFViewerCSS.actionButton} ${PDFViewerCSS.viewButton}`}
          onClick={openModal}
        >
          <FaEye /> View
        </button>
        <button 
          className={`${PDFViewerCSS.actionButton} ${PDFViewerCSS.downloadButton}`}
          onClick={handleDownload}
        >
          <FaDownload /> Download
        </button>
      </div>

      {/* Modal for PDF viewing - rendered outside container */}
      {isModalOpen && createPortal(
        <div className={PDFViewerCSS.modalOverlay} onClick={closeModal}>
          <div className={PDFViewerCSS.modal} onClick={(e) => e.stopPropagation()}>
            <div className={PDFViewerCSS.modalHeader}>
              <h3>{title}</h3>
              <button className={PDFViewerCSS.closeButton} onClick={closeModal}>
                <FaTimes />
              </button>
            </div>
            
            <div className={PDFViewerCSS.pdfContainer}>
              {pdfFile ? (
                <iframe
                  src={`${pdfFile}#page=${currentPage}`}
                  title={title}
                  className={PDFViewerCSS.pdfFrame}
                  onLoad={() => {
                    // PDF viewer will handle page loading
                  }}
                  onError={() => {
                    alert('PDF file could not be loaded. Please check if the file exists.');
                  }}
                />
              ) : (
                <div className={PDFViewerCSS.pdfError}>
                  <p>PDF file not found: {pdfUrl.split('/').pop()}</p>
                  <p>Please ensure the file exists in src/assets/articles/</p>
                </div>
              )}
            </div>
            
            <div className={PDFViewerCSS.modalFooter}>
              <div className={PDFViewerCSS.pageControls}>
                <button 
                  className={PDFViewerCSS.pageButton}
                  onClick={prevPage}
                  disabled={currentPage <= 1}
                >
                  <FaChevronLeft />
                </button>
                <span className={PDFViewerCSS.pageInfo}>
                  Page {currentPage} of {numPages || '...'}
                </span>
                <button 
                  className={PDFViewerCSS.pageButton}
                  onClick={nextPage}
                  disabled={currentPage >= (numPages || 1)}
                >
                  <FaChevronRight />
                </button>
              </div>
              <button 
                className={`${PDFViewerCSS.actionButton} ${PDFViewerCSS.downloadButton}`}
                onClick={handleDownload}
              >
                <FaDownload /> Download PDF
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default PDFViewer; 