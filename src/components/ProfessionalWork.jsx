import React, { useState, useRef, useEffect, useCallback } from "react";
import "./styles/about.css";
import { motion } from 'framer-motion';
import { useScrollToTop } from '../hooks/useScrollToTop';

// Showcase rows: each video paired with its related screens
const showcaseRows = [
  {
    video: { id: 1, type: 'video', src: '/ProfessionalWork/tesla-recharged-hero-desktop.webm', title: 'Tesla Recharged Campaign and App Experience', aspect: 1536 / 894 },
    screens: [
      { id: 2, type: 'image', src: '/ProfessionalWork/IntroScreen.webp', title: 'Personalized stats inside the mobile app', aspect: 786 / 1704 },
      { id: 3, type: 'image', src: '/ProfessionalWork/BatteryCounterfactual.webp', title: 'Personalized stats inside the mobile app', aspect: 786 / 1704 },
      { id: 4, type: 'image', src: '/ProfessionalWork/MoneySaved.webp', title: 'Personalized stats inside the mobile app', aspect: 786 / 1704 },
    ],
  },
  {
    video: { id: 5, type: 'video', src: '/ProfessionalWork/1-wbjoE2FFqsgX7E.webm', title: 'Live weather visualization inside the Tesla App', aspect: 16 / 9 },
    screens: [
      { id: 6, type: 'image', src: '/ProfessionalWork/1764099355937.webp', title: 'Parameterized weather system in the mobile app', aspect: 928 / 1716 },
    ],
  },
];

const aboutHeaders = {
  Tesla: '/AboutAssets/About/TeslaAboutHeader-compressed.webp',
  Ford: '/AboutAssets/About/FordAboutHeader-compressed.webp',
  DFR: '/AboutAssets/About/DFRAboutHeader-compressed.webp',
};
const bulletImg = '/AboutAssets/About/Bullet.webp';
const chevronImg = '/GlassyObjects/About/Chevron.png';

// Showcase media card (video or image) with tap-to-reveal overlay on mobile
const ShowcaseCard = ({ item, className = '', style = {} }) => {
  const [tapped, setTapped] = useState(false);
  const aspectStyle = item.aspect ? { aspectRatio: `${item.aspect}` } : {};

  return (
    <div
      className={`showcase-card ${className}`}
      style={{ ...style, ...aspectStyle }}
      onClick={() => setTapped((v) => !v)}
      onMouseEnter={() => setTapped(true)}
      onMouseLeave={() => setTapped(false)}
    >
      <div className="showcase-media-wrapper">
        {item.type === 'video' ? (
          <video
            className="showcase-media"
            src={item.src}
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <img
            className="showcase-media"
            src={item.src}
            alt={item.title}
            loading="lazy"
          />
        )}
        <div className={`showcase-overlay ${tapped ? 'active' : ''}`}>
          <span className="showcase-overlay-title">{item.title}</span>
        </div>
      </div>
    </div>
  );
};

// Showcase section: hero video + screens row below
const ShowcaseSection = ({ row }) => {
  const heroVideoRef = useRef(null);
  const [heroHeight, setHeroHeight] = useState(0);

  useEffect(() => {
    const el = heroVideoRef.current;
    if (!el) return;
    const update = () => setHeroHeight(el.offsetHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="showcase-section">
      <div className="showcase-hero-row">
        <div className="showcase-hero-video" ref={heroVideoRef}>
          <ShowcaseCard item={row.video} />
        </div>
      </div>
      {row.screens.length > 0 && (
        <div
          className="showcase-screens-container"
          style={heroHeight ? { height: heroHeight } : {}}
        >
          {row.screens.map((item) => (
            <ShowcaseCard key={item.id} item={item} className="showcase-screen-card" />
          ))}
        </div>
      )}
    </div>
  );
};

// Showcase grid
const ShowcaseGrid = () => {
  return (
    <div className="showcase-grid">
      {showcaseRows.map((row, index) => (
        <ShowcaseSection key={row.video.id} row={row} />
      ))}
    </div>
  );
};

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
        "Managing the 3D engine for the Tesla Mobile App.",
        "Leading 3D design and engineering for Tesla Energy. ",
        "3D modeling, texturing, and animation for both baked and real time applications.",
        "Game engine & shader scripting, mobile app implementation."
      ]
    },
    // {
    //   id: 2,
    //   title: "HMI Design Intern",
    //   company: "Ford",
    //   headerImg: aboutHeaders.Ford,
    //   description: [
    //     "3D asset creation for concept cars.",
    //     "Ergonomics analysis and design.",
    //   ]
    // },
    // {
    //   id: 3,
    //   title: "Body Designer",
    //   company: "Dartmouth Formula Racing",
    //   headerImg: aboutHeaders.DFR,
    //   description: [
    //     "Designed and fabricated race car components.",
    //     "Designed and installed a new steering system into the car."
    //   ]
    // }
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

      {/* Showcase Grid */}
      <ShowcaseGrid />

      {/* Photo Section */}
      <div className="about-photo-section">
        <div className="about-intro-section">
          <p className="about-intro-text">
            Expirienced in 3D modeling, shader scripting, motion design, and art direction.
            Currently based in the Bay Area working at Tesla Motors.

            Project details available upon request.
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
