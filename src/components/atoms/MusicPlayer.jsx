import React, { useState, useEffect, useRef } from 'react';

const MusicPlayer = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  useEffect(() => {
    // Check localStorage for saved state
    const savedState = localStorage.getItem('musicPlayerState');
    if (savedState) {
      const { playing } = JSON.parse(savedState);
      setIsPlaying(playing);
      
      // If it should be playing, start the audio
      if (playing && audioRef.current) {
        // Set volume to 15%
        audioRef.current.volume = 0.15;
        audioRef.current.play().catch(error => {
          console.error('Auto-play was prevented:', error);
          setIsPlaying(false);
          saveState(false);
        });
      }
    }
    
    // Set initial volume to 15%
    if (audioRef.current) {
      audioRef.current.volume = 0.15;
    }
  }, []);
  
  // Save state to localStorage
  const saveState = (playing) => {
    localStorage.setItem('musicPlayerState', JSON.stringify({ playing }));
  };
  
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // Ensure volume is set to 15% when playing
        audioRef.current.volume = 0.15;
        audioRef.current.play().catch(error => {
          console.error('Play was prevented:', error);
        });
      }
      
      const newPlayingState = !isPlaying;
      setIsPlaying(newPlayingState);
      saveState(newPlayingState);
    }
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <audio 
        ref={audioRef} 
        src="/music.mp3" 
        loop 
        muted={!isPlaying} // Muted when not playing
      />
      <button 
        onClick={togglePlay}
        className="bg-black hover:bg-gray-800 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
      >
        {isPlaying ? (
          // Pause icon
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : (
          // Play icon
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default MusicPlayer;