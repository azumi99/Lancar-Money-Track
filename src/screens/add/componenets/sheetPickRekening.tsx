import { formatThousand } from "@components/formatRibuan"
import { IconCustom } from "@components/iconCustom"
import { TextHeading } from "@components/textHeading"
import { Switch, Text, Actionsheet, ActionsheetBackdrop, ActionsheetContent, ActionsheetDragIndicatorWrapper, ActionsheetDragIndicator, HStack, ActionsheetScrollView, VStack, Box, Divider } from "@gluestack-ui/themed"
import React from "react"
import { TouchableOpacity } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import Octicons from "react-native-vector-icons/Octicons"

interface SheetRekeneingInterface {
    showActionsheet: boolean;
    handleClose: () => void;

}
const SheetPickRekening: React.FC<SheetRekeneingInterface> = ({ showActionsheet, handleClose }) => {
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
                    <TouchableOpacity>
                        <IconCustom As={Octicons} name="gear" size={25} />
                    </TouchableOpacity>
                </HStack>
                <ActionsheetScrollView h={'52%'} paddingHorizontal={10} paddingVertical={5}>
                    <VStack space="md">
                        <TouchableOpacity>
                            <Box paddingVertical={16}>
                                <HStack justifyContent="space-between" alignItems="center">
                                    <HStack alignItems="center" space="md">
                                        <Box bgColor="$secondary200" padding={10} borderRadius={10}>
                                            <IconCustom As={Ionicons} name="wallet-outline" size={25} />
                                        </Box>
                                        <Text>Ilham</Text>
                                    </HStack>
                                    <Text>{formatThousand(1000000)}</Text>
                                </HStack>
                            </Box>
                            <Divider my="$0.5" />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Box paddingVertical={16}>
                                <HStack justifyContent="space-between" alignItems="center">
                                    <HStack alignItems="center" space="md" maxWidth={'70%'}>
                                        <Box bgColor="$secondary200" padding={10} borderRadius={10}>
                                            <IconCustom As={Ionicons} name="wallet-outline" size={25} />
                                        </Box>
                                        <Text>Tidak terkait dengan rekening apa pun</Text>
                                    </HStack>
                                </HStack>
                            </Box>
                            <Divider my="$0.5" />
                        </TouchableOpacity>
                    </VStack>
                </ActionsheetScrollView>
                <HStack alignItems="center" width={'100%'} justifyContent="space-between" paddingHorizontal={16}>
                    <Text maxWidth={'70%'}>Secara otomatis muncul setiap saat</Text>
                    <Switch size="lg" isDisabled={false} />
                </HStack>

            </ActionsheetContent>
        </Actionsheet>
    )
}

export { SheetPickRekening }