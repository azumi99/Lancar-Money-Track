import { IconCustom } from "@components/iconCustom"
import SafeAreaCustom from "@components/safeArea"
import { AddIcon, Box, Fab, FabIcon, HStack, Text, View } from "@gluestack-ui/themed"
import React, { useCallback, useEffect, useState } from "react"
import { LogBox, TouchableOpacity } from "react-native"
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from "react-native-draggable-flatlist"
import Ionicons from "react-native-vector-icons/Ionicons"
import Entypo from "react-native-vector-icons/Entypo"
import { useRekeningData } from "@config/store"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { fetchRekening } from "./globalFuncGetRekening"
import { DeleteConfirm } from "@components/modalConfirm/deleteConfirm"
import { CheckRekeningUsage, DeleteRekening, UpdateIsDefaultRekening } from "./modelRekening"
import { ShowToast } from "@components/toast"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

const RekeningScreen = () => {
    const { rekening, setRekening } = useRekeningData();
    const [showAlertDialog, setShowAlertDialog] = useState(false);
    const [keyDel, setKeyDel] = useState<number | undefined>(0);
    const navigation = useNavigation<any>();
    LogBox.ignoreLogs([
        '[Reanimated] Tried to modify key `current` of an object which has been already passed to a worklet.',
    ]);

    const handleDelete = async () => {
        try {
            const used = await CheckRekeningUsage(keyDel);
            if (used) {
                ShowToast('Rekening sedang digunakan dalam catatan');
                return;
            } else {
                await DeleteRekening(keyDel);
                fetchRekening({ rekening, setRekening });
                setShowAlertDialog(false);
            }

        } catch (error) {
            ShowToast('Ada masalah');
        }
    };
    const handleSetDefault = async (key: number) => {
        try {
            await UpdateIsDefaultRekening(key);
            fetchRekening({ rekening, setRekening });
        } catch (error) {
            ShowToast("Gagal memperbarui rekening default");
        }
    };
    useFocusEffect(
        useCallback(() => {
            fetchRekening({ rekening, setRekening });
        }, [])
    );
    return (
        <SafeAreaCustom>
            {rekening.length > 0 ?
                <DraggableFlatList
                    data={rekening}
                    onDragEnd={({ data }) => setRekening(data)}
                    keyExtractor={(item) => String(item.key)}
                    renderItem={({ item, drag, isActive }: RenderItemParams<typeof rekening[0]>) => (
                        <ScaleDecorator>
                            <TouchableOpacity onLongPress={drag} disabled={isActive} onPress={() => navigation.navigate('StackNav', { screen: "AddRekeningScreen", params: { id: item.key } })} >
                                <Box bgColor="white" padding={16} marginVertical={4}>
                                    <HStack alignItems="center" justifyContent="space-between">
                                        <HStack alignItems="center" space="md">
                                            <TouchableOpacity onPress={() => { setKeyDel(item?.key); setShowAlertDialog(true) }}>
                                                <IconCustom As={Entypo} name="circle-with-minus" size={27} color="red" />
                                            </TouchableOpacity>
                                            <Box bgColor="$yellow300" padding={5} borderRadius={10}>
                                                <IconCustom As={Ionicons} name={item.iconname} size={20} />
                                            </Box>
                                            <Text>{item.name}</Text>
                                        </HStack>
                                        <HStack alignItems="center" space="xs">
                                            <TouchableOpacity onPress={() => handleSetDefault(item.key ?? 0)}>
                                                <IconCustom As={MaterialCommunityIcons} name="pin" size={25} color={item.is_default ? "#fde047" : '#aaa'} />
                                            </TouchableOpacity>
                                            <IconCustom As={Ionicons} name="reorder-four-outline" size={25} />
                                        </HStack>
                                    </HStack>
                                </Box>
                            </TouchableOpacity>
                        </ScaleDecorator>
                    )}
                />
                : <View alignItems="center" justifyContent="center" flex={1}>
                    <Text>Belum ada data</Text>
                </View>}

            <Fab
                size="lg"
                placement="bottom right"
                bgColor="$yellow500"
                onPress={() => navigation.navigate("StackNav", { screen: "AddRekeningScreen" })}
            >
                <FabIcon as={AddIcon} />
            </Fab>
            <DeleteConfirm showAlertDialog={showAlertDialog} setShowAlertDialog={setShowAlertDialog} title="Apakah anda yakin akan menghapus?" actionConfirm={handleDelete} />
        </SafeAreaCustom>
    )
}

export { RekeningScreen }