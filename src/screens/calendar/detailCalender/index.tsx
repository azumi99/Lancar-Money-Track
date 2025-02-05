import { CurrencyFormatter } from "@components/curencyComponent"
import { IconCustom } from "@components/iconCustom"
import SafeAreaCustom from "@components/safeArea"
import { db } from "@config/dbService"
import { AddIcon, Box, Divider, Fab, FabIcon, HStack, Text, View, VStack } from "@gluestack-ui/themed"
import { useNavigation } from "@react-navigation/native"
import { getIconLibrary } from "@screens/catatan"
import { CatatanInterface } from "@screens/catatan/dummyData"
import { CreateTableCatatan, GetCatatan } from "@screens/catatan/models/crudCatatan"
import React, { useCallback, useEffect, useState } from "react"
import { FlatList, TouchableOpacity } from "react-native"
import { Swipeable } from "react-native-gesture-handler"
import Octicons from "react-native-vector-icons/Octicons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

const DetailCalendar = ({ route }) => {
    const navigation = useNavigation<any>();
    const [data, setData] = useState<CatatanInterface[]>([]);

    const handleDelete = useCallback(async (id) => {
        try {
            await db.transaction(tx => {
                tx.executeSql(
                    'DELETE FROM catatan WHERE id = ?',
                    [id],
                    (_, result) => {
                        if (result.rowsAffected > 0) {
                            setData(prevData => prevData.filter(item => item.id !== id));
                        }
                    },
                    error => {
                        console.error('Error deleting data:', error);
                    }
                );
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }, []);
    const fetchData = async () => {
        try {
            const response = await GetCatatan();
            setData(response);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const filterDataByDate = () => {
        return data.filter(item => item.tanggal === route.params.tanggal);
    };
    useEffect(() => {
        fetchData();

    }, [])

    const totalPengeluaran = filterDataByDate()
        .filter(item => item.jenis === 'Pengeluaran')
        .reduce((sum, item) => sum + (item.jumlah || 0), 0);

    const totalPemasukan = filterDataByDate()
        .filter(item => item.jenis === 'Pemasukan')
        .reduce((sum, item) => sum + (item.jumlah || 0), 0);

    const renderRightActions = (item) => (
        <HStack alignItems="center" ml={10}>
            <TouchableOpacity >
                <Box py="$4" bgColor="$amber400" justifyContent="center" alignItems="center" width={70} >
                    <Text color="white">Edit</Text>
                </Box>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item.id)} >
                <Box py="$4" bgColor="$rose400" justifyContent="center" alignItems="center" width={70} >
                    <Text color="white">Hapus</Text>
                </Box>
            </TouchableOpacity>
        </HStack>
    );
    return (
        <SafeAreaCustom>
            <View >
                {filterDataByDate().length > 0 ?
                    <View>
                        <HStack alignItems="center" space="md" paddingHorizontal={16} mt={4}>
                            <Text>-: <CurrencyFormatter amount={totalPengeluaran} /> </Text>
                            <Text>+: <CurrencyFormatter amount={totalPemasukan} /></Text>
                        </HStack>
                        <Divider my={'$0.5'} />
                        <View paddingHorizontal={16} >
                            <FlatList
                                data={filterDataByDate()}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) => {
                                    const IconLibrary = getIconLibrary(item.iconLibrary || '');
                                    const maxLength = 15;
                                    const truncatedCatatan = item.catatan?.length && item.catatan.length > maxLength
                                        ? item.catatan.substring(0, maxLength) + "..."
                                        : item.catatan;
                                    const amount = item.jumlah !== undefined && item.jumlah !== null
                                        ? (item.jenis === 'Pengeluaran' ? -item.jumlah : item.jumlah)
                                        : 0;

                                    return (
                                        <Swipeable
                                            renderRightActions={() => renderRightActions(item)}
                                        >
                                            <TouchableOpacity onPress={() => navigation.navigate('StackNav', { screen: 'CatatanDetail', params: { data: item, back: true } })}>
                                                <Box
                                                    borderBottomWidth={0.1}
                                                    borderColor="$trueGray400"
                                                    $dark-borderColor="$trueGray100"
                                                    py="$2"
                                                    bgColor="white"
                                                >
                                                    <HStack space="md" alignItems="center" justifyContent="space-between">
                                                        <HStack space="md" alignItems="center">
                                                            {IconLibrary ? (
                                                                <View padding={13} bgColor="$yellow300" borderRadius={'$full'}>
                                                                    <IconCustom
                                                                        As={IconLibrary}
                                                                        name={item.iconName}
                                                                        size={15}
                                                                    />
                                                                </View>
                                                            ) : null}
                                                            <Text>{truncatedCatatan}</Text>
                                                        </HStack>
                                                        <CurrencyFormatter
                                                            amount={amount}
                                                            currency="IDR"
                                                        />
                                                    </HStack>
                                                </Box>
                                            </TouchableOpacity>
                                        </Swipeable>
                                    );
                                }}
                                keyExtractor={(item) => item?.id}
                            />
                        </View>
                    </View> :
                    <VStack alignItems="center" space="md" justifyContent="center" flex={1}>
                        <IconCustom As={Octicons} name="log" size={50} color="grey" />
                        <Text color="grey">Tidak ada catatan</Text>
                    </VStack>
                }

            </View>
            <Fab
                size="lg"
                placement="bottom right"
                bgColor="$yellow500"
                onPress={() => navigation.navigate('StackNav', { screen: 'AddScreen', params: { name: true } })}
            >
                <FabIcon as={AddIcon} />
            </Fab>
        </SafeAreaCustom>
    )
}

export { DetailCalendar };