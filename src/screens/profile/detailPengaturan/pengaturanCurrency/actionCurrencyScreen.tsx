import { IconCustom } from "@components/iconCustom";
import { InputDefault } from "@components/input/inputDefault";
import SafeAreaCustom from "@components/safeArea";
import { useCurrency } from "@config/store";
import {
    Actionsheet,
    ActionsheetBackdrop,
    ActionsheetContent,
    ActionsheetDragIndicator,
    ActionsheetDragIndicatorWrapper,
    ActionsheetItem,
    ActionsheetItemText,
    ActionsheetScrollView,
    Box,
    CircleIcon,
    Divider,
    HStack,
    Radio,
    RadioGroup,
    RadioIcon,
    RadioIndicator,
    RadioLabel,
    Text,
    View,
    VStack
} from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

interface ActionInterface {
    handleClose: () => void;
    showActionsheet: boolean;
    matauang: string | undefined;
    setMataUang: (value: string) => void;
}

const ActionCurrencyScreen: React.FC<ActionInterface> = ({ handleClose, showActionsheet, matauang, setMataUang }) => {
    const { currency } = useCurrency();
    const selectedCurrency = currency.find(value => value.is_default)
    const navigation = useNavigation<any>();
    const [search, setSearch] = useState('');
    const [activeSearch, setActiveSearch] = useState(false)

    const filteredCurrency = currency.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.short_code.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Actionsheet isOpen={showActionsheet} onClose={handleClose} zIndex={999}>
            <ActionsheetBackdrop />
            <ActionsheetContent h="$72" zIndex={999}>

                <HStack
                    bgColor="$yellow300"
                    justifyContent="space-between"
                    paddingHorizontal={16}
                    paddingVertical={16}
                    borderRadius={16}
                    width="100%"
                >
                    <TouchableOpacity onPress={(handleClose)}>
                        <IconCustom As={Ionicons} name="arrow-back" size={20} />
                    </TouchableOpacity>
                    <Text>Mata Uang</Text>
                    <TouchableOpacity onPress={() => setActiveSearch(!activeSearch)}>
                        <IconCustom As={Ionicons} name="search" size={20} />
                    </TouchableOpacity>
                </HStack>
                <ActionsheetScrollView h={"85%"}>
                    <TouchableOpacity>
                        <View marginVertical={10} bgColor="$secondary200" borderRadius={10}>
                            <ActionsheetItem onPress={() => { navigation.navigate('StackNav', { screen: 'CurrencyScreen' }); handleClose() }} justifyContent="space-between">
                                <Text size="sm">Mata uang bawaan</Text>
                                <HStack alignItems="center" space="sm">
                                    <VStack>
                                        <Text size="xs">{selectedCurrency?.name}</Text>
                                        <Text size="xs">{selectedCurrency?.short_code}</Text>
                                    </VStack>
                                    <IconCustom As={Ionicons} name="chevron-forward" size={20} />
                                </HStack>

                            </ActionsheetItem>
                        </View>
                    </TouchableOpacity>
                    {activeSearch && (
                        <View>
                            <Box marginVertical={16}>
                                <InputDefault
                                    autoFocus
                                    changeText={setSearch}
                                    showIcon
                                    iconElement={<IconCustom As={Ionicons} name="search" size={20} />}
                                />
                            </Box>
                            <Divider my={'$0.5'} />
                        </View>
                    )}
                    {filteredCurrency.length > 0 ? (
                        filteredCurrency.map((item, index) => (
                            <ActionsheetItem onPress={() => { setMataUang(item.short_code); handleClose() }} key={index} justifyContent="space-between">
                                <HStack space="xs">
                                    <Text size="sm">{item.name}</Text>
                                    <Text size="sm">({item.short_code})</Text>
                                </HStack>

                                <RadioGroup value={matauang} onChange={() => { setMataUang(item.short_code); handleClose() }}>
                                    <Radio value={item.short_code} size="md"  >
                                        <RadioIndicator mr='$2'>
                                            <RadioIcon as={CircleIcon} />
                                        </RadioIndicator>
                                    </Radio>
                                </RadioGroup>

                            </ActionsheetItem>
                        ))
                    ) : (
                        <Text textAlign="center" padding="$3">
                            Tidak ada data mata uang
                        </Text>
                    )}
                </ActionsheetScrollView>

            </ActionsheetContent>
        </Actionsheet>
    );
};

export { ActionCurrencyScreen };
