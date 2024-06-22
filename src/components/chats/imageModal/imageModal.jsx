import React from 'react';
import './imageModal.css';

const ImageModal = ({ imgSrc, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <img src={imgSrc} alt="Zoomed" />
      </div>
    </div>
  );
};

export default ImageModal;
