import { IconCustom } from "@components/iconCustom"
import SafeAreaCustom from "@components/safeArea"
import { Box, Button, ButtonText, Divider, Heading, HStack, ScrollView, StatusBar, Text, View, VStack } from "@gluestack-ui/themed"
import Ionicons from "react-native-vector-icons/Ionicons"
import React, { useCallback, useEffect, useState } from "react"
import { TextHeading } from "@components/textHeading"
import { TouchableOpacity, FlatList } from "react-native"
import { useIsFocused, useNavigation } from "@react-navigation/native"
import { CatatanInterface, catatanPengeluaran } from "./dummyData"
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Entypo from "react-native-vector-icons/Entypo";
import { CurrencyFormatter } from "@components/curencyComponent"
import { ModalCustom } from "@components/modalComponent";
import MonthPicker from 'react-native-month-picker';
import moment from "moment"
import { AddCatatan, CreateTableCatatan, GetCatatan, GetLastId } from "@screens/catatan/models/crudCatatan"
import { Swipeable } from "react-native-gesture-handler"
import { db } from "@config/dbService"

export const getIconLibrary = (library: string) => {
    switch (library) {
        case 'FontAwesome':
            return FontAwesome;
        case 'MaterialCommunityIcons':
            return MaterialCommunityIcons;
        case 'Entypo':
            return Entypo;
        default:
            return null;
    }
};





const CatatanScreen = () => {
    const isFocused = useIsFocused();
    const navigation = useNavigation<any>();
    const [data, setData] = useState<CatatanInterface[]>([]);
    const [date, setDate] = useState(new Date());
    const [showModal, setShowModal] = useState(false)

    const year = date.getFullYear();
    const shortMonth = date.toLocaleString('default', { month: 'short' });
    const longMonth = date.toLocaleString('default', { month: 'long' });

    const filterDataByDate = () => {
        const targetYear = date.getFullYear();
        const targetMonth = date.getMonth();
        return data.filter((item: any) => {
            const itemDate = new Date(item?.tanggal);
            const itemYear = itemDate.getFullYear();
            const itemMonth = itemDate.getMonth();

            return itemYear === targetYear && itemMonth === targetMonth;
        });
    };

    const totalPengeluaran = filterDataByDate()
        .filter(item => item.jenis === 'Pengeluaran')
        .reduce((sum, item) => sum + (item.jumlah || 0), 0);

    const totalPemasukan = filterDataByDate()
        .filter(item => item.jenis === 'Pemasukan')
        .reduce((sum, item) => sum + (item.jumlah || 0), 0);

    const saldo = totalPemasukan - totalPengeluaran;


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
            await CreateTableCatatan();
            const response = await GetCatatan();
            setData(response);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {

        fetchData();
    }, [])

    const handleAddHardcodedCatatan = async () => {
        try {
            const lastId = Number(await GetLastId());
            const newId = lastId + 1;
            AddCatatan(
                newId,
                "Pengeluaran",
                50000,
                "2024-12-11",
                "Beli Makan Siang",
                2,
                "cutlery",
                "FontAwesome"
            );
            fetchData();
        } catch (error) {
            console.error("Error saat menambahkan data:", error);
        }

    }


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
            <VStack paddingHorizontal={16} bgColor="$yellow300">
                <View paddingVertical={10}>
                    <VStack space="md">
                        <HStack justifyContent="space-between">
                            <TouchableOpacity>
                                <IconCustom As={Ionicons} size={25} name="search" />
                            </TouchableOpacity>
                            <TextHeading style={{ color: 'black' }}>Pengelola Keuangan</TextHeading>
                            <TouchableOpacity onPress={() => navigation.navigate('StackNav', { screen: 'CalendarScreen' })}>
                                <IconCustom As={Ionicons} size={25} name="calendar-outline" />
                            </TouchableOpacity>
                        </HStack>
                        <VStack>
                            <HStack>
                                <HStack space="md">
                                    <TouchableOpacity onPress={() => setShowModal(true)}>
                                        <VStack>
                                            <TextHeading>{year}</TextHeading>
                                            <HStack alignItems="center">
                                                <TextHeading style={{ color: 'black', fontSize: 25 }}>{shortMonth}</TextHeading>
                                                <IconCustom As={Ionicons} size={20} name="chevron-down-outline" />
                                            </HStack>
                                        </VStack>
                                    </TouchableOpacity>
                                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: '20%' }}>
                                        <HStack space="md">
                                            <VStack space="sm" >
                                                <TextHeading>Pengeluaran</TextHeading>
                                                <Text color="black" size={'lg'}>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalPengeluaran)}</Text>
                                            </VStack>
                                            <VStack space="sm">
                                                <TextHeading>Pemasukan</TextHeading>
                                                <Text color="black" size={'lg'}> {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalPemasukan)}</Text>
                                            </VStack>
                                            <VStack space="sm">
                                                <TextHeading>Saldo</TextHeading>
                                                <Text color="black" size={'lg'}>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(saldo)}</Text>
                                            </VStack>
                                        </HStack>
                                    </ScrollView>
                                </HStack>
                            </HStack>
                        </VStack>
                    </VStack>

                </View>
            </VStack>
            <ModalCustom showModal={showModal} setShowModal={setShowModal} showHeader={true} showFooter={true}
                footer={
                    <HStack alignItems="center" space="md" >
                        <Button onPress={() => { setShowModal(false); setDate(new Date()) }} size="sm" borderRadius={10} action="negative" >
                            <ButtonText>Batalkan</ButtonText>
                        </Button>
                        <Button onPress={() => setShowModal(false)} size="sm" borderRadius={10} >
                            <ButtonText>Konfirmasi</ButtonText>
                        </Button>
                    </HStack>
                }
                title={`${longMonth} ${year}`}
                styleHeader={{ alignSelf: 'center' }}
            >
                <MonthPicker
                    selectedDate={date}
                    onMonthChange={(date) => setDate(new Date(date))}
                    maxDate={moment()}
                    minDate={moment('01-01-2010', 'DD-MM-YYYY')}
                    currentMonthTextStyle={{ color: '#eab308' }}
                    selectedBackgroundColor={'#eab308'}
                    nextIcon={<IconCustom As={MaterialCommunityIcons} name="chevron-right" size={25} color="#eab308" />}
                    prevIcon={<IconCustom As={MaterialCommunityIcons} name="chevron-left" size={25} color="#eab308" />}
                />
            </ModalCustom>
            <VStack paddingHorizontal={16} paddingVertical={5}>
                <HStack justifyContent="space-between" alignItems="center">
                    <HStack space="md" alignItems="center">
                        <Text size="sm">28 Okt</Text>
                        <Text size="sm">Senin</Text>
                    </HStack>
                    <Text size="sm">-: <CurrencyFormatter amount={totalPengeluaran} currency="IDR" /> </Text>
                </HStack>
            </VStack>
            <Divider my="$0.5" />
            <View flex={1} >
                <Box paddingHorizontal={16} >
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
                                    <TouchableOpacity onPress={() => navigation.navigate('StackNav', { screen: 'CatatanDetail', params: { data: item } })}>
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
                </Box>
            </View>

        </SafeAreaCustom>
    )
}

export { CatatanScreen };