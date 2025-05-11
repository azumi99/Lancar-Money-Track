import React from "react";
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
  Pressable,
} from "@gluestack-ui/themed";
import { DimensionValue, KeyboardTypeOptions } from "react-native";

type Props = {
  label?: string;
  placeHolder?: string;
  variant?: "rounded" | "outline" | "underlined";
  size?: "sm" | "md" | "lg" | "xl";
  changeText: (value: string) => void;
  fieldInput?: KeyboardTypeOptions;
  bgColor?: string;
  onFocus?: () => void;
  value?: string;
  isDisabled?: boolean;
  showIcon?: boolean;
  iconElement?: JSX.Element | JSX.Element[];
  softOnFocus?: boolean;
  testID?: string;
  isValid?: boolean;
  borderColor?: string;
  messageError?: string;
  defaultValue?: string;
  width?: DimensionValue;
  autoFocus?: boolean;
  readonly?: boolean;
};

export const formatThousand = (value: string): string => {
  return value
    .replace(/\D/g, "") // Hapus karakter selain angka
    .replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Format ribuan
};

const InputDefault: React.FC<Props> = ({
  label,
  placeHolder,
  variant,
  size,
  changeText,
  fieldInput,
  bgColor,
  onFocus,
  value,
  isDisabled,
  showIcon,
  iconElement,
  softOnFocus,
  testID,
  isValid,
  borderColor = "#d6d3d1",
  messageError,
  defaultValue,
  width,
  autoFocus,
  readonly = false,
}) => {
  const handleChange = (input: string) => {
    if (fieldInput === "numeric") {
      const numericValue = input.replace(/\D/g, "");
      changeText(numericValue);
    } else {
      changeText(input);
    }
  };

  return (
    <FormControl isInvalid={isValid} width={width}>
      {label && (
        <FormControlLabel mb="$1">
          <FormControlLabelText>{label}</FormControlLabelText>
        </FormControlLabel>
      )}
      <Pressable onPress={onFocus}>
        <Input isReadOnly={readonly} variant={variant} size={size} borderRadius={10} isDisabled={isDisabled} borderColor={borderColor} backgroundColor={bgColor}>
          {showIcon && <InputSlot alignItems="center" width={"10%"}>{iconElement}</InputSlot>}
          <InputField
            defaultValue={defaultValue}
            placeholder={placeHolder}
            onChangeText={handleChange}
            value={fieldInput === "numeric" ? formatThousand(value ?? "") : value}
            keyboardType={fieldInput}
            showSoftInputOnFocus={softOnFocus}
            testID={testID}
            autoFocus={autoFocus}
          />
        </Input>
      </Pressable>

      <FormControlError>
        <FormControlErrorIcon as={AlertCircleIcon} />
        <FormControlErrorText>{messageError || "Invalid input"}</FormControlErrorText>
      </FormControlError>
    </FormControl>
  );
};

export { InputDefault };
