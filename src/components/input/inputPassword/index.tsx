import React from 'react';
import {
  AlertCircleIcon,
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField,
  InputSlot,
} from '@gluestack-ui/themed';
import {ColorValue, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {IconCustom} from '@components/iconCustom';
type Props = {
  label: string;
  show: boolean;
  handle: () => void;
  onChange?: (value: string) => void;
  size?: 'sm' | 'md' | 'lg' | 'xl' | undefined;
  value?: string;
  testID?: string;
  isValid?: boolean;
  borderColor?: string;
  iconColor?: string;
  messageError?: string;
};
const InputPassword: React.FC<Props> = ({
  label,
  show,
  handle,
  onChange,
  size,
  testID,
  isValid,
  value,
  borderColor,
  iconColor,
  messageError = '',
}) => {
  return (
    <FormControl isInvalid={isValid}>
      <FormControlLabel mb="$1">
        <FormControlLabelText>{label}</FormControlLabelText>
      </FormControlLabel>
      <Input borderRadius={10} size={size} borderColor={borderColor}>
        <InputField
          type={show ? 'text' : 'password'}
          onChangeText={onChange}
          testID={testID}
          value={value}
        />
        <InputSlot pr="$3" accessibilityElementsHidden={false}>
          <TouchableOpacity onPress={handle} testID={testID + '_show'}>
            <IconCustom
              As={Ionicons}
              name={show ? 'eye' : 'eye-off'}
              size={20}
              color={iconColor}
            />
          </TouchableOpacity>
        </InputSlot>
      </Input>
      <FormControlError>
        <FormControlErrorIcon as={AlertCircleIcon} />
        <FormControlErrorText>
          {messageError?.length < 6
            ? 'Minimum password 6 charcter'
            : messageError}
        </FormControlErrorText>
      </FormControlError>
    </FormControl>
  );
};

export {InputPassword};
