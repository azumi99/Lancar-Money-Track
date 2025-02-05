import { IconCustom } from "@components/iconCustom"
import { InputDefault } from "@components/input/inputDefault"
import { View, Text, VStack, HStack, Box } from "@gluestack-ui/themed"
import React from "react"
import { TouchableOpacity } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"

interface FormAddInterface {
    handleClose: () => void;
    input: string;
    images: { uri: string; base64: string }[];
    handleImage: () => void;
    handleCamera: () => void;
    setCatatan: (value: string) => void;
    setInput: (value: string | ((prev: string) => string)) => void;
    setShowModal: (value: boolean | ((prev: boolean) => boolean)) => void;

}

const PadFormAdd: React.FC<FormAddInterface> = ({ handleClose, handleCamera, handleImage, input, images, setCatatan, setInput, setShowModal }) => {
    const handlePress = (value: string) => {
        if (value === "=") {
            try {
                const result = eval(input); // Hasil evaluasi
                setInput(result.toString()); // Pastikan hasil jadi string
            } catch (error) {
                setInput("Error");
            }
        } else if (value === "AC") {
            setInput(""); // Menghapus seluruh input
        } else if (value === "DEL") {
            setInput((prev) => (typeof prev === "string" ? prev.slice(0, -1) : "")); // Menghapus 1 karakter terakhir
        } else if (value === "today") {
            setShowModal(true); // Membuka modal
        } else {
            setInput((prev) => (typeof prev === "string" ? prev + value : value)); // Tambah karakter
        }
    };

    const buttons = [
        ["AC", "DEL", "today", "+"],
        ["1", "2", "3", "-"],
        ["4", "5", "6", "="],
        ["7", "8", "9", "0"],

    ];
    return (
        <View height={'52%'} bgColor="$secondary100">
            <VStack paddingHorizontal={16} paddingVertical={16} space="md">
                <HStack justifyContent="space-between" alignItems="center">
                    <TouchableOpacity onPress={handleClose}>
                        <Box padding={6} bgColor="$secondary200" borderRadius={10}>
                            <IconCustom As={Ionicons} name="wallet-outline" size={20} />
                        </Box>
                    </TouchableOpacity>
                    <Text color="black" size="lg">{input || "0"}</Text>
                </HStack>
                <Box padding={6} borderRadius={10} bgColor="white" >
                    <HStack justifyContent="space-between" alignItems="center" marginHorizontal={10}>
                        <HStack alignItems="center">
                            <Text size="xs">Catatan: </Text>
                            <InputDefault changeText={(text) => setCatatan(text)} variant="outline" width={'77%'} borderColor="transparent" />
                        </HStack>

                        <TouchableOpacity onPress={images.length > 0 ? handleImage : handleCamera}>
                            <IconCustom As={Ionicons} name="camera-outline" size={20} />
                            {images.length > 0 && <View width={20} height={20} borderRadius={'$full'} bgColor="$yellow300" alignItems="center" position="absolute" right={-10}>
                                <Text size="xs">{images.length}</Text>
                            </View>}
                        </TouchableOpacity>
                    </HStack>
                </Box>
                <View >
                    <VStack space="md">
                        {buttons.map((row, rowIndex) => (
                            <HStack key={rowIndex} justifyContent="space-around">

                                {row.map((button) => (
                                    <TouchableOpacity
                                        key={button}
                                        style={{
                                            backgroundColor: "#ddd",
                                            alignItems: 'center',
                                            padding: 10,
                                            width: '20%',
                                            borderRadius: 10
                                        }}
                                        onPress={() => handlePress(button)}
                                    >
                                        {button === "today" ? (
                                            <IconCustom name="calendar-clear" size={20} color="#eab308" As={Ionicons} />
                                        ) : (
                                            <Text>{button}</Text>
                                        )}

                                    </TouchableOpacity>
                                ))}
                            </HStack>
                        ))}
                    </VStack>
                </View>
            </VStack>
        </View>
    )
}

export { PadFormAdd }