import { IconCustom } from "@components/iconCustom";
import { PadStore, useDefaultOpenRek, useRekeningData, useRekeningTransferStore } from "@config/store";
import { Box, HStack, View, VStack, Text } from "@gluestack-ui/themed";
import React, { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SheetPickRekening } from "./componenets/sheetPickRekening";
import { formatThousand } from "@components/formatRibuan";

const Transfer = () => {
    const [showActionsheet, setShowActionsheet] = useState(false);
    const { defaultHandle, setHandleDefault } = useDefaultOpenRek();
    const { rekening } = useRekeningData();

    const { selectedRekeningFrom, selectedRekeningTo, setSelectedRekeningFrom, setSelectedRekeningTo } = useRekeningTransferStore();
    const [selectingRekening, setSelectingRekening] = useState<"from" | "to">("from");

    const rekFrom = rekening.find(value => value.key === selectedRekeningFrom);
    const rekTo = rekening.find(value => value.key === selectedRekeningTo);

    const openPicker = (target: "from" | "to") => {
        setSelectingRekening(target);
        setShowActionsheet(true);
    };

    const handleClose = () => setShowActionsheet(false);

    return (
        <View flex={1} paddingHorizontal={16} alignItems="center" justifyContent="center">
            <HStack alignItems="center" justifyContent="space-between">
                {/* FROM */}
                <TouchableOpacity onPress={() => openPicker("from")}>
                    <Box bgColor="$secondary200" width={120} height={120} borderRadius={10} alignItems="center" justifyContent="center">
                        <VStack alignItems="center" space="lg">
                            <Box bgColor="$yellow300" padding={10} borderRadius={10}>
                                <IconCustom As={Ionicons} name={rekFrom === undefined ? 'add' : rekFrom?.iconname} size={20} />
                            </Box>
                            <VStack alignItems="center">
                                <Text size="xs">{rekFrom?.name || 'Pilih'}</Text>
                                {rekFrom !== undefined && <Text size="xs">{formatThousand(rekFrom?.jumlah ?? 0)}</Text>}
                            </VStack>
                        </VStack>
                    </Box>
                </TouchableOpacity>

                {/* ARROW */}
                <View paddingHorizontal={15}>
                    <IconCustom As={Ionicons} name={'arrow-forward'} size={25} />
                </View>

                {/* TO */}
                <TouchableOpacity onPress={() => openPicker("to")}>
                    <Box bgColor="$secondary200" width={120} height={120} borderRadius={10} alignItems="center" justifyContent="center">
                        <VStack alignItems="center" space="lg">
                            <Box bgColor="$yellow300" padding={10} borderRadius={10}>
                                <IconCustom As={Ionicons} name={rekTo === undefined ? 'add' : rekTo?.iconname} size={20} />
                            </Box>
                            <VStack alignItems="center">
                                <Text size="xs">{rekTo?.name || 'Pilih'}</Text>
                                {rekTo !== undefined && <Text size="xs">{formatThousand(rekTo?.jumlah ?? 0)}</Text>}
                            </VStack>
                        </VStack>
                    </Box>
                </TouchableOpacity>
            </HStack>

            <SheetPickRekening
                showActionsheet={showActionsheet}
                handleClose={handleClose}
                handleToggle={defaultHandle}
                setHandleToggle={setHandleDefault}
                setSelectedRekening={(value) => {
                    if (selectingRekening === "from") {
                        setSelectedRekeningFrom(value);
                    } else {
                        setSelectedRekeningTo(value);
                    }
                    handleClose();
                }}
            />
        </View>
    );
};

export { Transfer };
