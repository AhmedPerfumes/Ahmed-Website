'use client';
import { useRef, useState, useEffect } from "react";
import { motion, useAnimation, useSpring, useTransform, useScroll } from 'framer-motion';

import Banner2 from "@/components/homes/home-2/Banner";
import Banner22 from "@/components/homes/home-22/Banner";
import VideoBanner from "@/components/homes/home-10/VideoBanner";
// import Test3 from "@/components/Test3";

const Test2 = () => {

  return (
    <>
      <div className="mb-4 pb-4 mb-xl-4 mt-xl-3 pt-xl-3 pb-xl-4"></div>
      <Banner2 />
      <div className="mb-4 pb-4 mb-xl-4 mt-xl-3 pt-xl-3 pb-xl-4"></div>
      <Banner22 />
      <div className="mb-4 pb-4 mb-xl-4 mt-xl-3 pt-xl-3 pb-xl-4"></div>
      <VideoBanner />
      <div className="mb-4 pb-4 mb-xl-4 mt-xl-3 pt-xl-3 pb-xl-4"></div>
      <Banner22 />
      <div className="mb-4 pb-4 mb-xl-4 mt-xl-3 pt-xl-3 pb-xl-4"></div>
      <VideoBanner />
      <div className="mb-4 pb-4 mb-xl-4 mt-xl-3 pt-xl-3 pb-xl-4"></div>
      <Test3 />
      <div className="mb-4 pb-4 mb-xl-4 mt-xl-3 pt-xl-3 pb-xl-4"></div>
    </>
  );
}


export default Test2;