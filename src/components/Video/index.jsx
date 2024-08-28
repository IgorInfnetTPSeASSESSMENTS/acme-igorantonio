import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

// eslint-disable-next-line react/prop-types
const VideoBackground = ({sxPersonalized}) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;

    let playCount = 0;
    const handleEnded = () => {
      playCount += 1;
      if (playCount < 1) {
        videoElement.play();
      } else {
        videoElement.currentTime = videoElement.duration - 0.001;
        videoElement.pause();
      }
    };

    videoElement.addEventListener('ended', handleEnded);

    videoElement.play();

    return () => {
      videoElement.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <Box
      sx={sxPersonalized}
    >
      <video
        ref={videoRef}
        src="src/assets/videos/arrow.mp4"
        autoPlay
        muted
        loop={false}
        style={{ 
            height:'100%',
            width: '100%',
            objectFit: 'cover',
            position: 'absolute',
        }}
      />
    </Box>
  );
};

export default VideoBackground;
