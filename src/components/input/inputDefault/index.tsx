import React from 'react';
import {
  AlertCircleIcon,
  CalendarDaysIcon,
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField,
  InputIcon,
  InputSlot,
} from '@gluestack-ui/themed';
import { DimensionValue, KeyboardTypeOptions } from 'react-native';

type Props = {
  label?: string;
  placeHolder?: string;
  variant?: 'rounded' | 'outline' | 'underlined' | undefined;
  size?: 'sm' | 'md' | 'lg' | 'xl' | undefined;
  changeText: (value: string) => void;
  fieldInput?: KeyboardTypeOptions | undefined;
  typeInput?: 'password' | 'text' | undefined;
  bgColor?: string;
  onFocus?: () => void;
  value?: string;
  isDisabled?: boolean;
  showIcon?: boolean;
  iconElement?: JSX.Element | JSX.Element[];
  softOnFocus?: boolean;
  testID?: string;
  messageFail?: string;
  isValid?: boolean;
  borderColor?: string;
  messageError?: string;
  defaultValue?: string;
  width?: DimensionValue;
};
const InputDefault: React.FC<Props> = ({
  label,
  placeHolder,
  variant,
  size,
  changeText,
  fieldInput,
  typeInput,
  bgColor,
  onFocus,
  value,
  isDisabled,
  showIcon,
  iconElement,
  softOnFocus,
  testID,
  messageFail,
  isValid,
  borderColor = '#d6d3d1',
  messageError,
  defaultValue,
  width,
}) => {
  return (
    <FormControl isInvalid={isValid} width={width}>
      {label && (
        <FormControlLabel mb="$1">
          <FormControlLabelText>{label}</FormControlLabelText>
        </FormControlLabel>
      )}

      <Input
        variant={variant}
        size={size}
        borderRadius={10}
        isDisabled={isDisabled}
        borderColor={borderColor}>
        {showIcon && (
          <InputSlot alignItems="center" width={'10%'}>
            {iconElement}
          </InputSlot>
        )}

        <InputField
          defaultValue={defaultValue}
          placeholder={placeHolder}
          onChangeText={value => changeText(value)}
          value={value}
          keyboardType={fieldInput}
          backgroundColor={bgColor}
          onFocus={onFocus}
          showSoftInputOnFocus={softOnFocus}
          testID={testID}
        />
      </Input>
      <FormControlError>
        <FormControlErrorIcon as={AlertCircleIcon} />
        <FormControlErrorText>
          {messageError === '' ? 'Invalid email input' : messageError}
        </FormControlErrorText>
      </FormControlError>
    </FormControl>
  );
};

export { InputDefault };
