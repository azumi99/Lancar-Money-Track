import { Text, Modal, ModalBackdrop, ModalContent, ModalHeader, Heading, ModalCloseButton, Icon, CloseIcon, ModalBody, ModalFooter, HStack, Box } from "@gluestack-ui/themed";
import React from "react";
import { TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";


interface ModalDateInterface {
    showModal: boolean;
    setShowModal: (value: boolean) => void;
    getFormatedDate: string;
    setDate: (value: string) => void;
    date: string;

}

const DateModal: React.FC<ModalDateInterface> = ({ showModal, setShowModal, getFormatedDate, setDate, date }) => {
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
            <ModalContent bgColor="white">
                <ModalHeader>
                    <Heading size="lg">{getFormatedDate}</Heading>
                    <ModalCloseButton>
                        <Icon as={CloseIcon} />
                    </ModalCloseButton>
                </ModalHeader>
                <ModalBody>
                    <Calendar
                        onDayPress={day => {
                            setDate(day.dateString);
                        }}
                        markedDates={{
                            [date]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange', selectedColor: '#fde047' }
                        }}
                        theme={{
                            todayTextColor: '#eab308',
                            selectedDayTextColor: 'black',
                        }}
                    />
                </ModalBody>
                <ModalFooter>
                    <HStack alignItems="center" space="lg">
                        <TouchableOpacity onPress={() => {
                            setShowModal(false)
                        }}>
                            <Box paddingHorizontal={10} paddingVertical={6} borderRadius={5} bgColor="$yellow300" alignItems="center">
                                <Text>Konfirmasi</Text>
                            </Box>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            setDate(new Date().toISOString().slice(0, 10));
                            setShowModal(false)
                        }}>
                            <Box paddingHorizontal={10} paddingVertical={6} borderRadius={5} bgColor="$error300" alignItems="center">
                                <Text color="white">Batal</Text>
                            </Box>
                        </TouchableOpacity>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export { DateModal }