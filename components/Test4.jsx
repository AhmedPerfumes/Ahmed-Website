'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from "gsap/ScrollTrigger";

const AutoScrollSection = () => {
    const triggerRef = useRef(null);
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

        // Auto-scroll to a specific section after a delay
        // const timer = setTimeout(() => {
        //   gsap.to(window, {
        ScrollTrigger.create({
            trigger: triggerRef.current,
            start: 'top center', // Adjust trigger position as needed
            end: 'bottom center',
            onEnter: () => {
                console.log('00000');
                gsap.to(window, {
                scrollTo: {
                    y: '#target-section',
                    // autoKill: true,
                },
                duration: 2,
                ease: 'power2.inOut',
                });
            },
            // Optionally, add additional behavior for other triggers
            });
        
            // Cleanup on unmount
            return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
            };
    }, []);

  return (
    <div>
      <section id="page1" style={{ height: '100vh', backgroundColor: '#f0f0f0' }}>
        <h1>Welcome to the Top</h1>
      </section>
      <section ref={triggerRef} style={{ height: '100vh', backgroundColor: '#a0a0a0' }}>
        <h1>Scroll to Trigger Scroll</h1>
      </section>
      <section id="target-section" style={{ height: '100vh', backgroundColor: '#a0a0a0' }}>
        <h1>You've Scrolled Here</h1>
      </section>
      <section style={{ height: '100vh', backgroundColor: '#d0d0d0' }}>
        <h1>More Content</h1>
      </section>
    </div>
  );
};

export default AutoScrollSection;