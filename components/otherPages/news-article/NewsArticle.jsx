"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './NewsArticle.css';

// Helper function to extract URL from <p> tags
const extractUrl = (htmlString) => {
  if (!htmlString) return '#';
  return htmlString.replace(/<p>|<\/p>/g, '').trim();
};

const NewsArticle = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const articlesPerPage = 6;

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/news-articles`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page: currentPage,
            limit: articlesPerPage,
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        setArticles(result.data || []);
        setTotalPages(result.last_page || Math.ceil(result.total / articlesPerPage));
      } catch (err) {
        setError('Failed to fetch articles. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <nav className="pagination-container">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          &larr; Prev
        </button>
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={`pagination-button ${currentPage === number ? 'active' : ''}`}
          >
            {number}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          Next &rarr;
        </button>
      </nav>
    );
  };

  return (
    <>
      <section className="page-header container">
        <h1>News & Updates</h1>
        <p>Stay informed with our latest articles and announcements.</p>
      </section>

      <section className="news-page container">
        {loading && <p className="loading-text">Loading articles...</p>}
        {error && <p className="error-text">{error}</p>}
        
        {!loading && !error && (
          <div className="news-grid">
            {articles.map((article) => (
              <a 
                key={article.id} 
                href={extractUrl(article.content)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="news-card"
              >
                <div className="news-card__image-wrapper">
                  <Image
                    src={article.image ? `${process.env.NEXT_PUBLIC_API_URL}storage/${article.image}` : '/assets/images/placeholder.jpg'}
                    alt={article.name}
                    layout="fill"
                    objectFit="cover"
                    className="news-card__image"
                  />
                </div>
                <div className="news-card__content">
                  <span className="news-card__source">{article.name}</span>
                  <h3 className="news-card__title">{article.description}</h3>
                  <p className="news-card__date">
                    {/* UPDATED LINE: Using post_date instead of created_at */}
                    {new Date(article.post_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}

        {!loading && articles.length > 0 && renderPagination()}
      </section>
    </>
  );
};

export default NewsArticle;