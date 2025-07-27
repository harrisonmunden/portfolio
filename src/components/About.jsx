import React, { useState, useRef, useEffect, useCallback } from "react";
import "./styles/about.css";
import { motion } from 'framer-motion';

const aboutHeaders = {
  Tesla: '/src/assets/AboutAssets/About/TeslaAboutHeader.png',
  Ford: '/src/assets/AboutAssets/About/FordAboutHeader.png',
  DFR: '/src/assets/AboutAssets/About/DFRAboutHeader.png',
};
const bulletImg = '/src/assets/AboutAssets/About/Bullet.png';
const chevronImg = '/src/assets/GlassyObjects/About/Chevron.png';
const computerSelfieImg = '/src/assets/AboutAssets/ComputerSelfe-450x600-q92.webp';

const BATCH_SIZE = 1;
let globalVisibleCount = BATCH_SIZE;

const About = ({ goTo, hideAboutNav }) => {
  const experiences = [
    {
      id: 1,
      title: "3D UI Developer",
      company: "Tesla",
      headerImg: aboutHeaders.Tesla,
      description: [
        "Lead 3D design and engineering for all Tesla charging, energy, and mobile app. Frequently was doing like 3D modeling and shader scripting as well as like",
        "Lead 3D design and engineering for all Tesla charging, energy, and mobile app. Frequently was doing like 3D modeling and shader scripting as well as like",
        "Lead 3D design and engineering for all Tesla charging, energy, and mobile app. Frequently was doing like 3D modeling and shader scripting as well as like"
      ]
    },
    {
      id: 2,
      title: "HMI Design Intern",
      company: "Ford",
      headerImg: aboutHeaders.Ford,
      description: [
        "Lead 3D design and engineering for all Tesla charging, energy, and mobile app. Frequently was doing like 3D modeling and shader scripting as well as like",
        "Lead 3D design and engineering for all Tesla charging, energy, and mobile app. Frequently was doing like 3D modeling and shader scripting as well as like",
        "Lead 3D design and engineering for all Tesla charging, energy, and mobile app. Frequently was doing like 3D modeling and shader scripting as well as like"
      ]
    },
    {
      id: 3,
      title: "Body Designer",
      company: "Dartmouth Formula Racing",
      headerImg: aboutHeaders.DFR,
      description: [
        "Lead 3D design and engineering for all Tesla charging, energy, and mobile app. Frequently was doing like 3D modeling and shader scripting as well as like",
        "Lead 3D design and engineering for all Tesla charging, energy, and mobile app. Frequently was doing like 3D modeling and shader scripting as well as like",
        "Lead 3D design and engineering for all Tesla charging, energy, and mobile app. Frequently was doing like 3D modeling and shader scripting as well as like"
      ]
    }
  ];

  const [visibleCount, setVisibleCount] = useState(globalVisibleCount);
  const sentinelRef = useRef();

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
        {!hideAboutNav && (
          <motion.h1 className="about-title" layoutId="about-nav" style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: goTo ? 'pointer' : 'default'}} onClick={() => goTo && goTo('home')}>
            <span>about</span>
            <motion.img src={chevronImg} alt="chevron" className="chevron-img" layoutId="about-chevron" />
          </motion.h1>
        )}
      </div>

      {/* Photo Section */}
      <div className="about-photo-section">
        <div className="about-intro-section">
          <h2 className="about-intro-title">Hi, I'm Harrison</h2>
          <p className="about-intro-text">
            I'm a 3D UI Developer and designer passionate about creating immersive digital experiences. 
            With expertise in 3D modeling, shader scripting, and interactive design, I bridge the gap 
            between technology and creativity. Currently working at Tesla, where I  work on3D design 
            and engineering for charging, energy, and mobile applications.
          </p>
        </div>
        <div className="about-photo-container">
          <div className="photo-container">
            <img 
              src={computerSelfieImg} 
              alt="Computer selfie" 
              className="about-photo"
              loading="lazy"
              srcSet={`
                /src/assets/AboutAssets/ComputerSelfe-200x260-q92.webp 200w,
                /src/assets/AboutAssets/ComputerSelfe-350x450-q92.webp 350w,
                /src/assets/AboutAssets/ComputerSelfe-450x600-q92.webp 450w
              `}
              sizes="(max-width: 600px) 200px, (max-width: 900px) 350px, 450px"
            />
          </div>
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

export default About;
