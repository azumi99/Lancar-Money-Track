import { IconCustom } from "@components/iconCustom";
import { Box, HStack, View, VStack, Text } from "@gluestack-ui/themed";
import React from "react";
import { TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const Transfer = () => (
    <View flex={1} paddingHorizontal={16} alignItems="center" justifyContent="center">
        <HStack alignItems="center" justifyContent="space-between">
            <TouchableOpacity>
                <Box bgColor="$secondary300" paddingVertical={20} paddingHorizontal={50} borderRadius={10}>
                    <VStack alignItems="center" space="lg">
                        <Box bgColor="$yellow300" padding={10} borderRadius={10}>
                            <IconCustom As={Ionicons} name={'add'} size={20} />
                        </Box>
                        <Text color="black">Pilih</Text>
                    </VStack>
                </Box>
            </TouchableOpacity>
            <View paddingHorizontal={15}>
                <IconCustom As={Ionicons} name={'arrow-forward'} size={25} />
            </View>
            <TouchableOpacity>
                <Box bgColor="$secondary300" paddingVertical={20} paddingHorizontal={50} borderRadius={10}>
                    <VStack alignItems="center" space="lg">
                        <Box bgColor="$yellow300" padding={10} borderRadius={10}>
                            <IconCustom As={Ionicons} name={'add'} size={20} />
                        </Box>
                        <Text color="black">Pilih</Text>
                    </VStack>
                </Box>
            </TouchableOpacity>
        </HStack>
    </View>
);

export { Transfer }