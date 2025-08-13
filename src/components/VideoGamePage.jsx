import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useScrollToTop } from '../hooks/useScrollToTop';
import './VideoGamePage.css';

// Move gameData outside component to prevent recreation on every render
const gameData = {
  'busy-girl': {
    title: 'Busy Girl',
    description: 'An engaging escape game where players navigate through challenging puzzles and obstacles.',
    coverImage: '/VideoGameAssets/BusyGirlCover-page-cover.webp',
    year: '2023',
    genre: 'Puzzle/Adventure',
    technologies: ['Unity', 'C#', 'Blender'],
    features: [
      'Multiple puzzle mechanics',
      'Immersive 3D environments',
      'Progressive difficulty system',
      'Interactive storytelling'
    ]
  },
  'maestro': {
    title: 'Maestro!',
    description: 'A musical rhythm game that challenges players to master various instruments and compositions.',
    coverImage: '/VideoGameAssets/MaestroCover-page-cover.webp',
    year: '2023',
    genre: 'Rhythm/Music',
    technologies: ['Unity', 'C#', 'FMOD'],
    features: [
      'Multiple instrument modes',
      'Dynamic difficulty adjustment',
      'Original soundtrack',
      'Multiplayer support'
    ]
  },
  'paparazzi-escape': {
    title: 'Paparazzi Escape',
    description: 'A thrilling stealth game where players must escape from relentless paparazzi while maintaining their privacy.',
    coverImage: '/VideoGameAssets/PaparazziEscapeCover-page-cover.webp',
    year: '2023',
    genre: 'Stealth/Action',
    technologies: ['Unity', 'C#', 'NavMesh AI'],
    features: [
      'Advanced AI behavior',
      'Multiple escape routes',
      'Stealth mechanics',
      'Dynamic environment'
    ]
  }
};

const VideoGamePage = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  
  // Use custom scroll restoration hook
  useScrollToTop();

  const game = gameData[gameId];

  if (!game) {
    return (
      <div className="video-game-page">
        <div className="game-not-found">
          <h1>Game Not Found</h1>
          <button onClick={() => navigate('/work')} className="back-button">
            Back to Work
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="video-game-page">
      <div className="video-game-header">
        <button 
          onClick={() => navigate('/work')} 
          className="back-button"
        >
          ← Back to Work
        </button>
        <h1 className="game-title">{game.title}</h1>
      </div>

      <div className="video-game-content">
        <div className="game-cover-section">
          <img 
            src={game.coverImage} 
            alt={`${game.title} Cover`} 
            className="game-cover-image"
            loading="eager"
            decoding="async"
          />
          <div className="game-info">
            <div className="game-meta">
              <span className="game-year">{game.year}</span>
              <span className="game-genre">{game.genre}</span>
            </div>
            <p className="game-description">{game.description}</p>
          </div>
        </div>

        <div className="game-details">
          <div className="technologies-section">
            <h3>Technologies Used</h3>
            <div className="tech-tags">
              {game.technologies.map((tech, index) => (
                <span key={index} className="tech-tag">{tech}</span>
              ))}
            </div>
          </div>

          <div className="features-section">
            <h3>Key Features</h3>
            <ul className="features-list">
              {game.features.map((feature, index) => (
                <li key={index} className="feature-item">{feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoGamePage; 