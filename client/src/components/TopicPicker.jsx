import React from 'react';
import HeroSection from './HeroSection';

export default function TopicPicker({ onStart }) {
  return (
    <div className="app-card landing-page">
      <HeroSection onStart={onStart} />
    </div>
  );
}
