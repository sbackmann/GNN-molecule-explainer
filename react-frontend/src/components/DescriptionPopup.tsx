import React, { useState, useEffect, useRef } from 'react';
import { BsInfoCircle } from 'react-icons/bs';
import './DescriptionPopup.css';

interface DescriptionPopupProps {
  description: string;
}

const DescriptionPopup: React.FC<DescriptionPopupProps> = ({ description }) => {
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      setShowPopup(false);
    }
  };

  useEffect(() => {
    if (showPopup) {
      window.addEventListener('click', handleClickOutside);
    }

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [showPopup]);

  return (
    <div style={{ position: 'relative' }}>
      <BsInfoCircle className="info-icon" onClick={togglePopup} />
      {showPopup && (
        <div className="description-popup" ref={popupRef}>
          <p>{description}</p>
        </div>
      )}
    </div>
  );
};

export default DescriptionPopup;
