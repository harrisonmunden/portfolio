import React, { useState } from 'react';
import './Works.css'; // For custom styling

const videoGames = [
	{ id: 1, src: '/src/assets/3DArtwork/BusyGirlCover.png', alt: 'Escape Game', border: 'blue' },
	{ id: 2, src: '/src/assets/3DArtwork/Flower.png', alt: 'Flower Game', border: 'yellow' },
	{ id: 3, src: '/src/assets/3DArtwork/HerProfilePhoto.png', alt: 'Bossy Girl', border: 'pink' },
];

const artwork = [
	{ id: 1, src: '/src/assets/3DArtwork/AppleTree.png', alt: 'Apple Tree', title: 'Apple Tree', year: '2023' },
	{ id: 2, src: '/src/assets/3DArtwork/BusyGirlCover.png', alt: 'Busy Girl Cover', title: 'Busy Girl Cover', year: '2023' },
	{ id: 3, src: '/src/assets/3DArtwork/Chess4 copy.png', alt: 'Chess 4', title: 'Chess 4', year: '2023' },
	{ id: 4, src: '/src/assets/3DArtwork/Chess5 copy.png', alt: 'Chess 5', title: 'Chess 5', year: '2023' },
	{ id: 5, src: '/src/assets/3DArtwork/Computer4 copy.png', alt: 'Computer 4', title: 'Computer 4', year: '2023' },
	{ id: 6, src: '/src/assets/3DArtwork/Crown.png', alt: 'Crown', title: 'Crown', year: '2023' },
	{ id: 7, src: '/src/assets/3DArtwork/Falcon.png', alt: 'Falcon', title: 'Falcon', year: '2023' },
	{ id: 8, src: '/src/assets/3DArtwork/feathers3 copy.png', alt: 'Feathers 3', title: 'Feathers 3', year: '2023' },
	{ id: 9, src: '/src/assets/3DArtwork/Flower.png', alt: 'Flower', title: 'Flower', year: '2023' },
	{ id: 10, src: '/src/assets/3DArtwork/GoldenHill.png', alt: 'Golden Hill', title: 'Golden Hill', year: '2023' },
	{ id: 11, src: '/src/assets/3DArtwork/Grass.png', alt: 'Grass', title: 'Grass', year: '2023' },
	{ id: 12, src: '/src/assets/3DArtwork/H6.png', alt: 'H6', title: 'H6', year: '2023' },
	{ id: 13, src: '/src/assets/3DArtwork/hawk.png', alt: 'Hawk', title: 'Hawk', year: '2023' },
	{ id: 14, src: '/src/assets/3DArtwork/HerProfilePhoto.png', alt: 'Her Profile Photo', title: 'Her Profile Photo', year: '2023' },
	{ id: 15, src: '/src/assets/3DArtwork/Hfinal.png', alt: 'Hfinal', title: 'Hfinal', year: '2023' },
	{ id: 16, src: '/src/assets/3DArtwork/JulipCD.png', alt: 'Julip CD', title: 'Julip CD', year: '2023' },
	{ id: 17, src: '/src/assets/3DArtwork/MODELWALK.png', alt: 'Model Walk', title: 'Model Walk', year: '2023' },
	{ id: 18, src: '/src/assets/3DArtwork/PeacockSide.png', alt: 'Peacock Side', title: 'Peacock Side', year: '2023' },
	{ id: 19, src: '/src/assets/3DArtwork/PrayingMantis.png', alt: 'Praying Mantis', title: 'Praying Mantis', year: '2023' },
	{ id: 20, src: '/src/assets/3DArtwork/profile.png', alt: 'Profile', title: 'Profile', year: '2023' },
	{ id: 21, src: '/src/assets/3DArtwork/ROCKET.png', alt: 'Rocket', title: 'Rocket', year: '2023' },
	{ id: 22, src: '/src/assets/3DArtwork/ROCKETLAVALAMP.png', alt: 'Rocket Lava Lamp', title: 'Rocket Lava Lamp', year: '2023' },
	{ id: 23, src: '/src/assets/3DArtwork/Squid.png', alt: 'Squid', title: 'Squid', year: '2023' },
	{ id: 24, src: '/src/assets/3DArtwork/starcanvas.png', alt: 'Star Canvas', title: 'Star Canvas', year: '2023' },
	{ id: 25, src: '/src/assets/3DArtwork/Tiger.png', alt: 'Tiger', title: 'Tiger', year: '2023' },
	{ id: 26, src: '/src/assets/3DArtwork/Trees.png', alt: 'Trees', title: 'Trees', year: '2023' },
	{ id: 27, src: '/src/assets/3DArtwork/Vases.png', alt: 'Vases', title: 'Vases', year: '2023' },
	{ id: 28, src: '/src/assets/3DArtwork/WormSong.png', alt: 'Worm Song', title: 'Worm Song', year: '2023' },
];

const Works = () => {
	const [selectedImage, setSelectedImage] = useState(null);
	const [lightboxActive, setLightboxActive] = useState(false);
	const [hoveredImageId, setHoveredImageId] = useState(null);

	const openImage = (image) => {
		setSelectedImage(image);
		setLightboxActive(true);
	};

	const closeImage = () => {
		setLightboxActive(false);
		setTimeout(() => setSelectedImage(null), 300); // Wait for transition to complete
	};

	const handleImageMouseMove = (event, imageId) => {
		const rect = event.currentTarget.getBoundingClientRect();
		const centerX = rect.width / 2;
		const centerY = rect.height / 2;
		const mouseX = event.clientX - rect.left;
		const mouseY = event.clientY - rect.top;
		
		// Check if cursor is within 30px of the center
		const distanceFromCenter = Math.sqrt(
			Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2)
		);
		
		if (distanceFromCenter <= 125) {
			setHoveredImageId(imageId);
		} else {
			setHoveredImageId(null);
		}
	};

	const handleImageLeave = () => {
		setHoveredImageId(null);
	};

	return (
		<div className="works-page">
			{/* Header */}
			<div className="works-header">
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
				{artwork.map((img) => (
					<div 
						key={img.id} 
						className={`artwork-card ${hoveredImageId && hoveredImageId !== img.id ? 'dimmed' : ''} ${hoveredImageId === img.id ? 'hovered' : ''}`}
						onMouseMove={(e) => handleImageMouseMove(e, img.id)}
						onMouseLeave={handleImageLeave}
					>
						<img
							src={img.src}
							alt={img.alt}
							className="artwork-img"
							onClick={() => openImage(img)}
						/>
					</div>
				))}
			</div>

			{/* Enhanced Lightbox */}
			{selectedImage && (
				<div className={`lightbox ${lightboxActive ? 'active' : ''}`} onClick={closeImage}>
					<span className="close" onClick={closeImage}>&times;</span>
					<div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
						<img
							src={selectedImage.src}
							alt={selectedImage.alt}
							className="lightbox-image"
						/>
						<div className="lightbox-text">
							<h2 className="lightbox-title">{selectedImage.title}</h2>
							<p className="lightbox-year">{selectedImage.year}</p>
							<p className="lightbox-description">
								This piece showcases the artist's unique perspective on digital art and 3D modeling techniques.
							</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Works;