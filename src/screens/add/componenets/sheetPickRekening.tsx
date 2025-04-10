import { formatThousand } from "@components/formatRibuan"
import { IconCustom } from "@components/iconCustom"
import { TextHeading } from "@components/textHeading"
import { useRekeningData } from "@config/store"
import { Switch, Text, Actionsheet, ActionsheetBackdrop, ActionsheetContent, ActionsheetDragIndicatorWrapper, ActionsheetDragIndicator, HStack, ActionsheetScrollView, VStack, Box, Divider, View } from "@gluestack-ui/themed"
import { useNavigation } from "@react-navigation/native"
import React, { useState } from "react"
import { TouchableOpacity } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import Octicons from "react-native-vector-icons/Octicons"

interface SheetRekeneingInterface {
    showActionsheet: boolean;
    handleClose: () => void;
    handleToggle: boolean;
    setHandleToggle: (value: boolean) => void;
    selectedRekening?: number | undefined;
    setSelectedRekening: (value: number | undefined) => void;
}
const SheetPickRekening: React.FC<SheetRekeneingInterface> = ({ showActionsheet, handleClose, handleToggle, setHandleToggle, setSelectedRekening, selectedRekening }) => {
    const navigation = useNavigation<any>();
    const { rekening } = useRekeningData();
    const defaultSelect = rekening.find(value => value.key === selectedRekening);
    const [selectedRek, setSelectedRek] = useState(defaultSelect);


    return (
        <Actionsheet isOpen={showActionsheet} onClose={handleClose} zIndex={999}>
            <ActionsheetBackdrop />
            <ActionsheetContent height={'$72'} zIndex={999}>
                <ActionsheetDragIndicatorWrapper>
                    <ActionsheetDragIndicator />
                </ActionsheetDragIndicatorWrapper>
                <HStack justifyContent="space-between" width={'100%'} paddingHorizontal={10} paddingVertical={5}>
                    <TouchableOpacity onPress={handleClose}>
                        <IconCustom As={Ionicons} name="close" size={25} />
                    </TouchableOpacity>
                    <TextHeading>Rekening</TextHeading>
                    <TouchableOpacity onPress={() => { navigation.navigate('StackNav', { screen: 'RekeningScreen' }); handleClose() }}>
                        <IconCustom As={Octicons} name="gear" size={25} />
                    </TouchableOpacity>
                </HStack>
                <ActionsheetScrollView h={'52%'} paddingHorizontal={10} paddingVertical={5}>
                    <VStack space="sm">
                        {rekening.length > 0 &&
                            rekening.map((value, key) => (
                                <TouchableOpacity key={key} onPress={() => { setSelectedRek(value); setSelectedRekening(value?.key); handleClose() }}>
                                    <VStack space="sm" >
                                        <Box paddingVertical={5}>
                                            <HStack justifyContent="space-between" alignItems="center">
                                                <HStack alignItems="center" space="md">
                                                    <Box bgColor="$yellow300" padding={10} borderRadius={10}>
                                                        <IconCustom As={Ionicons} name={value.iconname} size={25} />
                                                    </Box>
                                                    <Text size="sm">{value.name}</Text>
                                                    <IconCustom As={Ionicons} name="checkmark-sharp" size={20} color={'#fde047'} style={{ display: selectedRek?.key === value.key ? "flex" : "none" }} />
                                                </HStack>
                                                <Text size="sm">{value.matauang} {formatThousand(value.jumlah)}</Text>
                                            </HStack>
                                        </Box>
                                        <Divider my="$0.5" />
                                    </VStack>
                                </TouchableOpacity>
                            ))}

                        <TouchableOpacity onPress={() => { setSelectedRek(undefined); setSelectedRekening(undefined); }}>
                            <VStack space="sm" mb={10}>
                                <Box paddingVertical={10}>
                                    <HStack justifyContent="space-between" alignItems="center">
                                        <HStack alignItems="center" space="md" maxWidth={'70%'}>
                                            <Box bgColor="$secondary200" padding={10} borderRadius={10}>
                                                <IconCustom As={Ionicons} name="wallet-outline" size={25} />
                                            </Box>
                                            <Text size="sm">Tidak terkait dengan rekening apa pun</Text>
                                        </HStack>
                                        <IconCustom As={Ionicons} name="checkmark-sharp" size={20} color={'#fde047'} style={{ display: selectedRek === undefined ? "flex" : "none" }} />
                                    </HStack>
                                </Box>
                                <Divider my="$0.5" />
                            </VStack>
                        </TouchableOpacity>
                    </VStack>


                </ActionsheetScrollView>

                <HStack alignItems="center" width={'100%'} justifyContent="space-between" paddingHorizontal={16}>
                    <Text maxWidth={'70%'}>Secara otomatis muncul setiap saat</Text>
                    <Switch value={handleToggle} onToggle={setHandleToggle} size="lg" isDisabled={false} />
                </HStack>
            </ActionsheetContent>

        </Actionsheet>
    )
}

export { SheetPickRekening }