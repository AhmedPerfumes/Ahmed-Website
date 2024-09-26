import Blog3 from "@/components/blogs/Blog3";
import BlogDetails from "@/components/blogs/BlogDetails";
import Footer1 from "@/components/footers/Footer1";

import Header1 from "@/components/headers/Header1";
import { allBlogs } from "@/data/blogs";
import React from "react";

export const metadata = {
  title: "Perfumes | Buy Best Perfumes Online | Ahmed Perfume",
  description: "Buy Best Perfumes Online Ahmed Perfume",
  icons: {
    icon: 'https://www.ahmedalmaghribi.com/wp-content/uploads/2021/08/Ahmed-Logo-e1631552829722-100x100.png',
  },
};

async function getBlog(blogName) {
  // console.log(`${process.env.NEXT_PUBLIC_API_URL}api/getBlogDetails?blog=${blogName.split("-").join(" ").toUpperCase()}`);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/getBlogDetails?blog=${blogName.split("-").join(" ").toUpperCase()}`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}


const BlogDetailsPage = async({ params }) => {
  const { blogName } = params;
  // console.log(blogName);
  try {
    const data = await getBlog(blogName[0]);
    console.log('000', data);
    return (
      <>
        <Header1 />
        <main className="page-wrapper">
          <div className="mb-4 pb-4"></div>
          <BlogDetails blog={data} />
        </main>
        <div className="mb-5 pb-xl-5"></div>
        <Footer1 />
      </>
    );
  } catch (error) {
    console.error(error);
    return <p>Failed to load data.</p>;
  }
}

export default BlogDetailsPage;
