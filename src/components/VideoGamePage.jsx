import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useScrollToTop } from '../hooks/useScrollToTop';
import './VideoGamePage.css';

// Move gameData outside component to prevent recreation on every render
const gameData = {
  'busy-girl': {
    title: 'Busy Girl',
    description: 'An engaging escape game where players navigate through challenging puzzles and obstacles.',
    coverImage: '/VideoGameAssets/BusyGirlCover-compressed.webp',
    year: '2023',
    genre: 'Puzzle/Adventure',
    technologies: ['Unity', 'C#', 'Blender'],
    features: [
      'Multiple puzzle mechanics',
      'Immersive 3D environments',
      'Progressive difficulty system',
      'Interactive storytelling'
    ],
    assets: {
      showcase: [
        { type: 'video', src: '/VideoGameAssets/BusyGirlPage/ShowCaseVideo.mp4', alt: 'Busy Girl Showcase Video' }
      ],
      cityShots: [
        { src: '/VideoGameAssets/BusyGirlPage/CityShot1-compressed.jpg', alt: 'City Shot 1' },
        { src: '/VideoGameAssets/BusyGirlPage/CityShot2-compressed.jpg', alt: 'City Shot 2' },
        { src: '/VideoGameAssets/BusyGirlPage/CityShot3-compressed.jpg', alt: 'City Shot 3' },
        { src: '/VideoGameAssets/BusyGirlPage/CityShot4-compressed.jpg', alt: 'City Shot 4' }
      ],
      accessories: [
        { src: '/VideoGameAssets/BusyGirlPage/BeltAd.png', alt: 'Belt Advertisement' },
        { src: '/VideoGameAssets/BusyGirlPage/PurseAd-compressed.jpg', alt: 'Purse Advertisement' },
        { src: '/VideoGameAssets/BusyGirlPage/Purse1 copy.jpg', alt: 'Purse Design 1' },
        { src: '/VideoGameAssets/BusyGirlPage/Purse2 copy.png', alt: 'Purse Design 2' },
        { src: '/VideoGameAssets/BusyGirlPage/Purse3 copy.jpg', alt: 'Purse Design 3' }
      ]
    }
  },
  'maestro': {
    title: 'Maestro!',
    description: 'A musical rhythm game that challenges players to master various instruments and compositions.',
    coverImage: '/VideoGameAssets/MaestroCover-compressed.webp',
    year: '2023',
    genre: 'Rhythm/Music',
    technologies: ['Unity', 'C#', 'FMOD'],
    features: [
      'Multiple instrument modes',
      'Dynamic difficulty adjustment',
      'Original soundtrack',
      'Multiplayer support'
    ],
    assets: {
      showcase: [
        { type: 'video', src: '/VideoGameAssets/MaestroPage/ShowcaseVideo.mp4', alt: 'Maestro Showcase Video' }
      ],
      techDemo: [
        { type: 'video', src: '/VideoGameAssets/MaestroPage/TechDemo1.mp4', alt: 'Maestro Tech Demo' }
      ],
      posters: [
        { src: '/VideoGameAssets/MaestroPage/MaestroPoster-compressed.jpg', alt: 'Maestro Poster' },
        { src: '/VideoGameAssets/MaestroPage/MaestroPoster2-compressed.jpg', alt: 'Maestro Poster 2' }
      ],
      flowers: [
        { src: '/VideoGameAssets/MaestroPage/Flower1.png', alt: 'Flower Design 1' },
        { src: '/VideoGameAssets/MaestroPage/Flower2.png', alt: 'Flower Design 2' },
        { src: '/VideoGameAssets/MaestroPage/Flower3.png', alt: 'Flower Design 3' }
      ],
      scenes: [
        { src: '/VideoGameAssets/MaestroPage/SceneShot.png', alt: 'Scene Shot' }
      ]
    }
  },
  'paparazzi-escape': {
    title: 'Paparazzi Escape',
    description: 'A thrilling stealth game where players must escape from relentless paparazzi while maintaining their privacy.',
    coverImage: '/VideoGameAssets/PaparazziEscapeCover-compressed.webp',
    year: '2023',
    genre: 'Stealth/Action',
    technologies: ['Unity', 'C#', 'NavMesh AI'],
    features: [
      'Advanced AI behavior',
      'Multiple escape routes',
      'Stealth mechanics',
      'Dynamic environment'
    ],
    assets: {
      showcase: [
        { type: 'video', src: '/VideoGameAssets/PaparazziEscapePage/Showcase1.mp4', alt: 'Paparazzi Escape Showcase 1' },
        { type: 'video', src: '/VideoGameAssets/PaparazziEscapePage/Showcase2.mp4', alt: 'Paparazzi Escape Showcase 2' },
        { type: 'video', src: '/VideoGameAssets/PaparazziEscapePage/Showcase3.mp4', alt: 'Paparazzi Escape Showcase 3' }
      ],
      intro: [
        { type: 'video', src: '/VideoGameAssets/PaparazziEscapePage/CelebrityIntro.mp4', alt: 'Celebrity Introduction' }
      ],
      carVideos: [
        { type: 'video', src: '/VideoGameAssets/PaparazziEscapePage/PapCarVid.mov', alt: 'Paparazzi Car Video', videoType: 'video/quicktime' }
      ],
      environmentAndCharacters: [
        { src: '/VideoGameAssets/PaparazziEscapePage/PaparazziEscapePoster-compressed.jpg', alt: 'Paparazzi Escape Poster' },
        { src: '/VideoGameAssets/PaparazziEscapePage/PaparazziEscapePoster2-compressed.jpg', alt: 'Paparazzi Escape Poster 2' },
        { src: '/VideoGameAssets/PaparazziEscapePage/City1.png', alt: 'City View 1' },
        { src: '/VideoGameAssets/PaparazziEscapePage/City2.jpg', alt: 'City View 2' },
        { src: '/VideoGameAssets/PaparazziEscapePage/City3.jpg', alt: 'City View 3' },
        { src: '/VideoGameAssets/PaparazziEscapePage/City4.jpg', alt: 'City View 4' },
        { src: '/VideoGameAssets/PaparazziEscapePage/EvilPap1.jpg', alt: 'Paparazzi Character 1' },
        { src: '/VideoGameAssets/PaparazziEscapePage/EvilPap2.jpg', alt: 'Paparazzi Character 2' },
        { src: '/VideoGameAssets/PaparazziEscapePage/EvilPap3.png', alt: 'Paparazzi Character 3' },
        { src: '/VideoGameAssets/PaparazziEscapePage/Celebrity1.png', alt: 'Celebrity Character' }
      ],
      vehiclesAndAccessories: [
        { src: '/VideoGameAssets/PaparazziEscapePage/papCar1.jpeg', alt: 'Paparazzi Car 1' },
        { src: '/VideoGameAssets/PaparazziEscapePage/Papcar2.jpeg', alt: 'Paparazzi Car 2' },
        { src: '/VideoGameAssets/PaparazziEscapePage/Papcar3.jpeg', alt: 'Paparazzi Car 3' },
        { src: '/VideoGameAssets/PaparazziEscapePage/PapCar4.jpeg', alt: 'Paparazzi Car 4' },
        { src: '/VideoGameAssets/PaparazziEscapePage/papCarBest.jpeg', alt: 'Best Paparazzi Car Shot' },
        { src: '/VideoGameAssets/PaparazziEscapePage/Accessory1.png', alt: 'Accessory 1' },
        { src: '/VideoGameAssets/PaparazziEscapePage/Accessory2.jpg', alt: 'Accessory 2' },
        { src: '/VideoGameAssets/PaparazziEscapePage/Accessory3.png', alt: 'Accessory 3' },
        { src: '/VideoGameAssets/PaparazziEscapePage/Accessory4.png', alt: 'Accessory 4' }
      ]
    }
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

  const renderAsset = (asset, index) => {
    if (asset.type === 'video') {
      const videoType = asset.videoType || 'video/mp4';
      return (
        <div key={index} className="asset-item video-item">
          <video
            className="asset-video"
            controls
            preload="metadata"
          >
            <source src={asset.src} type={videoType} />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }
    
    return (
      <div key={index} className="asset-item image-item">
        <img
          src={asset.src}
          alt={asset.alt}
          className="asset-image"
          loading="lazy"
          decoding="async"
          onError={(e) => console.error('Image failed to load:', asset.src, e)}
          onLoad={() => console.log('Image loaded successfully:', asset.src)}
        />
      </div>
    );
  };

  const renderAssetSection = (title, assets, className = '') => {
    if (!assets || assets.length === 0) return null;
    
    return (
      <div className={`asset-section ${className}`}>
        <h3 className="section-title">{title}</h3>
        <div className="asset-grid">
          {assets.map((asset, index) => renderAsset(asset, index))}
        </div>
      </div>
    );
  };

  return (
    <div className="video-game-page">
      <div className="game-header">
        <div className="title-row">
          <button 
            onClick={() => navigate('/work')} 
            className="back-button"
          >
            <img src="/GlassyObjects/About/Chevron.png" alt="back" />
          </button>
          <h1 className="game-title">{game.title}</h1>
        </div>
        <div className="game-meta">
          <span className="game-year">{game.year}</span>
          <span className="game-genre">{game.genre}</span>
        </div>
        <p className="game-description">{game.description}</p>
      </div>

      {/* Asset Showcase Sections */}
      <div className="assets-showcase">
        {renderAssetSection('Showcase Videos', game.assets.showcase, 'showcase-videos')}
        {renderAssetSection('Tech Demo', game.assets.techDemo, 'tech-demo')}
        {renderAssetSection('Intro Videos', game.assets.intro, 'intro-videos')}
        {renderAssetSection('Car Videos', game.assets.carVideos, 'car-videos')}
        {renderAssetSection('Environment & Characters', game.assets.environmentAndCharacters, 'environment-characters')}
        {renderAssetSection('Vehicles & Accessories', game.assets.vehiclesAndAccessories, 'vehicles-accessories')}
        {renderAssetSection('City Shots', game.assets.cityShots, 'city-shots')}
        {renderAssetSection('Accessories', game.assets.accessories, 'accessories')}
        {renderAssetSection('Posters', game.assets.posters, 'posters')}
        {renderAssetSection('Flower Designs', game.assets.flowers, 'flower-designs')}
        {renderAssetSection('Scene Shots', game.assets.scenes, 'scene-shots')}
      </div>
    </div>
  );
};

export default VideoGamePage; 