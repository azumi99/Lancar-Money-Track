import { IconCustom } from "@components/iconCustom";
import { TextHeading } from "@components/textHeading";
import { View, Image, Actionsheet, ActionsheetBackdrop, ActionsheetContent, ActionsheetDragIndicatorWrapper, ActionsheetDragIndicator, HStack, ActionsheetScrollView } from "@gluestack-ui/themed";
import React from "react";
import { TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"
import Octicons from "react-native-vector-icons/Octicons"

interface ManageImageInterface {
    imageManage: boolean;
    handleImage: () => void;
    images: { uri: string; base64: string }[]
    removeImage: (index: number) => void;
    handleCamera: () => void;
}

const SheetManageImage: React.FC<ManageImageInterface> = ({ imageManage, handleCamera, handleImage, images, removeImage }) => {
    return (
        <Actionsheet isOpen={imageManage} onClose={handleImage} zIndex={999}>
            <ActionsheetBackdrop />
            <ActionsheetContent height={'$72'} zIndex={999}>
                <ActionsheetDragIndicatorWrapper>
                    <ActionsheetDragIndicator />
                </ActionsheetDragIndicatorWrapper>

                <HStack justifyContent="space-between" width={'100%'} paddingHorizontal={10} paddingVertical={5}>
                    <TouchableOpacity onPress={handleImage}>
                        <IconCustom As={Ionicons} name="close" size={25} />
                    </TouchableOpacity>
                    <TextHeading>Foto</TextHeading>
                    <TouchableOpacity onPress={handleImage}>
                        <IconCustom As={Ionicons} name="checkmark" size={25} />
                    </TouchableOpacity>
                </HStack>
                <ActionsheetScrollView height={'52%'} showsVerticalScrollIndicator={false}>
                    <View marginVertical={16} >

                        {Array.from({ length: Math.ceil(images.length / 3) }, (_, rowIndex) => {
                            const rowImages = images.slice(rowIndex * 3, rowIndex * 3 + 3);

                            return (
                                <HStack key={rowIndex} style={{ marginBottom: 10 }} >
                                    {rowImages.map((item, index) => (
                                        <View style={{ width: '33%', alignItems: 'center' }} key={index}>
                                            <Image
                                                alt={`image${rowIndex * 3 + index}`}
                                                source={{ uri: `data:image/jpeg;base64,${item.base64}` }}
                                                style={{ width: 80, height: 80, borderRadius: 10 }}
                                            />
                                            <TouchableOpacity
                                                onPress={() => removeImage(rowIndex * 3 + index)}
                                                style={{ backgroundColor: 'red', padding: 3, borderRadius: 5, position: "absolute", right: 15 }}
                                            >
                                                <IconCustom As={Ionicons} name="close" size={20} color="white" />
                                            </TouchableOpacity>

                                        </View>
                                    ))}

                                    {rowIndex === Math.ceil(images.length / 3) - 1 && rowImages.length < 3 && (
                                        <View style={{ width: '33%', alignItems: 'center' }}>
                                            <TouchableOpacity
                                                onPress={handleCamera}
                                                style={{
                                                    backgroundColor: '#E0E0E0',
                                                    width: 80,
                                                    height: 80,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    borderRadius: 10
                                                }}
                                            >
                                                <IconCustom As={Octicons} name="plus" size={25} />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </HStack>
                            );
                        })}

                        {images.length % 3 === 0 && (
                            <HStack>
                                <View style={{ width: '33%', alignItems: 'center' }}>
                                    <TouchableOpacity
                                        onPress={handleCamera}
                                        style={{
                                            backgroundColor: '#E0E0E0',
                                            width: 80,
                                            height: 80,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderRadius: 10
                                        }}
                                    >
                                        <IconCustom As={Octicons} name="plus" size={25} />
                                    </TouchableOpacity>
                                </View>
                            </HStack>
                        )}
                    </View>
                </ActionsheetScrollView>



            </ActionsheetContent>
        </Actionsheet>
    )
}

export { SheetManageImage }