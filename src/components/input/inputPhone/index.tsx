import React from "react";
import {
  Input,
  InputSlot,
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
  SelectScrollView,
  SelectItem,
  InputField,
  useColorMode,
} from "@gluestack-ui/themed";
import dialInterface from "./interface";
type Props = {
  selectChange: (value: string) => void;
  valueLabel: string;
  countries: dialInterface[];
  phoneChange: (value: string) => void;
};
const InputPhone: React.FC<Props> = ({
  selectChange,
  valueLabel,
  countries,
  phoneChange,
}) => {
  const colorMode = useColorMode();
  return (
    <Input borderRadius={10}>
      <InputSlot>
        <Select
          w={95}
          backgroundColor={colorMode === "light" ? "white" : "black"}
          onValueChange={(value) => selectChange(value)}
        >
          <SelectTrigger>
            <SelectInput value={valueLabel} />
            <SelectIcon mr={5}>
              <Icon as={ChevronDownIcon} />
            </SelectIcon>
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              <SelectScrollView>
                {countries.map((value, index) => (
                  <SelectItem
                    key={index}
                    label={value.name}
                    value={value.dial_code}
                  />
                ))}
              </SelectScrollView>
            </SelectContent>
          </SelectPortal>
        </Select>
      </InputSlot>
      <InputField
        keyboardType="phone-pad"
        onChangeText={(value) => phoneChange(value)}
      />
    </Input>
  );
};

export { InputPhone };
