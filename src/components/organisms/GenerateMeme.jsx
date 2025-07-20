import React, { useState, useRef, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import Replicate from 'replicate';

const GenerateMeme = () => {
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [logoPosition, setLogoPosition] = useState({ x: 0, y: 0 });
  const [logoScale, setLogoScale] = useState(1); // Scale factor for the logo
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [canvasStyle, setCanvasStyle] = useState({}); // For responsive preview
  const [maxLogoSliderValue, setMaxLogoSliderValue] = useState(2); // Default max scale
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mergedImage, setMergedImage] = useState(null); // To store the merged image
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const logoRef = useRef(null);

  const generateWithAI = async () => {
    try {
      setIsGeneratingAI(true);
      toast.loading('Generating image with AI...');
      
      const replicate = new Replicate({
        auth: process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN,
      });

      const prompt = "PeaceGuy, the white bear-like figure in a hoodie with a calm, confident expression. Generate a square image showing him in a unique, imaginative scene where he's spreading peace, resisting war, helping others, or symbolizing unity. The setting should reflect action, emotion, or symbolism without using any country flags or specific national references. Make the scene meaningful and powerful, but always peaceful in tone. Maintain the original style and expression of the character";
      
      const output = await replicate.run(
        "stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
        {
          input: {
            prompt: prompt,
            width: 1024,
            height: 1024,
            num_outputs: 1,
            guidance_scale: 7.5,
            num_inference_steps: 50,
          }
        }
      );

      if (output && output[0]) {
        // Create a new image to check dimensions and load it
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          setBackgroundImage(img.src);
          toast.success('AI image generated successfully!');
        };
        img.src = output[0];
      } else {
        throw new Error('Failed to generate image');
      }
    } catch (error) {
      console.error('Error generating AI image:', error);
      toast.error('Failed to generate AI image. Please try again.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Helper to convert screen coordinates to canvas coordinates
  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 }; // Return default if canvas is null

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    // Handle both mouse and touch events
    const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    return { x, y };
  };

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageRef.current || !logoRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear the entire canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (backgroundImage && imageRef.current.complete) {
      // Draw background image to fill the entire canvas
      ctx.drawImage(
        imageRef.current,
        0, 0, imageRef.current.naturalWidth, imageRef.current.naturalHeight,
        0, 0, canvas.width, canvas.height
      );
    }

    // Draw logo based on scale
    const scaledLogoWidth = logoRef.current.naturalWidth * logoScale;
    const scaledLogoHeight = logoRef.current.naturalHeight * logoScale;

    if (logoRef.current.complete) {
      ctx.drawImage(
        logoRef.current,
        logoPosition.x,
        logoPosition.y,
        scaledLogoWidth,
        scaledLogoHeight
      );
    }

    // Always draw resize handles, not just when dragging or resizing
    if (backgroundImage) {
      // Draw border around the logo
      ctx.strokeStyle = '#00AAFF';
      ctx.lineWidth = 2;
      ctx.strokeRect(
        logoPosition.x,
        logoPosition.y,
        scaledLogoWidth,
        scaledLogoHeight
      );

      // Draw resize handles (8 handles: corners and midpoints of each side)
      const handleSize = 8;
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#00AAFF';

      // Corner handles
      const handles = [
        { x: logoPosition.x, y: logoPosition.y, cursor: 'nwse-resize', type: 'nw' }, // top-left
        { x: logoPosition.x + scaledLogoWidth, y: logoPosition.y, cursor: 'nesw-resize', type: 'ne' }, // top-right
        { x: logoPosition.x, y: logoPosition.y + scaledLogoHeight, cursor: 'nesw-resize', type: 'sw' }, // bottom-left
        { x: logoPosition.x + scaledLogoWidth, y: logoPosition.y + scaledLogoHeight, cursor: 'nwse-resize', type: 'se' }, // bottom-right
        // Middle handles
        { x: logoPosition.x + scaledLogoWidth / 2, y: logoPosition.y, cursor: 'ns-resize', type: 'n' }, // top-middle
        { x: logoPosition.x + scaledLogoWidth, y: logoPosition.y + scaledLogoHeight / 2, cursor: 'ew-resize', type: 'e' }, // right-middle
        { x: logoPosition.x + scaledLogoWidth / 2, y: logoPosition.y + scaledLogoHeight, cursor: 'ns-resize', type: 's' }, // bottom-middle
        { x: logoPosition.x, y: logoPosition.y + scaledLogoHeight / 2, cursor: 'ew-resize', type: 'w' } // left-middle
      ];

      handles.forEach(handle => {
        ctx.beginPath();
        ctx.rect(handle.x - handleSize / 2, handle.y - handleSize / 2, handleSize, handleSize);
        ctx.fill();
        ctx.stroke();
      });
    }
  }, [backgroundImage, logoPosition, logoScale, isDragging, isResizing]);

  // Initialize Image objects only on the client-side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      imageRef.current = new Image();
      logoRef.current = new Image();
      logoRef.current.src = '/logo.png';
      // No drawCanvas() call here
    }
  }, []);

  // Effect to handle background image loading and canvas setup
  useEffect(() => {
    if (backgroundImage && imageRef.current && logoRef.current && canvasRef.current) {
      imageRef.current.src = backgroundImage;
      imageRef.current.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Set internal canvas resolution to original image size for drawing
        canvas.width = imageRef.current.naturalWidth;
        canvas.height = imageRef.current.naturalHeight;

        // Calculate CSS dimensions for responsive preview
        const originalWidth = imageRef.current.naturalWidth;
        const originalHeight = imageRef.current.naturalHeight;
        const maxPreviewWidth = 1000;
        const maxPreviewHeight = 1500;

        let previewWidth = originalWidth;
        let previewHeight = originalHeight;

        const aspectRatio = originalWidth / originalHeight;

        if (previewWidth > maxPreviewWidth) {
          previewWidth = maxPreviewWidth;
          previewHeight = previewWidth / aspectRatio;
        }

        if (previewHeight > maxPreviewHeight) {
          previewHeight = maxPreviewHeight;
          previewWidth = previewHeight * aspectRatio;
        }

        setCanvasStyle({
          width: `${previewWidth}px`,
          height: `${previewHeight}px`,
          maxWidth: '100%',
          display: 'block',
          height: 'auto',
        });

        // Only set initial logo position if it's the first load (x and y are 0)
        if (logoPosition.x === 0 && logoPosition.y === 0) {
          setLogoPosition({
            x: (canvas.width / 2) - (logoRef.current.naturalWidth * logoScale / 2),
            y: (canvas.height / 2) - (logoRef.current.naturalHeight * logoScale / 2),
          });
        }

        // Set max slider value for logo based on smaller dimension of background image
        const minBgDim = Math.min(imageRef.current.naturalWidth, imageRef.current.naturalHeight);
        const maxLogoDim = Math.max(logoRef.current.naturalWidth, logoRef.current.naturalHeight);
        setMaxLogoSliderValue(minBgDim / maxLogoDim);

        drawCanvas();
      };
    }
  }, [backgroundImage, drawCanvas]);

  // Effect to redraw canvas when logo position or scale changes
  useEffect(() => {
    if (backgroundImage && canvasRef.current && imageRef.current && logoRef.current) {
      drawCanvas();
    }
  }, [logoPosition, logoScale, drawCanvas]);

  // Helper to check if mouse is over a resize handle
  const getResizeHandle = (x, y) => {
    if (!logoRef.current) return null;
    
    const scaledLogoWidth = logoRef.current.naturalWidth * logoScale;
    const scaledLogoHeight = logoRef.current.naturalHeight * logoScale;
    const handleSize = 8;

    // Define all handles
    const handles = [
      { x: logoPosition.x, y: logoPosition.y, cursor: 'nwse-resize', type: 'nw' }, // top-left
      { x: logoPosition.x + scaledLogoWidth, y: logoPosition.y, cursor: 'nesw-resize', type: 'ne' }, // top-right
      { x: logoPosition.x, y: logoPosition.y + scaledLogoHeight, cursor: 'nesw-resize', type: 'sw' }, // bottom-left
      { x: logoPosition.x + scaledLogoWidth, y: logoPosition.y + scaledLogoHeight, cursor: 'nwse-resize', type: 'se' }, // bottom-right
      // Middle handles
      { x: logoPosition.x + scaledLogoWidth / 2, y: logoPosition.y, cursor: 'ns-resize', type: 'n' }, // top-middle
      { x: logoPosition.x + scaledLogoWidth, y: logoPosition.y + scaledLogoHeight / 2, cursor: 'ew-resize', type: 'e' }, // right-middle
      { x: logoPosition.x + scaledLogoWidth / 2, y: logoPosition.y + scaledLogoHeight, cursor: 'ns-resize', type: 's' }, // bottom-middle
      { x: logoPosition.x, y: logoPosition.y + scaledLogoHeight / 2, cursor: 'ew-resize', type: 'w' } // left-middle
    ];

    // Check if mouse is over any handle
    for (const handle of handles) {
      if (
        x >= handle.x - handleSize / 2 &&
        x <= handle.x + handleSize / 2 &&
        y >= handle.y - handleSize / 2 &&
        y <= handle.y + handleSize / 2
      ) {
        return handle;
      }
    }

    return null;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      // Create a temporary image to check dimensions
      const img = new Image();
      img.onload = () => {
        // Check if image meets minimum size requirements
        if (img.width < 500 || img.height < 500) {
          toast.error('Image must be at least 500x500 pixels');
          return;
        }
        
        // If image is valid, set it as background
        setBackgroundImage(img.src);
      };
      
      // Read the file as data URL
      const reader = new FileReader();
      reader.onload = (event) => {
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    } else if (file) {
      toast.error('Please select an image file.');
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleMouseDown = (e) => {
    const { x, y } = getCanvasCoordinates(e);

    // First check if clicking on a resize handle
    const handle = getResizeHandle(x, y);
    if (handle) {
      setIsResizing(true);
      setResizeHandle(handle.type);
      setDragOffset({ x, y });
      return;
    }

    // If not on a handle, check if clicking on the logo (using scaled dimensions)
    const scaledLogoWidth = logoRef.current.naturalWidth * logoScale;
    const scaledLogoHeight = logoRef.current.naturalHeight * logoScale;

    if (x > logoPosition.x && x < logoPosition.x + scaledLogoWidth &&
        y > logoPosition.y && y < logoPosition.y + scaledLogoHeight) {
      setIsDragging(true);
      setDragOffset({ x: x - logoPosition.x, y: y - logoPosition.y });
    }
  };

  const handleMouseMove = (e) => {
    const { x, y } = getCanvasCoordinates(e);
    const canvas = canvasRef.current;
    
    // Update cursor based on position
    if (!isDragging && !isResizing && canvas) {
      const handle = getResizeHandle(x, y);
      if (handle) {
        canvas.style.cursor = handle.cursor;
      } else {
        // Check if over the logo
        const scaledLogoWidth = logoRef.current.naturalWidth * logoScale;
        const scaledLogoHeight = logoRef.current.naturalHeight * logoScale;
        
        if (x > logoPosition.x && x < logoPosition.x + scaledLogoWidth &&
            y > logoPosition.y && y < logoPosition.y + scaledLogoHeight) {
          canvas.style.cursor = 'move';
        } else {
          canvas.style.cursor = 'default';
        }
      }
    }
    
    // Handle dragging the logo
    if (isDragging) {
      const newX = x - dragOffset.x;
      const newY = y - dragOffset.y;
      
      setLogoPosition({
        x: newX,
        y: newY,
      });
      return;
    }
    
    // Handle resizing the logo
    if (isResizing && logoRef.current) {
      const originalWidth = logoRef.current.naturalWidth;
      const originalHeight = logoRef.current.naturalHeight;
      const aspectRatio = originalWidth / originalHeight;
      
      // Calculate new dimensions based on which handle is being dragged
      let newWidth = logoRef.current.naturalWidth * logoScale;
      let newHeight = logoRef.current.naturalHeight * logoScale;
      let newX = logoPosition.x;
      let newY = logoPosition.y;
      
      const deltaX = x - dragOffset.x;
      const deltaY = y - dragOffset.y;
      
      switch (resizeHandle) {
        case 'se': // bottom-right
          newWidth = Math.max(20, newWidth + deltaX);
          newHeight = newWidth / aspectRatio;
          break;
        case 'sw': // bottom-left
          newWidth = Math.max(20, newWidth - deltaX);
          newHeight = newWidth / aspectRatio;
          newX = logoPosition.x + deltaX;
          break;
        case 'ne': // top-right
          newWidth = Math.max(20, newWidth + deltaX);
          newHeight = newWidth / aspectRatio;
          newY = logoPosition.y - (newHeight - (logoRef.current.naturalHeight * logoScale));
          break;
        case 'nw': // top-left
          newWidth = Math.max(20, newWidth - deltaX);
          newHeight = newWidth / aspectRatio;
          newX = logoPosition.x + deltaX;
          newY = logoPosition.y - (newHeight - (logoRef.current.naturalHeight * logoScale));
          break;
        case 'n': // top-middle
          newHeight = Math.max(20, newHeight - deltaY);
          newWidth = newHeight * aspectRatio;
          newX = logoPosition.x - (newWidth - (logoRef.current.naturalWidth * logoScale)) / 2;
          newY = logoPosition.y + deltaY;
          break;
        case 's': // bottom-middle
          newHeight = Math.max(20, newHeight + deltaY);
          newWidth = newHeight * aspectRatio;
          newX = logoPosition.x - (newWidth - (logoRef.current.naturalWidth * logoScale)) / 2;
          break;
        case 'e': // right-middle
          newWidth = Math.max(20, newWidth + deltaX);
          newHeight = newWidth / aspectRatio;
          newY = logoPosition.y - (newHeight - (logoRef.current.naturalHeight * logoScale)) / 2;
          break;
        case 'w': // left-middle
          newWidth = Math.max(20, newWidth - deltaX);
          newHeight = newWidth / aspectRatio;
          newX = logoPosition.x + deltaX;
          newY = logoPosition.y - (newHeight - (logoRef.current.naturalHeight * logoScale)) / 2;
          break;
      }
      
      // Update logo scale and position
      const newScale = newWidth / originalWidth;
      setLogoScale(newScale);
      setLogoPosition({ x: newX, y: newY });
      setDragOffset({ x, y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Create a temporary canvas to draw the background and logo without borders/handles
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Draw background image
    if (backgroundImage && imageRef.current && imageRef.current.complete) {
      tempCtx.drawImage(
        imageRef.current,
        0, 0, imageRef.current.naturalWidth, imageRef.current.naturalHeight,
        0, 0, tempCanvas.width, tempCanvas.height
      );
    }
    
    // Draw logo without borders or handles
    if (logoRef.current && logoRef.current.complete) {
      const scaledLogoWidth = logoRef.current.naturalWidth * logoScale;
      const scaledLogoHeight = logoRef.current.naturalHeight * logoScale;
      
      tempCtx.drawImage(
        logoRef.current,
        logoPosition.x,
        logoPosition.y,
        scaledLogoWidth,
        scaledLogoHeight
      );
    }
    
    // Create download link with the clean image
    const link = document.createElement('a');
    link.download = 'meme.png';
    link.href = tempCanvas.toDataURL('image/png');
    link.click();
  };

  // Function to create the merged image without resize borders and handles
  const createMergedImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    // Create a new canvas with 1080x1920 dimensions (9:16 aspect ratio for portrait mode)
    const mergeCanvas = document.createElement('canvas');
    mergeCanvas.width = 1080;
    mergeCanvas.height = 1920;
    const ctx = mergeCanvas.getContext('2d');
    
    // Fill with black background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, mergeCanvas.width, mergeCanvas.height);
    
    // Calculate dimensions to fit the image with object-fit: contain
    const originalWidth = canvas.width;
    const originalHeight = canvas.height;
    const targetWidth = mergeCanvas.width;
    const targetHeight = mergeCanvas.height;
    
    const aspectRatio = originalWidth / originalHeight;
    const targetAspectRatio = targetWidth / targetHeight;
    
    let drawWidth, drawHeight, offsetX, offsetY;
    
    if (aspectRatio > targetAspectRatio) {
      // Image is wider than the target area
      drawWidth = targetWidth;
      drawHeight = targetWidth / aspectRatio;
      offsetX = 0;
      offsetY = (targetHeight - drawHeight) / 2;
    } else {
      // Image is taller than the target area
      drawHeight = targetHeight;
      drawWidth = targetHeight * aspectRatio;
      offsetX = (targetWidth - drawWidth) / 2;
      offsetY = 0;
    }
    
    // Create a temporary canvas to draw the background and logo without borders/handles
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Draw background image
    if (backgroundImage && imageRef.current && imageRef.current.complete) {
      tempCtx.drawImage(
        imageRef.current,
        0, 0, imageRef.current.naturalWidth, imageRef.current.naturalHeight,
        0, 0, tempCanvas.width, tempCanvas.height
      );
    }
    
    // Draw logo without borders or handles
    if (logoRef.current && logoRef.current.complete) {
      const scaledLogoWidth = logoRef.current.naturalWidth * logoScale;
      const scaledLogoHeight = logoRef.current.naturalHeight * logoScale;
      
      tempCtx.drawImage(
        logoRef.current,
        logoPosition.x,
        logoPosition.y,
        scaledLogoWidth,
        scaledLogoHeight
      );
    }
    
    // Draw the clean canvas content onto the merge canvas
    ctx.drawImage(tempCanvas, offsetX, offsetY, drawWidth, drawHeight);
    
    // Return the data URL of the merged image
    return {
      dataUrl: mergeCanvas.toDataURL('image/png'),
      dimensions: { width: mergeCanvas.width, height: mergeCanvas.height },
      offsets: { x: offsetX, y: offsetY },
      scale: { width: drawWidth, height: drawHeight }
    };
  };

  const handleVideoDownload = async () => {
    try {
      setIsProcessing(true);
      setProgress(0);
      
      // First, create the merged image
      const mergedImageData = createMergedImage();
      if (!mergedImageData) {
        toast.error('Failed to create merged image');
        setIsProcessing(false);
        return;
      }
      
      // Store the merged image in state
      setMergedImage(mergedImageData);
      
      // Create a 1080x1920 canvas for the video (portrait mode)
      const videoCanvas = document.createElement('canvas');
      videoCanvas.width = 1080;
      videoCanvas.height = 1920;
      const ctx = videoCanvas.getContext('2d');
      
      // Load the merged image
      const img = new Image();
      img.src = mergedImageData.dataUrl;
      
      // Wait for the image to load
      await new Promise(resolve => {
        img.onload = resolve;
      });
      
      // Create a video element
      const videoElement = document.createElement('video');
      videoElement.style.display = 'none';
      document.body.appendChild(videoElement);
      
      // Create audio context for mixing audio with video
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const audioDestination = audioContext.createMediaStreamDestination();
      
      // Load audio element and connect to audio context
      const audioElement = document.createElement('audio');
      audioElement.src = '/background.mp3';
      audioElement.loop = false;
      document.body.appendChild(audioElement);
      
      // Connect audio to the media stream
      const audioSource = audioContext.createMediaElementSource(audioElement);
      audioSource.connect(audioDestination);
      audioSource.connect(audioContext.destination); // Also connect to speakers
      
      // Combine video and audio streams
      const videoStream = videoCanvas.captureStream(25); // 25fps
      const combinedStream = new MediaStream([
        ...videoStream.getVideoTracks(),
        ...audioDestination.stream.getAudioTracks()
      ]);
      
      // Try to use MP4 codec first, fallback to WebM if not supported
      let mimeType = 'video/mp4';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm; codecs=h264,opus';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'video/webm'; // Final fallback
        }
      }
      
      // Set up MediaRecorder with combined stream
      const mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType: mimeType,
        videoBitsPerSecond: 5000000 // 5 Mbps for better quality
      });
      
      const chunks = [];
      
      // Handle data available from recorder
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      // Handle recording stop
      mediaRecorder.onstop = () => {
        // Use MP4 if possible, otherwise fallback to WebM
        const fileExtension = mimeType.includes('mp4') ? 'mp4' : 'webm';
        const blob = new Blob(chunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        
        // Create download link
        const link = document.createElement('a');
        link.href = url;
        link.download = `meme-video.${fileExtension}`;
        link.click();
        
        // Clean up
        URL.revokeObjectURL(url);
        document.body.removeChild(videoElement);
        document.body.removeChild(audioElement);
        
        setIsProcessing(false);
        setProgress(100);
        toast.success(`Video generated successfully as ${fileExtension.toUpperCase()}!`);
      };
      
      // Wait for audio element metadata to load to get duration
      audioElement.addEventListener('loadedmetadata', () => {
        // Get the actual duration of the audio file
        const duration = audioElement.duration;
        console.log('Audio duration:', duration, 'seconds');
        
        // Animation variables
        const fps = 25;
        const totalFrames = Math.ceil(fps * duration);
        let currentFrame = 0;
        
        // Use a flag to ensure we only start recording once
        let hasStartedRecording = false;
        
        // Use once to ensure this only runs once
        const startRecording = () => {
          if (hasStartedRecording) return;
          hasStartedRecording = true;
          
          console.log('Starting recording...');
          // Start recording with a larger timeslice for better quality
          mediaRecorder.start(1000); // Collect data in 1-second chunks
          
          // Start audio playback
          audioElement.play().catch(err => {
            console.error('Audio play error:', err);
            toast.error('Error playing audio. Please try again.');
          });
        };
        
        // Only add the event listener once
        audioElement.addEventListener('canplaythrough', startRecording, { once: true });
        
        // Animation function
        const renderFrame = () => {
          // Update progress
          setProgress(Math.floor((currentFrame / totalFrames) * 100));
          
          // Clear canvas and draw black background
          ctx.fillStyle = 'black';
          ctx.fillRect(0, 0, videoCanvas.width, videoCanvas.height);
          
          // Draw the merged image (which already has the logo)
          ctx.drawImage(img, 0, 0);
          
          currentFrame++;
          
          if (currentFrame < totalFrames) {
            // Continue animation
            setTimeout(renderFrame, 1000 / fps);
          } else {
            // End recording after all frames are rendered
            console.log('All frames rendered, stopping recording');
            setTimeout(() => {
              if (mediaRecorder.state === 'recording') {
                mediaRecorder.stop();
              }
            }, 1000); // Add a larger buffer to ensure all audio is captured
          }
        };
        
        // Start the animation
        renderFrame();
      });
      
      // Add ended event to handle case where audio ends before frames are done
      audioElement.addEventListener('ended', () => {
        console.log('Audio ended');
        // Give a small buffer to ensure all frames are processed
        setTimeout(() => {
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
          }
        }, 1000);
      });
      
      // Handle audio loading error
      audioElement.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        toast.error('Error loading background music');
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
        setIsProcessing(false);
      });
      
      // Load the audio
      audioElement.load();
      
    } catch (error) {
      console.error('Error generating video:', error);
      toast.error('Error generating video. Please try again.');
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleRestart = () => {
    setBackgroundImage(null);
    setLogoPosition({ x: 0, y: 0 });
    setLogoScale(1); // Reset logo scale
    setCanvasStyle({}); // Clear canvas styles
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
    setDragOffset({ x: 0, y: 0 });
    setMaxLogoSliderValue(2); // Reset to default
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-4xl space-y-4">
        <div className="flex flex-wrap gap-4 justify-center mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
            id="fileInput"
          />
          <label
            htmlFor="fileInput"
            className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 cursor-pointer"
          >
            Choose File
          </label>
          <button
            onClick={generateWithAI}
            disabled={isGeneratingAI}
            className={`px-4 py-2 rounded-lg font-medium text-white ${
              isGeneratingAI 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isGeneratingAI ? 'Generating...' : 'Generate with AI'}
          </button>
          <button
            onClick={handleRestart}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
          >
            Restart
          </button>
          {backgroundImage && (
            <>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
              >
                Download Image
              </button>
              <button
                onClick={handleVideoDownload}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
                disabled={isProcessing}
              >
                {isProcessing ? `Processing... ${progress}%` : 'Generate Video'}
              </button>
            </>
          )}
        </div>

        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {backgroundImage ? (
            <canvas
              ref={canvasRef}
              style={canvasStyle}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchMove={handleMouseMove}
              onTouchEnd={handleMouseUp}
            />
          ) : (
            <p className="text-gray-500">
              Drop an image here or click Generate with AI to create a background
            </p>
          )}
        </div>

        {backgroundImage && (
          <div className="w-full max-w-xs mx-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo Size
            </label>
            <input
              type="range"
              min="0.1"
              max={maxLogoSliderValue}
              step="0.1"
              value={logoScale}
              onChange={(e) => setLogoScale(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateMeme;