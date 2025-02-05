import React from "react";
import { Text } from "@gluestack-ui/themed";
import { Platform, TextStyle } from "react-native";

type Props = {
  size?:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "2xs"
    | "4xl"
    | "5xl"
    | "6xl"
    | undefined;
  children?: string | React.ReactNode;
  style?: TextStyle;
};
const TextHeading: React.FC<Props> = ({ size, children, style }) => {
  return (
    <Text
      bold={Platform.OS === "ios" ? true : false}
      fontFamily={
        Platform.OS === "ios" ? "Poppins-Regular" : "Poppins-SemiBold"
      }
      size={size}
      style={style}
    >
      {children}
    </Text>
  );
};

export { TextHeading };
