import { TextHeading } from "@components/textHeading";
import { Button, ButtonText, Center, CloseIcon, Heading, Icon, Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Text } from "@gluestack-ui/themed";
import React, { ReactNode } from "react";
import { TextStyle } from "react-native";


interface ModalType {
    showModal: boolean;
    setShowModal: (value: boolean) => void;
    children?: ReactNode;
    title?: string;
    closeHeader?: boolean
    footer?: ReactNode;
    showFooter?: boolean;
    showHeader?: boolean;
    styleHeader?: TextStyle;

}

const ModalCustom: React.FC<ModalType> = ({ showModal, setShowModal, children, footer, title, closeHeader, showHeader, showFooter, styleHeader }) => {
    const ref = React.useRef(null);
    return (
        <Modal
            isOpen={showModal}
            onClose={() => {
                setShowModal(false);
            }}
            finalFocusRef={ref}
            size="lg"
        >
            <ModalBackdrop />
            <ModalContent bgColor="white">
                {showHeader && <ModalHeader style={styleHeader}>
                    <TextHeading>{title}</TextHeading>
                    {closeHeader && <><ModalCloseButton>
                        <Icon as={CloseIcon} />
                    </ModalCloseButton></>}
                </ModalHeader>}
                <ModalBody>
                    {children}
                </ModalBody>
                {showFooter && <ModalFooter>
                    {footer}
                </ModalFooter>}
            </ModalContent>
        </Modal>

    );
}

export { ModalCustom }
