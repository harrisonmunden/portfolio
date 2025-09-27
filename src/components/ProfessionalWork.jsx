import React, { useState, useRef, useEffect, useCallback } from "react";
import "./styles/about.css";
import { motion } from 'framer-motion';
import { useScrollToTop } from '../hooks/useScrollToTop';

const aboutHeaders = {
  Tesla: '/AboutAssets/About/TeslaAboutHeader-compressed.webp',
  Ford: '/AboutAssets/About/FordAboutHeader-compressed.webp',
  DFR: '/AboutAssets/About/DFRAboutHeader-compressed.webp',
};
const bulletImg = '/AboutAssets/About/Bullet.webp';
const chevronImg = '/GlassyObjects/About/Chevron.png';

const BATCH_SIZE = 1;
let globalVisibleCount = BATCH_SIZE;

const ProfessionalWork = ({ goTo, hideNav }) => {
  const experiences = [
    {
      id: 1,
      title: "3D UI Developer",
      company: "Tesla",
      headerImg: aboutHeaders.Tesla,
      description: [
        "Leading 3D design and engineering for Tesla Energy. Seen in experiences like Tesla Recharged, a feature that garnered hundreds of thousands of views and shares. ",
        "Managed the 3D engine for the Tesla Mobile App, squashing bugs and delivering new features such as Tesla Powershare and the Tesla Energy Home visualization.",
        "3D modeling, texturing, and animation for both baked and real time applications.",
        "Game engine & shader scripting, mobile app implementation."
      ]
    },
    {
      id: 2,
      title: "HMI Design Intern",
      company: "Ford",
      headerImg: aboutHeaders.Ford,
      description: [
        "Created renderings and animations that showcased the defining features of Lincoln’s 100-year anniversary concept car, the L100.",
        "Developed the design language of the public unveil of the L100 at Pebble Beach’s Concours D’Elegance.",      ]
    },
    {
      id: 3,
      title: "Body Designer",
      company: "Dartmouth Formula Racing",
      headerImg: aboutHeaders.DFR,
      description: [
        "Designed and fabricated multiple Formula Hybrid race car components, including an impact attenuator, nose cone, side paneling, and side view mirrors.",
        "Implemented a new steering system into the car."
      ]
    }
  ];

  const [visibleCount, setVisibleCount] = useState(globalVisibleCount);
  const sentinelRef = useRef();
  
  // Moderately controlled scroll-to-home: Only when AT TOP + two aggressive scroll ups
  useEffect(() => {
    let scrollUpCount = 0;
    let resetTimeout = null;
    
    const handleWheel = (e) => {
      // Only when already at the very top of the page
      if (window.scrollY > 0) {
        scrollUpCount = 0;
        return;
      }
      
      // Detect aggressive scroll up (moderate threshold)
      if (e.deltaY < -80) { // Moderate threshold (between -50 and -120)
        scrollUpCount++;
        
        // Clear any existing timeout
        if (resetTimeout) {
          clearTimeout(resetTimeout);
        }
        
        // Require TWO aggressive scroll ups
        if (scrollUpCount >= 2) {
          if (goTo) {
            goTo('home');
          }
          scrollUpCount = 0; // Reset after successful trigger
        } else {
          // Moderate timeout - reasonable timing
          resetTimeout = setTimeout(() => {
            scrollUpCount = 0;
          }, 1200); // Moderate timing between 800ms and 2000ms
        }
      }
    };

    const handleScroll = () => {
      // Reset immediately if user scrolls down from top
      if (window.scrollY > 0) {
        scrollUpCount = 0;
        if (resetTimeout) {
          clearTimeout(resetTimeout);
          resetTimeout = null;
        }
      }
    };

    document.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      document.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
      if (resetTimeout) {
        clearTimeout(resetTimeout);
      }
    };
  }, [goTo]);

  // Infinite scroll: load more sections when sentinel is visible
  const loadMore = useCallback(() => {
    setVisibleCount((prev) => {
      const next = Math.min(prev + BATCH_SIZE, experiences.length);
      globalVisibleCount = next;
      return next;
    });
  }, [experiences.length]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    if (visibleCount >= experiences.length) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < experiences.length) {
          loadMore();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore, visibleCount, experiences.length]);

  return (
    <div className="about-container">
      {/* Header */}
      <div className="about-header">
        {!hideNav && (
          <motion.h1 className="about-title" style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: goTo ? 'pointer' : 'default'}} onClick={() => goTo && goTo('home')}>
            <span>professional work</span>
            <motion.img src={chevronImg} alt="chevron" className="chevron-img" />
          </motion.h1>
        )}
      </div>

      {/* Photo Section */}
      <div className="about-photo-section">
        <div className="about-intro-section">
          <h2 className="about-intro-title">Hi, I'm Harrison</h2>
          <p className="about-intro-text">
            I'm a technical 3D artist and developer passionate about creating immersive digital experiences. 
            With expertise in 3D modeling, shader scripting, and art direction, I live in the gap 
            between technology and creativity. Currently working at Tesla, where I  work on 3D design 
            and Engineering for the Tesla Mobile App and Tesla Energy. Currently based in the Bay Area. 
          </p>
        </div>
      </div>

      {/* Experience Timeline */}
      <div className="experience-timeline">
        {experiences.map((experience, i) => {
          if (i >= visibleCount) {
            return <div key={experience.id} style={{ height: 0 }} />;
          }
          return (
            <div key={experience.id} className="experience-item custom-timeline">
              {/* Section header image only */}
              <img src={experience.headerImg} alt={experience.company + ' header'} className="about-header-img" />
              <div className="experience-content">
                {/* Description points with bullet image */}
                <div className="job-description">
                  {experience.description.map((point, index) => (
                    <div key={index} className="description-point">
                      <img src={bulletImg} alt="bullet" className="about-bullet-img" />
                      <p className="point-text">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
        {/* Sentinel for infinite scroll */}
        <div ref={sentinelRef} style={{ height: 1 }} />
      </div>
    </div>
  );
};

export default ProfessionalWork;
