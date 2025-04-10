import { CurrencyFormatter } from "@components/curencyComponent";
import { formatThousand } from "@components/formatRibuan";
import { IconCustom } from "@components/iconCustom";
import SafeAreaCustom from "@components/safeArea";
import { db } from "@config/dbService";
import {
    AddIcon,
    Box,
    Divider,
    Fab,
    FabIcon,
    HStack,
    Text,
    View,
    VStack,
} from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { getIconLibrary } from "@screens/catatan";
import { CatatanInterface } from "@screens/catatan/dummyData";
import { GetCatatan, handleDelete, InterfaceCatatan } from "@screens/catatan/models/crudCatatan";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import Octicons from "react-native-vector-icons/Octicons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { DeleteConfirm } from "@components/modalConfirm/deleteConfirm";

const DetailCalendar = ({ route }) => {
    const navigation = useNavigation<any>();
    const [data, setData] = useState<InterfaceCatatan[]>([]);
    const [showAlertDialog, setShowAlertDialog] = React.useState(false)
    const [idToDelete, setIdToDelete] = useState<number>(0);

    const fetchData = async () => {
        try {
            const response = await GetCatatan();
            setData(response);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    const actionConfirm = async () => {
        await handleDelete(idToDelete);
        await fetchData();
        setShowAlertDialog(false);
    }

    const filteredData = data.filter((item) => item.tanggal === route.params.tanggal);

    const totalPengeluaran = filteredData
        .filter((item) => item.jenis === "pengeluaran")
        .reduce((sum, item) => sum + (item.jumlah || 0), 0);

    const totalPemasukan = filteredData
        .filter((item) => item.jenis === "pemasukan")
        .reduce((sum, item) => sum + (item.jumlah || 0), 0);

    const renderRightActions = (item) => (
        <HStack alignItems="center" ml={10}>
            <TouchableOpacity onPress={() => navigation.navigate('StackNav', { screen: 'AddScreen', params: { data: item } })}>
                <Box
                    py="$4"
                    bgColor="$amber400"
                    justifyContent="center"
                    alignItems="center"
                    width={70}
                >
                    <Text color="white">Edit</Text>
                </Box>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setIdToDelete(item.id); setShowAlertDialog(true); }}>
                <Box
                    py="$4"
                    bgColor="$rose400"
                    justifyContent="center"
                    alignItems="center"
                    width={70}
                >
                    <Text color="white">Hapus</Text>
                </Box>
            </TouchableOpacity>
        </HStack>
    );

    return (
        <SafeAreaCustom>
            {filteredData.length > 0 ?
                <View flex={1}>
                    <HStack
                        space="lg"
                        paddingHorizontal={16}
                        mt={4}
                        justifyContent="space-between"
                    >
                        <Text fontWeight="bold" color="$red600" size="xs">Pengeluaran: {formatThousand(totalPengeluaran)}</Text>
                        <Text fontWeight="bold" color="$green600" size="xs">Pemasukan: {formatThousand(totalPemasukan)}</Text>
                    </HStack>
                    <Divider my="$0.5" />
                    <View paddingHorizontal={16}>
                        <FlatList
                            data={filteredData}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item) => item?.id?.toString()}
                            renderItem={({ item }) => {
                                const IconLibrary = getIconLibrary(item.vendor || "");
                                const maxLength = 15;
                                const truncatedCatatan =
                                    item.catatan?.length && item.catatan.length > maxLength
                                        ? item.catatan.substring(0, maxLength) + "..."
                                        : item.catatan;
                                const amount = item.jumlah !== undefined && item.jumlah !== null
                                    ? item.jenis === "pengeluaran"
                                        ? -item.jumlah
                                        : item.jumlah
                                    : 0;

                                return (
                                    <Swipeable renderRightActions={() => renderRightActions(item)}>
                                        <TouchableOpacity
                                            onPress={() =>
                                                navigation.navigate("StackNav", {
                                                    screen: "CatatanDetail",
                                                    params: { data: item, back: true },
                                                })
                                            }
                                        >
                                            <Box
                                                borderBottomWidth={0.1}
                                                borderColor="$trueGray400"
                                                $dark-borderColor="$trueGray100"
                                                py="$2"
                                                bgColor="white"
                                            >
                                                <HStack
                                                    space="md"
                                                    alignItems="center"
                                                    justifyContent="space-between"
                                                >
                                                    <HStack space="md" alignItems="center">
                                                        {IconLibrary ? (
                                                            <View
                                                                padding={10}
                                                                bgColor="$yellow300"
                                                                borderRadius={"$full"}
                                                            >
                                                                <IconCustom
                                                                    As={IconLibrary}
                                                                    name={item.kategoriIcon}
                                                                    size={20}
                                                                />
                                                                {JSON.parse(item.image).length > 0 &&
                                                                    <View padding={4} bgColor="$blue200" borderRadius={'$full'} position="absolute" >
                                                                        <IconCustom
                                                                            As={Ionicons}
                                                                            name={'camera'}
                                                                            size={7} />
                                                                    </View>
                                                                }
                                                            </View>
                                                        ) : null}
                                                        <Text>{truncatedCatatan}</Text>
                                                    </HStack>
                                                    <CurrencyFormatter amount={amount} currency="IDR" />
                                                </HStack>
                                            </Box>
                                        </TouchableOpacity>
                                    </Swipeable>
                                );
                            }}
                        />
                    </View>
                </View>
                :
                <VStack alignItems="center" space="md" justifyContent="center" flex={1}>
                    <IconCustom As={Octicons} name="log" size={50} color="grey" />
                    <Text color="grey">Tidak ada catatan</Text>
                </VStack>
            }




            <DeleteConfirm showAlertDialog={showAlertDialog} setShowAlertDialog={setShowAlertDialog} title={"Apakah anda yakin akan menghapus?"} actionConfirm={actionConfirm} />


            <Fab
                size="lg"
                placement="bottom right"
                bgColor="$yellow500"
                onPress={() =>
                    navigation.navigate("StackNav", {
                        screen: "AddScreen",
                        params: { name: true },
                    })
                }
            >
                <FabIcon as={AddIcon} />
            </Fab>
        </SafeAreaCustom >
    );
};

export { DetailCalendar };
