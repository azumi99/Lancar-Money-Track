import { formatThousand } from "@components/formatRibuan"
import { IconCustom } from "@components/iconCustom"
import { InputDefault } from "@components/input/inputDefault"
import SafeAreaCustom from "@components/safeArea"
import { SelectComponent } from "@components/select"
import dataInterface from "@components/select/interface"
import { useCurrency, useHockRekening, useRekeningData } from "@config/store"
import { Box, Divider, HStack, ScrollView, Text, View, VStack } from "@gluestack-ui/themed"
import { getCurrencyRates } from "@services/Currency/getCurrency"
import React, { useEffect, useState } from "react"
import { TouchableOpacity } from "react-native-gesture-handler"
import Ionicons from "react-native-vector-icons/Ionicons"
import { ActionCurrencyScreen } from "../pengaturanCurrency/actionCurrencyScreen"
import { AddRekening, GetAllRekening, RekeningInterface, UpdateRekening } from "./modelRekening"
import { ShowToast } from "@components/toast"
import { useNavigation } from "@react-navigation/native"

const AddRekeningScreen = ({ route }) => {

    const navigation = useNavigation<any>();
    const { currency } = useCurrency();
    const { rekening } = useRekeningData()
    const dataUpdate = rekening.find(value => value?.key === route?.params?.id)
    const [nameRek, setNameRek] = useState(dataUpdate ? dataUpdate.name : '');
    const { saveRekening, setSaveRekening } = useHockRekening();
    const selectedMataUang = currency?.find(value => value.is_default)
    const [matauang, setMataUang] = useState(dataUpdate ? dataUpdate.matauang : selectedMataUang?.short_code);
    const temSelectCurrency = currency?.find(value => value.short_code === matauang)
    const dataTempCurrency: dataInterface[] = [
        { label: `${temSelectCurrency?.name!} ${temSelectCurrency?.short_code!} (${temSelectCurrency?.symbol!})`, value: temSelectCurrency?.short_code! },
    ];

    const dataRekening: dataInterface[] = [
        { label: 'Bawaan', value: '1' },
        { label: 'Uang tunai', value: '2' },
        { label: 'Kartu debit', value: '3' },
        { label: 'Kartu keredit', value: '4' },
        { label: 'Rekening virtual', value: '5' },
        { label: 'Investasi', value: '6' },
        { label: 'Berhutang padaku / Piutang', value: '7' },
        { label: 'Saya berhutang / Hutang', value: '8' },
    ];
    const [jenis, setJenis] = useState<string | undefined>(dataUpdate ? dataUpdate.jenis : '1');
    const [jumlah, setJumlah] = useState(dataUpdate ? dataUpdate.jumlah : '');

    const walletIcons = [
        "wallet-outline",
        "cash-outline",
        "card-outline",
        "logo-paypal",
        "briefcase-outline",
        "pricetag-outline",
        "receipt-outline",
        "server-outline",
        "globe-outline",
        "storefront-outline",
        "newspaper-outline",
        "business-outline",
        "bar-chart-outline",
        "trending-up-outline",
        "swap-horizontal-outline",
    ];
    const [selectedIcon, setSelectedIcon] = useState(dataUpdate ? dataUpdate.iconname : walletIcons[0]);
    const [catatan, setCatatan] = useState('');
    const [showActionsheet, setShowActionsheet] = useState(false)
    const handleClose = () => setShowActionsheet(!showActionsheet)

    const handleSave = async () => {
        if (!nameRek.trim()) {
            return ShowToast("Nama rekening harus diisi");
        }

        const newRekening: RekeningInterface = {
            key: dataUpdate ? dataUpdate.key : undefined,
            name: nameRek,
            matauang: matauang!,
            jenis: jenis!,
            jumlah: Number(jumlah),
            iconname: selectedIcon,
            catatan: catatan,
            is_default: dataUpdate ? dataUpdate.is_default : false,
        };

        try {
            if (dataUpdate) {
                UpdateRekening(newRekening);
            } else {
                await AddRekening(newRekening);
            }

            await GetAllRekening();
            setSaveRekening(false);
            navigation.goBack();
        } catch (error) {
            ShowToast("Gagal menyimpan data rekening");
        }
    };

    useEffect(() => {
        saveRekening && nameRek.length > 1 && handleSave();
    }, [saveRekening])
    return (
        <SafeAreaCustom>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View paddingHorizontal={16} paddingVertical={16}>
                    <VStack space="lg">
                        <InputDefault
                            changeText={(value) => setNameRek(value)}
                            label="Nama Rekening"
                            value={nameRek}
                            placeHolder="Masukkan nama rekening" />
                        <SelectComponent
                            data={dataRekening}
                            label="Jenis"
                            valueChange={(value) => setJenis(value)}
                            selectDefault={jenis}
                        />
                        <SelectComponent
                            data={dataTempCurrency}
                            isDisabled={route?.params?.id ? true : false}
                            label="Mata uang"
                            valueChange={(value) => setMataUang(value)}
                            selectDefault={matauang}
                            redirect
                            onOpen={handleClose}
                        />
                        <ActionCurrencyScreen showActionsheet={showActionsheet} handleClose={handleClose} matauang={matauang} setMataUang={setMataUang} />
                        <InputDefault
                            value={formatThousand(jumlah)}
                            changeText={(value) => setJumlah(value)}
                            label="Jumlah"
                            placeHolder="0"
                            fieldInput="numeric" />

                        <VStack space={'xs'}>
                            <Text>Icon</Text>
                            <Box bgColor="$secondary50" paddingVertical={16} borderRadius={10}>
                                <VStack space={'md'}>
                                    {Array.from({ length: 3 }, (_, rowIndex) => (
                                        <HStack key={rowIndex} justifyContent="space-around">
                                            {walletIcons.slice(rowIndex * 5, rowIndex * 5 + 5).map((icon, index) => (
                                                <TouchableOpacity key={index} onPress={() => setSelectedIcon(icon)}>
                                                    <Box padding={14} bgColor={icon === selectedIcon ? "$yellow300" : "$secondary200"} borderRadius={10} >
                                                        <IconCustom As={Ionicons} name={icon} size={20} />
                                                    </Box>
                                                </TouchableOpacity>
                                            ))}
                                        </HStack>
                                    ))}
                                </VStack>
                            </Box>
                        </VStack>
                        <InputDefault
                            changeText={(value) => setCatatan(value)}
                            label="Catatan"
                            value={catatan}
                        />
                    </VStack>
                </View>
            </ScrollView>
        </SafeAreaCustom>
    )
}

export { AddRekeningScreen }