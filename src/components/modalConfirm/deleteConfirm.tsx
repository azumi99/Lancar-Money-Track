import { ModalCustom } from "@components/modalComponent"
import { TextHeading } from "@components/textHeading"
import { VStack, HStack, Text, } from "@gluestack-ui/themed"
import React from "react"
import { TouchableOpacity } from "react-native"

interface DeleteInterface {
    showAlertDialog: boolean;
    setShowAlertDialog: (value: boolean) => void;
    title: string;
    actionConfirm?: () => void;
}
const DeleteConfirm: React.FC<DeleteInterface> = ({ showAlertDialog, setShowAlertDialog, title, actionConfirm }) => {
    return (
        <ModalCustom showModal={showAlertDialog} setShowModal={setShowAlertDialog}>
            <VStack space="xl" alignSelf="center" mt={17}>
                <Text size="lg" color="red" textAlign="center">{title}</Text>
                <HStack space="4xl">
                    <TouchableOpacity onPress={() => setShowAlertDialog(false)} style={{ padding: 5, paddingHorizontal: 15 }}>
                        <TextHeading>Batalkan</TextHeading>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={actionConfirm} style={{ padding: 5, paddingHorizontal: 15 }}>
                        <TextHeading>Konfirmasi</TextHeading>
                    </TouchableOpacity>
                </HStack>
            </VStack>
        </ModalCustom>
    )
}

export { DeleteConfirm }