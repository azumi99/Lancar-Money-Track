import React from 'react';
import {
  HStack,
  View,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField,
} from '@gluestack-ui/themed';

type Props = {
  labelLeft: string;
  labelRight: string;
  placeHolderLeft: string;
  placeHolderRight: string;
  changeLeft: (value: string) => void;
  changeRight: (value: string) => void;
};
const InputBetween: React.FC<Props> = ({
  labelLeft,
  labelRight,
  placeHolderRight,
  placeHolderLeft,
  changeLeft,
  changeRight,
}) => {
  return (
    <HStack justifyContent="space-between">
      <View w={'46%'}>
        <FormControl>
          <FormControlLabel mb="$1">
            <FormControlLabelText>{labelLeft}</FormControlLabelText>
          </FormControlLabel>
          <Input variant="outline" size="md" borderRadius={10}>
            <InputField
              placeholder={placeHolderLeft}
              onChangeText={value => changeLeft(value)}
            />
          </Input>
        </FormControl>
      </View>
      <View w={'46%'}>
        <FormControl>
          <FormControlLabel mb="$1">
            <FormControlLabelText>{labelRight}</FormControlLabelText>
          </FormControlLabel>
          <Input variant="outline" size="md" borderRadius={10}>
            <InputField
              placeholder={placeHolderRight}
              onChangeText={value => changeRight(value)}
            />
          </Input>
        </FormControl>
      </View>
    </HStack>
  );
};

export {InputBetween};
