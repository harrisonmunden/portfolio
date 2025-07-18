import React from "react";
import "./styles/about.css";

const aboutHeaders = {
  Tesla: '/src/assets/AboutAssets/About/TeslaAboutHeader.png',
  Ford: '/src/assets/AboutAssets/About/FordAboutHeader.png',
  DFR: '/src/assets/AboutAssets/About/DFRAboutHeader.png',
};
const bulletImg = '/src/assets/AboutAssets/About/Bullet.png';

const About = () => {
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

  return (
    <div className="about-container">
      {/* Header */}
      <div className="about-header">
        <h1 className="about-title">About</h1>
      </div>

      {/* Experience Timeline */}
      <div className="experience-timeline">
        {experiences.map((experience) => (
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
        ))}
      </div>
    </div>
  );
};

export default About;
