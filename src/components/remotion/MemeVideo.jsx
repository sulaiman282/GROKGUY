import React from 'react';
import { AbsoluteFill, Audio, Img, useCurrentFrame, useVideoConfig, Sequence } from 'remotion';

const MemeVideo = ({ backgroundImage, logoImage, logoPosition, logoScale }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  
  // Simple fade in animation for the logo
  const opacity = Math.min(1, frame / (fps * 0.5)); // Fade in over 0.5 seconds
  
  return (
    <AbsoluteFill style={{ backgroundColor: 'white' }}>
      {/* Background image */}
      <Img 
        src={backgroundImage} 
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'contain'
        }} 
      />
      
      {/* Logo with animation */}
      <Sequence from={fps * 0.5}>
        <Img 
          src={logoImage} 
          style={{
            position: 'absolute',
            left: logoPosition.x,
            top: logoPosition.y,
            width: `${logoScale * 100}%`,
            opacity
          }} 
        />
      </Sequence>
      
      {/* Background music */}
      <Audio src="/background.mp3" />
    </AbsoluteFill>
  );
};

export default MemeVideo;
