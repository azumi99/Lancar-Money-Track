import {Textarea, TextareaInput} from '@gluestack-ui/themed';
import React from 'react';
import {DimensionValue} from 'react-native';
type Props = {
  size?: 'sm' | 'md' | 'lg' | 'xl' | undefined;
  width?: DimensionValue | undefined;
  valueChange: (value: string) => void;
  valueDefault?: string;
};
const TextAreaCustom: React.FC<Props> = ({
  size,
  width,
  valueDefault,
  valueChange,
}) => {
  return (
    <Textarea size={size} w={width}>
      <TextareaInput defaultValue={valueDefault} onChangeText={valueChange} />
    </Textarea>
  );
};

export {TextAreaCustom};
