import React from 'react';
import backhoe from '../assets/backhoe.png'; // Import the image
import './styles/home.css';

const Home = () => {
  return (
    <div
      className="home-page"
      style={{
        backgroundImage: `url(${backhoe})`, // Dynamically set the background image
      }}
    >
      <h1 className="construction-title">
        Under Construction<span className="dots"></span>
      </h1>
      <div className="buttons-container">
        <a
          href="https://www.linkedin.com/in/harrisonmunden/"
          target="_blank"
          rel="noopener noreferrer"
          className="button"
        >
          LinkedIn
        </a>
        <a
          href="https://www.instagram.com/harrisonmundenart"
          target="_blank"
          rel="noopener noreferrer"
          className="button"
        >
          Instagram
        </a>
        <a href="mailto:harrison.munden@gmail.com" className="button">
          Email Me
        </a>
      </div>
    </div>
  );
};

export default Home;
