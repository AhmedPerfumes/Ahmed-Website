"use client";
import Pagination1 from "../common/Pagination1";
import { blogs12, categories } from "@/data/blogs";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Blog1() {
  // const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [filteredBlogs, setFilteredBlogs] = useState(blogs12);
  // useEffect(() => {
  //   if (activeCategory == "ALL") {
  //     setFilteredBlogs(blogs12);
  //   } else {
  //     setFilteredBlogs([
  //       ...blogs12.filter((elm) => elm.category.includes(activeCategory)),
  //     ]);
  //   }
  // }, [activeCategory]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // Pagination state
  const limit = 2; // Number of items per page
  const [totalPages, setTotalPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = async (page) => {
    setLoading(true);
    // console.log(`${process.env.NEXT_PUBLIC_API_URL}api/blogs?page=${page}&limit=${limit}}`);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/blogs?page=${page}&limit=${limit}}`);
    const newData = await res.json();
    const { data, total, to } = newData;
    if (data.length === 0) {
      setHasMore(false);
    }
    // console.log(...data);
    setBlogs((prevData) => [...prevData, ...data]); // Append new data
    setTotalPages(total);
    setCurrentPage(to);
    setLoading(false);
  };

  useEffect(() => {
    fetchData(page);
  }, [page, limit]); // Fetch data on page change

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading || !hasMore) return;
      setPage((prevPage) => prevPage + 1); // Load next page
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]); // Clean up on component unmount

  function removeSpecialCharactersAndAmp(str) {
    // Remove the specific word "&amp;"
    let cleanedStr = str.replace(/&amp;/g, '');

    // Remove all special characters
    cleanedStr = cleanedStr.replace(/[^\w\s-]/g, '');

    // Replace multiple spaces with a single space and trim
    cleanedStr = cleanedStr.replace(/\s+/g, ' ').trim();

    return cleanedStr;
  }

  return (
    <>
      <section className="blog-page-title mb-4 mb-xl-5">
        <div className="title-bg">
          <Image
            loading="lazy"
            src="/assets/images/blog_title_bg.jpg"
            width="1780"
            height="420"
            alt="image"
          />
        </div>
        <div className="container">
          {/* <h2 className="page-title">The Blog</h2> */}
          {/* <div className="blog__filter">
            {categories.map((elm, i) => (
              <a
                onClick={() => setActiveCategory(elm)}
                key={i}
                className={`menu-link menu-link_us-s ${
                  activeCategory == elm ? "menu-link_active" : ""
                }`}
              >
                {elm}
              </a>
            ))}
          </div> */}
        </div>
      </section>
      <section className="blog-page container">
        <h2 className="d-none">The Blog</h2>
        <div className="blog-grid row row-cols-1 row-cols-md-2">
          {blogs.map((elm, i) => (
            <div key={i} className="blog-grid__item">
              <div className="blog-grid__item-image">
                <Image
                  loading="lazy"
                  className="h-auto"
                  src={elm.image ? elm.image : '/assets/images/blog/blog-1.jpg'}
                  width="690"
                  height="500"
                  alt="image"
                />
              </div>
              <div className="blog-grid__item-detail">
                <div className="blog-grid__item-meta">
                  {/* <span className="blog-grid__item-meta__author">
                    By {elm.author}
                  </span> */}
                  <span className="blog-grid__item-meta__date">{new Date(elm.created_at).toLocaleDateString()}</span>
                </div>
                <div className="blog-grid__item-title">
                  <Link href={`/blog/${removeSpecialCharactersAndAmp(elm.name).split(' ').join('-').toLowerCase()}`}>{elm.name}</Link>
                </div>
                <div className="blog-grid__item-content">
                  <p>{elm.description}</p>
                  <Link
                    href={`/blog/${removeSpecialCharactersAndAmp(elm.name).split(' ').join('-').toLowerCase()}`}
                    className="readmore-link"
                  >
                    Continue Reading
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        {!loading && <p className="mb-5 text-center fw-medium">SHOWING {currentPage} {currentPage? 'of': ''} {totalPages} items</p>}
        {loading && <Pagination1 />}

        {/* <div className="text-center">
          <Link className="btn-link btn-link_lg text-uppercase fw-medium" href="#">
            Show More
          </Link>
        </div> */}
      </section>
    </>
  );
}
