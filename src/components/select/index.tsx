import React from 'react';
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  Icon,
  ChevronDownIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem,
  View,
} from '@gluestack-ui/themed';
import dataInterface from './interface';
import { DimensionValue } from 'react-native';
type Props = {
  label?: string;
  valueChange: (value: string) => void;
  placeHolder?: string;
  variant?: 'rounded' | 'outline' | 'underlined' | undefined;
  size?: 'sm' | 'md' | 'lg' | 'xl' | undefined;
  data?: dataInterface[];
  width?: DimensionValue | undefined;
  selectDefault?: string;
  isDisabled?: boolean;
  redirect?: boolean;
  onOpen?: () => void;
};
const SelectComponent: React.FC<Props> = ({
  label,
  valueChange,
  placeHolder,
  variant,
  size,
  width,
  data,
  selectDefault,
  isDisabled,
  redirect,
  onOpen
}) => {
  const selectedLabel = data?.find((item) => item.value === selectDefault)?.label
  return (
    <FormControl width={width}>
      {label && (
        <FormControlLabel>
          <FormControlLabelText>{label}</FormControlLabelText>
        </FormControlLabel>
      )}

      <Select
        onValueChange={(value: string) => valueChange(value)}
        selectedValue={selectDefault}
        onOpen={onOpen}
        isDisabled={isDisabled}>
        <SelectTrigger
          variant={variant}
          size={size}
          borderRadius={10}
          alignItems="center">
          <SelectInput placeholder={placeHolder} value={selectedLabel} />
          <View mr={'$3'}>
            <SelectIcon >
              <Icon as={ChevronDownIcon} />
            </SelectIcon>
          </View>
        </SelectTrigger>
        {redirect ? null : (
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              {data?.map((item, index) => (
                <SelectItem key={index} label={item.label} value={item.value} />
              ))}
            </SelectContent>
          </SelectPortal>
        )}
      </Select>
    </FormControl>
  );
};

export { SelectComponent };
