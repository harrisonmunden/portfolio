import React, { useState } from 'react';
import './Works.css'; // For custom styling

const worksData = [
  {
    label: 'Project 1',
    images: [
      { id: 1, src: 'Jelly1.jpg', alt: 'Project 1 - Image 1' },
      { id: 2, src: 'image2.jpg', alt: 'Project 1 - Image 2' },
    ],
  },
  {
    label: 'Project 2',
    images: [
      { id: 3, src: 'image3.jpg', alt: 'Project 2 - Image 1' },
      { id: 4, src: 'image4.jpg', alt: 'Project 2 - Image 2' },
    ],
  },
  // Add more projects here
];

const Works = () => {
  console.log('Works component is rendered');
  const [selectedImage, setSelectedImage] = useState(null);

  const openImage = (image) => {
    setSelectedImage(image);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  return (
    <div className="works-page">
      {worksData.map((work, index) => (
        <div key={index} className="work-group">
          <h2>{work.label}</h2>
          <div className="work-images">
            {work.images.map((image) => (
              <img
                key={image.id}
                src={image.src}
                alt={image.alt}
                className="work-thumbnail"
                onClick={() => openImage(image)}
              />
            ))}
          </div>
        </div>
      ))}

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