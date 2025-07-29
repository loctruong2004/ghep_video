import { Composition } from 'remotion';
import { MyComposition } from './MyComposition';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="MyComposition"
      component={MyComposition}
      durationInFrames={330} // tổng độ dài = 11 giây * 30 fps
      fps={30}
      width={1080}
      height={1920} // chiều cao dọc
    />
  );
};
