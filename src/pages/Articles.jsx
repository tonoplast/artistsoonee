import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PDFViewer from '../components/PDFViewer';
import ArticlesCSS from '../css/Articles.module.css';
import data from '../Data';

function Articles() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredArticles, setFilteredArticles] = useState(data.Articles);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredArticles(data.Articles);
    } else {
      setFilteredArticles(
        data.Articles.filter(article => article.category === selectedCategory)
      );
    }
  }, [selectedCategory]);

  const categories = ['all', ...new Set(data.Articles.map(article => article.category))];

  const getCategoryDisplayName = (category) => {
    const categoryNames = {
      'all': 'All Articles',
      'press': 'Press Coverage',
      'interview': 'Interviews',
      'review': 'Reviews',
      'catalog': 'Exhibition Catalogs',
      'statement': 'Artist Statements'
    };
    return categoryNames[category] || category;
  };

  return (
    <div className={ArticlesCSS.container}>
      <Header />
      
      <div className={ArticlesCSS.content}>
        <div className={ArticlesCSS.header}>
          <h1 className={ArticlesCSS.title}>Articles & Press</h1>
          <p className={ArticlesCSS.subtitle}>
            Discover articles, interviews, reviews, and press coverage about SooNee's artistic journey and exhibitions.
          </p>
        </div>

        <div className={ArticlesCSS.filters}>
          <div className={ArticlesCSS.filterButtons}>
            {categories.map(category => (
              <button
                key={category}
                className={`${ArticlesCSS.filterButton} ${
                  selectedCategory === category ? ArticlesCSS.activeFilter : ''
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {getCategoryDisplayName(category)}
              </button>
            ))}
          </div>
        </div>

        <div className={ArticlesCSS.articlesGrid}>
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article, index) => (
              <PDFViewer
                key={index}
                pdfUrl={article.pdfUrl}
                title={article.title}
                description={article.description}
                category={article.category}
                date={article.date}
              />
            ))
          ) : (
            <div className={ArticlesCSS.noResults}>
              <p>No articles found in this category.</p>
            </div>
          )}
        </div>

        <div className={ArticlesCSS.stats}>
          <div className={ArticlesCSS.statItem}>
            <span className={ArticlesCSS.statNumber}>{data.Articles.length}</span>
            <span className={ArticlesCSS.statLabel}>Total Articles</span>
          </div>
          <div className={ArticlesCSS.statItem}>
            <span className={ArticlesCSS.statNumber}>
              {new Set(data.Articles.map(article => article.category)).size}
            </span>
            <span className={ArticlesCSS.statLabel}>Categories</span>
          </div>
          <div className={ArticlesCSS.statItem}>
            <span className={ArticlesCSS.statNumber}>
              {new Set(data.Articles.map(article => new Date(article.date).getFullYear())).size}
            </span>
            <span className={ArticlesCSS.statLabel}>Years Covered</span>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default Articles; 