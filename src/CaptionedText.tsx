import { interpolate, useCurrentFrame } from 'remotion';

interface CaptionedTextProps {
  text: string;
  startFrame: number;
  wordsPerSecond?: number;
  style?: React.CSSProperties;
}

export const CaptionedText: React.FC<CaptionedTextProps> = ({
  text,
  startFrame,
  wordsPerSecond = 2,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const words = text.split(' ');

  // Tính số từ nên hiện dựa trên frame hiện tại
  const visibleWords = interpolate(
    frame - startFrame,
    [0, words.length / wordsPerSecond],
    [0, words.length],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 150,
        width: '100%',
        textAlign: 'center',
        fontSize: 60,
        color: 'white',
        fontWeight: 'bold',
        textShadow: '2px 2px 8px black',
        padding: '0 40px',
        ...style,
      }}
    >
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            opacity: i < visibleWords ? 1 : 0.2,
            transition: 'opacity 0.3s',
            marginRight: 8,
          }}
        >
          {word}
        </span>
      ))}
    </div>
  );
};
