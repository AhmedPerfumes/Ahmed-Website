"use client";
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollToPlugin from 'gsap/ScrollToPlugin';

import "./Canvas.css"

gsap.registerPlugin(ScrollTrigger,ScrollToPlugin);

const CanvasAnimation = () => {
  const canvasRef = useRef(null);
  const ballTextRef = useRef(null);
  const frameCount = 380;
  let images = [];
  let ball = { frame: 0 };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const currentFrame = (index) => `/assets/final/${(index + 100000).toString()}.jpg`;

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      images.push(img);
    }

    const render = () => {
      context.canvas.width = images[0].width;
      context.canvas.height = images[0].height;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(images[ball.frame], 0, 0);
     
    };

    images[0].onload = render;

    gsap.to(ball, {
      frame: frameCount - 1,
      snap: 'frame',
      ease: 'none',
      scrollTrigger: {
        scrub: 1,
        pin: canvas,
        end: '250%',
        // onLeave: () => {
        //   // Snap to the next section when the last frame is reached
        //   gsap.to(window, {
        //     scrollTo: { y: "#animation-section", autoKill: false }, // Smooth scroll to the section
        //     duration: 0.5,
        //     ease: "power2.inOut",
        //   });
        // },
      },
      onUpdate: render,
    });

 

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div>
    
      <canvas ref={canvasRef} className="canvas"></canvas>
      
    </div>
  );
};

export default CanvasAnimation;
