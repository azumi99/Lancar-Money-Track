import { useColorMode } from '@gluestack-ui/themed';
import React from 'react';
import { ViewStyle } from 'react-native';

type Props = {
  As: React.ComponentType<any>;
  name?: string;
  size?: number;
  color?: string;
  style?: ViewStyle;
};

const IconCustom: React.FC<Props> = ({ As, name, size, color, style }) => {
  const DynamicIcon = As as React.ComponentType<any>;
  const colorMode = useColorMode();
  return (
    <DynamicIcon
      name={name}
      size={size}
      color={
        colorMode === 'light'
          ? color === undefined
            ? 'black'
            : color
          : color === undefined
            ? 'white'
            : color
      }
      style={style}
    />
  );
};
export { IconCustom };
