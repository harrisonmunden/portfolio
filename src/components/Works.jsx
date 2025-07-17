import React, { useState } from 'react';
import './Works.css'; // For custom styling

const videoGames = [
	{ id: 1, src: '/src/assets/3DArtwork/BusyGirlCover.png', alt: 'Escape Game', border: 'blue' },
	{ id: 2, src: '/src/assets/3DArtwork/', alt: 'Flower Game', border: 'yellow' },
	{ id: 3, src: '/src/assets/3DArtwork/', alt: 'Bossy Girl', border: 'pink' },
];

const artwork = [
	{ id: 1, src: '/src/assets/3DArtwork/AppleTree.png', alt: 'Apple Tree' },
	{ id: 2, src: '/src/assets/3DArtwork/BusyGirlCover.png', alt: 'Busy Girl Cover' },
	{ id: 3, src: '/src/assets/3DArtwork/Chess4 copy.png', alt: 'Chess 4' },
	{ id: 4, src: '/src/assets/3DArtwork/Chess5 copy.png', alt: 'Chess 5' },
	{ id: 5, src: '/src/assets/3DArtwork/Computer4 copy.png', alt: 'Computer 4' },
	{ id: 6, src: '/src/assets/3DArtwork/Crown.png', alt: 'Crown' },
	{ id: 7, src: '/src/assets/3DArtwork/Falcon.png', alt: 'Falcon' },
	{ id: 8, src: '/src/assets/3DArtwork/feathers3 copy.png', alt: 'Feathers 3' },
	{ id: 9, src: '/src/assets/3DArtwork/Flower.png', alt: 'Flower' },
	{ id: 10, src: '/src/assets/3DArtwork/GoldenHill.png', alt: 'Golden Hill' },
	{ id: 11, src: '/src/assets/3DArtwork/Grass.png', alt: 'Grass' },
	{ id: 12, src: '/src/assets/3DArtwork/H6.png', alt: 'H6' },
	{ id: 13, src: '/src/assets/3DArtwork/hawk.png', alt: 'Hawk' },
	{ id: 14, src: '/src/assets/3DArtwork/HerProfilePhoto.png', alt: 'Her Profile Photo' },
	{ id: 15, src: '/src/assets/3DArtwork/Hfinal.png', alt: 'Hfinal' },
	{ id: 16, src: '/src/assets/3DArtwork/JulipCD.png', alt: 'Julip CD' },
	{ id: 17, src: '/src/assets/3DArtwork/MODELWALK.png', alt: 'Model Walk' },
	{ id: 18, src: '/src/assets/3DArtwork/PeacockSide.png', alt: 'Peacock Side' },
	{ id: 19, src: '/src/assets/3DArtwork/PrayingMantis.png', alt: 'Praying Mantis' },
	{ id: 20, src: '/src/assets/3DArtwork/profile.png', alt: 'Profile' },
	{ id: 21, src: '/src/assets/3DArtwork/ROCKET.png', alt: 'Rocket' },
	{ id: 22, src: '/src/assets/3DArtwork/ROCKETLAVALAMP.png', alt: 'Rocket Lava Lamp' },
	{ id: 23, src: '/src/assets/3DArtwork/Squid.png', alt: 'Squid' },
	{ id: 24, src: '/src/assets/3DArtwork/starcanvas.png', alt: 'Star Canvas' },
	{ id: 25, src: '/src/assets/3DArtwork/Tiger.png', alt: 'Tiger' },
	{ id: 26, src: '/src/assets/3DArtwork/Trees.png', alt: 'Trees' },
	{ id: 27, src: '/src/assets/3DArtwork/Vases.png', alt: 'Vases' },
	{ id: 28, src: '/src/assets/3DArtwork/WormSong.png', alt: 'Worm Song' },
];

const randomSizeClasses = [
  'artwork-size1', 'artwork-size2', 'artwork-size3',
  'artwork-size4', 'artwork-size5', 'artwork-size6'
];

const Works = () => {
	const [selectedImage, setSelectedImage] = useState(null);

	// Assign a random size class to each artwork image for a more artistic layout
	const artworkWithSizes = artwork.map((img, idx) => ({
		...img,
		sizeClass: randomSizeClasses[Math.floor(Math.random() * randomSizeClasses.length)],
	}));

	const openImage = (image) => setSelectedImage(image);
	const closeImage = () => setSelectedImage(null);

	return (
		<div className="works-page">
			{/* Decorative Circles and Title */}
			<div className="works-header">
				<div className="works-circles">
					{[...Array(15)].map((_, i) => (
						<span key={i} className="circle" />
					))}
				</div>
				<h1 className="works-main-title">Work</h1>
			</div>

			{/* Video Games Section */}
			<h2 className="section-title video-games-title">Video Games</h2>
			<div className="video-games-row">
				{videoGames.map((img) => (
					<div key={img.id} className={`video-game-card border-${img.border}`}>
						<img
							src={img.src}
							alt={img.alt}
							className="video-game-img"
							onClick={() => openImage(img)}
						/>
					</div>
				))}
			</div>

			{/* 3D Artwork Section */}
			<h2 className="section-title artwork-title">3D Artwork</h2>
			<div className="artwork-grid">
				{artworkWithSizes.map((img) => (
					<div key={img.id} className={`artwork-card ${img.sizeClass}`}>
						<img
							src={img.src}
							alt={img.alt}
							className="artwork-img"
							onClick={() => openImage(img)}
						/>
					</div>
				))}
			</div>

			{/* Lightbox */}
			{selectedImage && (
				<div className="lightbox" onClick={closeImage}>
					<span className="close">&times;</span>
					<img
						src={selectedImage.src}
						alt={selectedImage.alt}
						className="enlarged-image"
					/>
				</div>
			)}
		</div>
	);
};

export default Works;