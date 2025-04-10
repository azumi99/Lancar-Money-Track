import { IconCustom } from "@components/iconCustom";
import { DeleteConfirm } from "@components/modalConfirm/deleteConfirm";
import { ShowToast } from "@components/toast";
import { AddIcon, Box, Fab, FabIcon, HStack, Text, View } from "@gluestack-ui/themed";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { LogBox, TouchableOpacity } from "react-native";
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from "react-native-draggable-flatlist";
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import { GetKategori, handleAddHarcodeKategoriPemasukan, DeleteKategori } from "@screens/profile/detailPengaturan/pengaturanKategori/modelKategori";
import { useKategoriStorePemasukan } from "@config/store";
import React from "react";
import { KategoriInterface } from "@screens/profile/detailPengaturan/pengaturanKategori/modelKategori";
import { fetchPemasukan } from "@screens/profile/detailPengaturan/pengaturanKategori/globalGetFunctionKategori";



const SettingsPemasukan = () => {
    const { kategori, setKategori } = useKategoriStorePemasukan();
    const [showAlertDialog, setShowAlertDialog] = useState(false);
    const [keyDel, setKeyDel] = useState("");
    const navigation = useNavigation<any>();

    LogBox.ignoreLogs([
        '[Reanimated] Tried to modify key `current` of an object which has been already passed to a worklet.',
    ]);



    const handleDelete = async () => {
        const findKategori = kategori.find((cat) => cat.key === keyDel);
        try {
            await DeleteKategori(keyDel, findKategori?.active == '0' ? 1 : 0);
            fetchPemasukan({ kategori, setKategori });
            setShowAlertDialog(false);
        } catch (error) {
            ShowToast('Ada masalah');
        }
    };


    useFocusEffect(
        useCallback(() => {
            fetchPemasukan({ kategori, setKategori });
        }, [])
    );

    return (
        <>
            <DraggableFlatList
                data={[...kategori].sort((a, b) => parseInt(b.active, 10) - parseInt(a.active, 10))}
                onDragEnd={({ data }) => setKategori(data)}
                keyExtractor={(item) => item.key}
                renderItem={({ item, drag, isActive }: RenderItemParams<typeof kategori[0]>) => (
                    <ScaleDecorator>
                        <TouchableOpacity onLongPress={drag} disabled={isActive} onPress={() => navigation.navigate("StackNav", { screen: "AddKategori", params: { parameter: 'pemasukan', data: kategori.find((cat) => cat.key === item.key) }, })}>
                            <Box bgColor="white" padding={16} marginVertical={4}>
                                <HStack alignItems="center" justifyContent="space-between">
                                    <HStack alignItems="center" space="md">
                                        <TouchableOpacity onPress={() => { setKeyDel(item.key); setShowAlertDialog(true) }}>
                                            <IconCustom As={Entypo} name={item.active == '1' ? "circle-with-minus" : "plus"} size={27} color={item.active == '1' ? "red" : "green"} />
                                        </TouchableOpacity>
                                        <IconCustom As={Ionicons} name={item.kategoriIcon} size={27} color="#fde047" />
                                        <Text>{item.title}</Text>
                                    </HStack>
                                    <IconCustom As={Ionicons} name="reorder-four-outline" size={25} />
                                </HStack>
                            </Box>
                        </TouchableOpacity>
                    </ScaleDecorator>
                )}
            />
            <Fab
                size="lg"
                placement="bottom right"
                bgColor="$yellow500"
                onPress={() => navigation.navigate("StackNav", { screen: "AddKategori", params: { parameter: "pemasukan" } })}
            >
                <FabIcon as={AddIcon} />
            </Fab>
            <DeleteConfirm showAlertDialog={showAlertDialog} setShowAlertDialog={setShowAlertDialog} title="Apakah anda yakin akan menghapus?" actionConfirm={handleDelete} />
        </>
    );
};

export { SettingsPemasukan };
