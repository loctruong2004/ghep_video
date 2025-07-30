import { AbsoluteFill, Sequence, staticFile, Video, Audio } from 'remotion';
import { getVideoMetadata, getAudioData } from '@remotion/media-utils';
import { useEffect, useState } from 'react';

const fps = 30;

// export const videoSources = [
//   '/hailuo_0.mp4',
//   '/hailuo_1.mp4',
//   '/hailuo_2.mp4',
// ];

// export const audioSources = [
//   '/kb_voical_part1.wav',
//   '/kb_voical_part2.wav',
// ];
type MyCompositionProps = {
  videoSources: string[];
  audioSources: string[];
};

export const MyComposition: React.FC<MyCompositionProps> = ({ videoSources, audioSources }) => {
  const [videoDurations, setVideoDurations] = useState<number[] | null>(null);
  const [audioDurations, setAudioDurations] = useState<number[] | null>(null);

  useEffect(() => {
    const loadMetadata = async () => {
      const videoDurations = await Promise.all(
        videoSources.map(async (src) => {
          const { durationInSeconds } = await getVideoMetadata(src);
          return Math.floor(durationInSeconds * fps);
        })
      );

      const audioDurations = await Promise.all(
        audioSources.map(async (src) => {
          const { durationInSeconds } = await getAudioData(src);
          return Math.floor(durationInSeconds * fps);
        })
      );

      setVideoDurations(videoDurations);
      setAudioDurations(audioDurations);
    };

    loadMetadata();
  }, []);

  if (!videoDurations || !audioDurations) {
    return (
      <AbsoluteFill
        style={{
          backgroundColor: 'black',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
        }}
      >
        Loading...
      </AbsoluteFill>
    );
  }

  let currentFrame_video = 0;
  let currentFrame_audio = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      {/* Phát audio nối tiếp nhau */}
      {audioSources.length > 0 && audioSources.map((src, i) => {
        const duration = audioDurations[i];
        const audioSequence = (
          <Sequence key={i} from={currentFrame_audio} durationInFrames={duration}>
            <Audio src={src} />
          </Sequence>
        );
        currentFrame_audio += duration;
        return audioSequence;
      })}

      {/* Phát video nối tiếp nhau */}
      {videoSources.map((src, i) => {
        const duration = videoDurations[i];
        const sequence = (
          <Sequence key={i} from={currentFrame_video} durationInFrames={duration}>
            <Video src={src} />
          </Sequence>
        );
        currentFrame_video += duration;
        return sequence;
      })}
    </AbsoluteFill>
  );
};
