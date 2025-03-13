import { IconCustom } from "@components/iconCustom";
import { Box, Button, ButtonText, CloseIcon, Heading, HStack, Icon, Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Text, VStack } from "@gluestack-ui/themed"
import React from "react"
import { TouchableOpacity } from "react-native";

interface PropsModalKonfirmasi {
    showModal: boolean;
    setShowModal: (value: boolean) => void;
    actionTrue?: () => void;
}
const ModalKonfirmasiCurrency: React.FC<PropsModalKonfirmasi> = ({ showModal, setShowModal, actionTrue }) => {
    const ref = React.useRef(null)
    return (
        <Modal
            isOpen={showModal}
            onClose={() => {
                setShowModal(false)
            }}
            finalFocusRef={ref}
        >
            <ModalBackdrop />
            <ModalContent>
                <ModalBody >
                    <VStack padding={10} space="xl" marginVertical={10}>
                        <Text textAlign="center" color="$red500">
                            Saat anda mengubah mata uang default, data history tidak akan di konversi berdasarkan nillaitukar
                        </Text>
                        <HStack space={'md'} justifyContent="center">
                            <TouchableOpacity onPress={() => setShowModal(false)}>
                                <Box padding={5} bgColor="$red400" borderRadius={8}>
                                    <Text color="white">Batalkan</Text>
                                </Box>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={actionTrue}>
                                <Box padding={5} bgColor="$yellow300" borderRadius={8}>
                                    <Text>Konfirmasi</Text>
                                </Box>
                            </TouchableOpacity>
                        </HStack>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export { ModalKonfirmasiCurrency }