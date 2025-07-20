import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

const ImageSlider = () => {
  const sliderRef = useRef(null);
  
  // Array of slider images from 1 to 14
  const sliderImages = Array.from({ length: 14 }, (_, i) => `/sliders/${i + 1}.jpeg`);
  
  // Duplicate the array to create the infinite loop effect
  const duplicatedImages = [...sliderImages, ...sliderImages];
  
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    
    let animationId;
    let position = 0;
    
    const animate = () => {
      position -= 0.5; // Adjust speed here
      
      // Reset position when we've scrolled through the first set of images
      const imageWidth = window.innerWidth < 768 ? 200 : 250;
      const resetPoint = -(sliderImages.length * imageWidth);
      
      if (position <= resetPoint) {
        position = 0;
      }
      
      slider.style.transform = `translateX(${position}px)`;
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    // Handle window resize
    const handleResize = () => {
      // Reset position on resize to prevent visual glitches
      position = 0;
      slider.style.transform = `translateX(${position}px)`;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [sliderImages.length]);
  
  return (
    <section className="w-full overflow-hidden  ">
      
      <div className="relative w-full overflow-hidden">
        <div 
          ref={sliderRef}
          className="flex whitespace-nowrap"
          style={{ willChange: 'transform' }}
        >
          {duplicatedImages.map((src, index) => (
            <div 
              key={`${src}-${index}`} 
              className="inline-block px-2"
            >
              <div className="w-[200px] h-[200px] md:w-[250px] md:h-[250px] relative">
                <Image
                  src={src}
                  alt={`Slider image ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 200px, 250px"
                  priority={index < 5} // Load first 5 images with priority
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImageSlider;