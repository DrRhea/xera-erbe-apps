declare module '*.png' {
  import type { ImageSourcePropType } from 'react-native';
  const value: ImageSourcePropType;
  export default value;
}

declare module '*.svg' {
  import type { FC } from 'react';
  import type { SvgProps } from 'react-native-svg';
  const content: FC<SvgProps>;
  export default content;
}
