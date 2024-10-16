"use client";
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import "./Canvas.css"

gsap.registerPlugin(ScrollTrigger);

const MobileAnimation = () => {
  const canvasRef = useRef(null);
  const ballTextRef = useRef(null);
  const frameCount = 365;
  let images = [];
  let ball = { frame: 0 };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const currentFrame = (index) => `/assets/mobilescreen/${(index + 1).toString()}.jpg`;

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

export default MobileAnimation;
