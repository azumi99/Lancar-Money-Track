import { IconCustom } from "@components/iconCustom";
import { InputDefault } from "@components/input/inputDefault";
import SafeAreaCustom from "@components/safeArea"
import { Box, HStack, Text, View, VStack } from "@gluestack-ui/themed"
import React, { useEffect, useState } from "react"
import { FlatList, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"
import { groupedIcons } from "./dataIconStatis";
import { TextHeading } from "@components/textHeading";
import { GetKategori, IdKategori, InsertKategori, UpdateKategori } from "@screens/profile/detailPengaturan/pengaturanKategori/modelKategori";
import { ShowToast } from "@components/toast";
import { SaveKategori } from "@config/store";
import { useNavigation } from "@react-navigation/native";



const AddKategori = ({ route }) => {
    // console.log(route.params?.data)
    const navigation = useNavigation<any>();
    const [active, setActive] = useState(route.params.parameter);
    const [kategoriName, setKategoriName] = useState(route.params?.data ? route.params.data.title : "");
    const filterUpdateIcon = Object.values(groupedIcons)
        .flat()
        .find((icon) => icon.kategoriIcon === route.params?.data?.kategoriIcon);
    const [selectedIndex, setSelectedIndex] = useState<string>(route.params?.data ? filterUpdateIcon?.key as string : "2");
    const { saveKategori, setSaveKategori } = SaveKategori();
    const filteredIcons = Object.values(groupedIcons)
        .flat()
        .find((icon) => icon.key === selectedIndex);

    const handleSaveKategori = async () => {
        try {
            const result = await IdKategori();
            if (!route.params?.data) {
                await InsertKategori(result + 1, kategoriName, filteredIcons?.kategoriIcon, "Ionicons", "0", active);
                ShowToast(`Kategori ${kategoriName} ditambahkan`);
            } else {
                await UpdateKategori(route.params.data.key, kategoriName, filteredIcons?.kategoriIcon, "Ionicons", "0", active);
                ShowToast(`Kategori ${kategoriName} diperbarui`);
            }

            setSaveKategori(false);
            await GetKategori(route.params.parameter);
            navigation.navigate('StackNav', { screen: 'KategoriSettings' });
        } catch (error) {
            ShowToast('Ada masalah');
        }
    };

    useEffect(() => {
        saveKategori && kategoriName.length > 1 && handleSaveKategori();
    }, [saveKategori])

    return (
        <SafeAreaCustom>
            <VStack paddingHorizontal={16} paddingVertical={16} space="md">
                <HStack alignSelf="center" >
                    <TouchableOpacity onPress={() => setActive("pengeluaran")}>
                        <Box
                            bgColor={active === "pengeluaran" ? "$black" : "$yellow300"}
                            padding={10}
                            borderTopLeftRadius={5}
                            borderBottomLeftRadius={5}
                            alignItems="center"
                        >
                            <Text color={active === "pengeluaran" ? "$white" : "$black"}>Pengeluaran</Text>
                        </Box>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setActive("pemasukan")}>
                        <Box
                            bgColor={active === "pemasukan" ? "$black" : "$yellow300"}
                            padding={10}
                            borderTopRightRadius={5}
                            borderBottomRightRadius={5}
                            alignItems="center"
                        >
                            <Text color={active === "pemasukan" ? "$white" : "$black"}>Pemasukan</Text>
                        </Box>
                    </TouchableOpacity>
                </HStack>
                <HStack alignItems="center" space="md" maxWidth={'85%'}>
                    <View alignItems="center" mt={6}>
                        <Box bgColor="$yellow300" borderRadius={50} padding={10} mb={5}>
                            <IconCustom As={Ionicons} name={filteredIcons?.kategoriIcon} size={20} />
                        </Box>
                    </View>
                    <Box bgColor="$secondary100" width={'100%'} padding={5} borderRadius={10}>
                        <InputDefault value={kategoriName} placeHolder="Masukan nama kategori" changeText={(value) => setKategoriName(value)} variant={'outline'} borderColor="transparent" />
                    </Box>
                </HStack>
            </VStack>
            <FlatList
                data={groupedIcons ? Object.entries(groupedIcons) : []}
                keyExtractor={([category]) => category}
                renderItem={({ item }) => {
                    const [category, icons] = item;
                    return (
                        <VStack space="sm" >
                            <TextHeading style={{ textAlign: "center", marginTop: 20 }}>{category}</TextHeading>
                            <FlatList
                                data={icons}
                                keyExtractor={(icon) => icon.key}
                                numColumns={6}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => setSelectedIndex(item.key)}
                                        style={{
                                            alignItems: 'center',
                                            width: '16.66%',
                                            justifyContent: 'center',
                                            paddingVertical: 10,
                                        }}
                                    >
                                        <Box
                                            bgColor={selectedIndex === item.key ? "$yellow300" : "$secondary100"}
                                            padding={10}
                                            borderRadius={50}
                                            mb={5}
                                        >
                                            <IconCustom
                                                As={item.vendor}
                                                name={item.kategoriIcon}
                                                size={20}
                                                color="black"
                                            />
                                        </Box>
                                    </TouchableOpacity>
                                )}
                                contentContainerStyle={{ paddingHorizontal: 5 }}
                            />
                        </VStack>
                    );
                }}
            />

        </SafeAreaCustom>
    )
}

export { AddKategori }