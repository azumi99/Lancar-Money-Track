import { Actionsheet, ActionsheetBackdrop, ActionsheetContent, ActionsheetDragIndicatorWrapper, ActionsheetDragIndicator, ActionsheetItem, ActionsheetItemText } from "@gluestack-ui/themed"
import React from "react"

interface SelectMediaInterface {
    sheetCamera: boolean;
    handleCamera: () => void;
    openCamera: () => void;
    openImageLibrary: () => void;
}

const SheetSelectMedia: React.FC<SelectMediaInterface> = ({ sheetCamera, handleCamera, openCamera, openImageLibrary }) => {
    return (
        <Actionsheet isOpen={sheetCamera} onClose={handleCamera} zIndex={999}>
            <ActionsheetBackdrop />
            <ActionsheetContent height={'$72'} zIndex={999}>
                <ActionsheetDragIndicatorWrapper>
                    <ActionsheetDragIndicator />
                </ActionsheetDragIndicatorWrapper>
                <ActionsheetItem onPress={openCamera}>
                    <ActionsheetItemText>Camera</ActionsheetItemText>
                </ActionsheetItem>
                <ActionsheetItem onPress={openImageLibrary}>
                    <ActionsheetItemText>Album</ActionsheetItemText>
                </ActionsheetItem>
            </ActionsheetContent>
        </Actionsheet>
    )
}

export { SheetSelectMedia }