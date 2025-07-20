import { Composition } from 'remotion';
import MemeVideo from './MemeVideo';

export const MemeComposition = ({ backgroundImage, logoImage, logoPosition, logoScale }) => {
  return (
    <Composition
      id="MemeVideo"
      component={() => (
        <MemeVideo
          backgroundImage={backgroundImage}
          logoImage={logoImage}
          logoPosition={logoPosition}
          logoScale={logoScale}
        />
      )}
      durationInFrames={25 * 8} // 8 seconds at 25fps
      fps={25}
      width={1920}
      height={1080}
    />
  );
};

export default MemeComposition;
