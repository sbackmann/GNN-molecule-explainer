import React, { useState } from 'react';
import './Slider.css';

interface SliderProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({ min, max, step, value, onChange }) => {
  const [sliderValue, setSliderValue] = useState(value);

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value);
    setSliderValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="slider-container">
      <input
        type="range"
        className="slider"
        min={min}
        max={max}
        step={step}
        value={sliderValue}
        onChange={handleSliderChange}
      />
      <div className="slider-value">{sliderValue}</div>
    </div>
  );
};

export default Slider;
