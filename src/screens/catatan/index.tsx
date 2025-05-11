import { IconCustom } from "@components/iconCustom"
import SafeAreaCustom from "@components/safeArea"
import { Box, Button, ButtonText, Divider, GlobeIcon, HStack, Icon, Menu, MenuItem, MenuItemLabel, RefreshControl, ScrollView, Text, View, VStack } from "@gluestack-ui/themed"
import Ionicons from "react-native-vector-icons/Ionicons"
import React, { useCallback, useRef, useState } from "react"
import { TextHeading } from "@components/textHeading"
import { TouchableOpacity, FlatList, Dimensions } from "react-native"
import { useFocusEffect, useIsFocused, useNavigation } from "@react-navigation/native"
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Entypo from "react-native-vector-icons/Entypo";
import { ModalCustom } from "@components/modalComponent";
import MonthPicker from 'react-native-month-picker';
import moment from "moment"
import { GetCatatan, handleDelete, InterfaceCatatan } from "@screens/catatan/models/crudCatatan"
import { Swipeable } from "react-native-gesture-handler"
import { formatThousand } from "@components/formatRibuan"
import { useCurrency, useRekeningData } from "@config/store"
import { DeleteConfirm } from "@components/modalConfirm/deleteConfirm"
import { playBeep } from "@utils/soundUtils"

export const getIconLibrary = (library: string) => {
    switch (library) {
        case 'FontAwesome':
            return FontAwesome;
        case 'MaterialCommunityIcons':
            return MaterialCommunityIcons;
        case 'Entypo':
            return Entypo;
        case 'Ionicons':
            return Ionicons;
        default:
            return null;
    }
};


const CatatanScreen = () => {
    const isFocused = useIsFocused();
    const navigation = useNavigation<any>();
    const { width } = Dimensions.get('window');
    const [data, setData] = useState<InterfaceCatatan[]>([]);
    const [date, setDate] = useState(new Date());
    const [showModal, setShowModal] = useState(false)
    const { rekening } = useRekeningData();
    const [showAlertDialog, setShowAlertDialog] = React.useState(false)
    const [idToDelete, setIdToDelete] = useState<number>(0);
    const { currency } = useCurrency();
    const [refreshing, setRefreshing] = useState(false)
    const defaultCurrency = currency.find((item) => item.is_default);


    const year = date.getFullYear();
    const shortMonth = date.toLocaleString('default', { month: 'short' });
    const longMonth = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate();
    const namaHari = new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(date);

    interface GroupedCatatan {
        tanggal: string;
        data: InterfaceCatatan[];
        totalMinus: number;
        totalPlus: number;
    }

    const filterDataByDate = (): GroupedCatatan[] => {
        const targetYear = date.getFullYear();
        const targetMonth = date.getMonth();


        const grouped: Record<string, GroupedCatatan> = {};

        data.forEach((item) => {
            const itemDate = new Date(item.tanggal);
            if (itemDate.getFullYear() === targetYear && itemDate.getMonth() === targetMonth) {
                const tanggal = itemDate.toISOString().split('T')[0];

                if (!grouped[tanggal]) {
                    grouped[tanggal] = {
                        tanggal,
                        data: [],
                        totalMinus: 0,
                        totalPlus: 0,
                    };
                }

                grouped[tanggal].data.push(item);

                if (item.jenis === 'pemasukan') {
                    grouped[tanggal].totalPlus += item.jumlah || 0;
                } else if (item.jenis === 'pengeluaran') {
                    grouped[tanggal].totalMinus += item.jumlah || 0;
                }
            }
        });

        return Object.values(grouped).sort(
            (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
        );
    };

    const calculateMonthlyTotal = () => {
        const targetYear = date.getFullYear();
        const targetMonth = date.getMonth();

        let pemasukan = 0;
        let pengeluaran = 0;

        data.forEach((item) => {
            const itemDate = new Date(item?.tanggal as string);
            if (itemDate.getFullYear() === targetYear && itemDate.getMonth() === targetMonth) {
                const jumlah = item.jumlah || 0;
                if (item.jenis === 'pemasukan') pemasukan += jumlah;
                else if (item.jenis === 'pengeluaran') pengeluaran += jumlah;
            }
        });

        return {
            pemasukan,
            pengeluaran,
            saldo: pemasukan - pengeluaran,
        };
    };

    const { pemasukan: totalPemasukan, pengeluaran: totalPengeluaran, saldo } = calculateMonthlyTotal();
    const swipeRefs = useRef<{ [key: string]: Swipeable | null }>({});
    const fetchData = async () => {
        try {
            setRefreshing(true)
            const response = await GetCatatan();
            setData(response);
            Object.values(swipeRefs.current).forEach(ref => {
                if (ref && ref.close) {
                    ref.close();
                }
            });
            setRefreshing(false)
        } catch (error) {
            console.error('Error:', error);
            setRefreshing(false)
        }
    };
    const actionConfirm = async () => {
        await handleDelete(idToDelete);
        await fetchData();
        setShowAlertDialog(false);
    }

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, []),
    );



    const renderRightActions = (item) => (
        <HStack alignItems="center" ml={10}>
            <TouchableOpacity onPress={() => { playBeep(); navigation.navigate('StackNav', { screen: 'AddScreen', params: { data: item } }) }}>
                <Box py="100%" bgColor="$amber400" justifyContent="center" alignItems="center" width={70} >
                    <Text color="white">Edit</Text>
                </Box>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { playBeep(); setIdToDelete(item.id); setShowAlertDialog(true); }} >
                <Box py="100%" bgColor="$rose400" justifyContent="center" alignItems="center" width={70} >
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
                            <HStack width={"20%"}>
                                <Menu
                                    width={width}
                                    paddingHorizontal={10}
                                    placement="bottom"
                                    trigger={({ ...triggerProps }) => {
                                        return (
                                            <TouchableOpacity {...triggerProps} >
                                                <IconCustom As={Ionicons} size={25} name="list" />
                                            </TouchableOpacity>
                                        )
                                    }}
                                >

                                    <MenuItem onPress={() => navigation.navigate('StackNav', { screen: 'ReminderScreen' })} key="Pengingat" textValue="Pengingat">
                                        <HStack space="lg">
                                            <IconCustom color="#eab308" As={Ionicons} name="notifications-outline" size={20} />
                                            <MenuItemLabel size="sm">Pengingat</MenuItemLabel>
                                        </HStack>
                                    </MenuItem>

                                    <MenuItem onPress={() => navigation.navigate('StackNav', { screen: 'AnggaranScreen' })} key="Anggaran" textValue="Anggaran">
                                        <HStack space="lg">
                                            <IconCustom color="#eab308" As={Ionicons} name="wallet-outline" size={20} />
                                            <MenuItemLabel size="sm">Anggaran</MenuItemLabel>
                                        </HStack>
                                    </MenuItem>

                                    <MenuItem onPress={() => navigation.navigate('StackNav', { screen: 'PembayaranScreen' })} key="Pembayaran" textValue="Pembayaran">
                                        <HStack space="lg">
                                            <IconCustom color="#eab308" As={Ionicons} name="card-outline" size={20} />
                                            <MenuItemLabel size="sm">Pembayaran</MenuItemLabel>
                                        </HStack>
                                    </MenuItem>

                                    <MenuItem onPress={() => navigation.navigate('StackNav', { screen: 'WaktuLaporanScreen' })} key="TanggalMulaiBulanan" textValue="Tanggal Mulai Bulanan">
                                        <HStack space="lg">
                                            <IconCustom color="#eab308" As={Ionicons} name="calendar-outline" size={20} />
                                            <MenuItemLabel size="sm">Tanggal Mulai Bulanan</MenuItemLabel>
                                        </HStack>
                                    </MenuItem>

                                    <MenuItem onPress={() => navigation.navigate('StackNav', { screen: 'ResetCacheScreen' })} key="HapusSemuaData" textValue="Hapus semua Data">
                                        <HStack space="lg">
                                            <IconCustom color="#eab308" As={Ionicons} name="trash-outline" size={20} />
                                            <MenuItemLabel size="sm">Hapus Cache</MenuItemLabel>
                                        </HStack>
                                    </MenuItem>

                                    <MenuItem onPress={() => navigation.navigate('StackNav', { screen: 'EksporScreen' })} key="EksportData" textValue="Eksport Data">
                                        <HStack space="lg">
                                            <IconCustom color="#eab308" As={Ionicons} name="download-outline" size={20} />
                                            <MenuItemLabel size="sm">Eksport Data</MenuItemLabel>
                                        </HStack>
                                    </MenuItem>

                                    <MenuItem onPress={() => navigation.navigate('StackNav', { screen: 'BackupScreen' })} key="Backup" textValue="Backup">
                                        <HStack space="lg">
                                            <IconCustom color="#eab308" As={Ionicons} name="cloud-upload-outline" size={20} />
                                            <MenuItemLabel size="sm">Backup</MenuItemLabel>
                                        </HStack>
                                    </MenuItem>

                                </Menu>

                            </HStack>
                            <TextHeading style={{ color: 'black', textAlign: 'center' }}>Pengelola Keuangan</TextHeading>
                            <HStack alignItems="center" space="lg" width={"20%"}>
                                <TouchableOpacity onPress={() => { playBeep(); navigation.navigate('StackNav', { screen: 'SearchMainScreen' }) }}>
                                    <IconCustom As={Ionicons} size={25} name="search" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { playBeep(); navigation.navigate('StackNav', { screen: 'CalendarScreen' }) }}>
                                    <IconCustom As={Ionicons} size={25} name="calendar-outline" />
                                </TouchableOpacity>
                            </HStack>

                        </HStack>
                        <VStack>
                            <HStack>
                                <HStack space="md">
                                    <TouchableOpacity onPress={() => { playBeep(); setShowModal(true) }}>
                                        <VStack>
                                            <Text size="sm">{year}</Text>
                                            <HStack alignItems="center">
                                                <Text style={{ color: 'black', fontSize: 25 }}>{shortMonth}</Text>
                                                <IconCustom As={Ionicons} size={20} name="chevron-down-outline" />
                                            </HStack>
                                        </VStack>
                                    </TouchableOpacity>
                                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: '20%' }}>
                                        <HStack space="md">
                                            <VStack space="sm" >
                                                <Text size="sm">Pengeluaran</Text>
                                                <Text color="black" size={'lg'}>{formatThousand(totalPengeluaran)}</Text>
                                            </VStack>
                                            <VStack space="sm">
                                                <Text size="sm">Pemasukan</Text>
                                                <Text color="black" size={'lg'}> {formatThousand(totalPemasukan)}</Text>
                                            </VStack>
                                            <VStack space="sm">
                                                <Text size="sm">Saldo</Text>
                                                <Text color="black" size={'lg'}>{formatThousand(saldo)}</Text>
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


            <View flex={1} marginVertical={10}>
                <Box paddingHorizontal={16} >
                    <FlatList
                        data={filterDataByDate()}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={fetchData}
                            />
                        }
                        keyExtractor={(item) => item.tanggal}
                        renderItem={({ item }) => (
                            <Box mb="$4">
                                <HStack alignItems="center" justifyContent="space-between" paddingVertical={5} paddingLeft={-50}>
                                    <TextHeading size="xs">
                                        {new Date(item.tanggal).toLocaleDateString('id-ID', {
                                            weekday: 'long',
                                            day: 'numeric',
                                            month: 'short',
                                        })}
                                    </TextHeading>

                                    <HStack alignItems="center" space="md" >
                                        {item.totalPlus > 0 && <TextHeading size="xs">+: {formatThousand(item.totalPlus)}</TextHeading>}
                                        {item.totalMinus > 0 && <TextHeading size="xs">-: {formatThousand(item.totalMinus)}</TextHeading>}
                                    </HStack>
                                </HStack>

                                <Divider my="$0.5" paddingLeft={-50} />

                                {item.data.map((itemData) => {

                                    const IconLibrary = getIconLibrary(itemData.vendor || '');
                                    const maxLength = 15;
                                    const truncatedCatatan = itemData.catatan?.length > maxLength
                                        ? itemData.catatan.substring(0, maxLength) + "..."
                                        : itemData.catatan;
                                    const rekeningFrom = rekening.find((rek) => rek.key === itemData.id_rekening);
                                    const rekeningTo = rekening.find((rek) => rek.key === itemData.id_rekening_tf);
                                    const currencyData = currency.find((item) => item.short_code === itemData.matauang);


                                    const amount = itemData.jumlah !== undefined && itemData.jumlah !== null
                                        ? (itemData.jenis === 'pengeluaran' ? -itemData.jumlah : itemData.jumlah)
                                        : 0;

                                    return (
                                        <Swipeable
                                            key={itemData.id}
                                            ref={(ref) => {
                                                if (ref && itemData.id) {
                                                    swipeRefs.current[itemData.id] = ref;
                                                }
                                            }}
                                            renderRightActions={() => renderRightActions(itemData)}
                                        >
                                            <TouchableOpacity onPress={() => { playBeep(); navigation.navigate('StackNav', { screen: 'CatatanDetail', params: { data: itemData } }) }}>
                                                <Box
                                                    borderBottomWidth={0.1}
                                                    borderColor="$trueGray400"
                                                    $dark-borderColor="$trueGray100"
                                                    py="$3"
                                                    bgColor="white"
                                                >
                                                    <HStack space="md" alignItems="center" justifyContent="space-between">
                                                        <HStack space="md" alignItems="center">
                                                            {IconLibrary ? (

                                                                <View padding={13} bgColor="$yellow300" borderRadius={'$full'}>
                                                                    <IconCustom
                                                                        As={IconLibrary}
                                                                        name={itemData.kategoriIcon}
                                                                        size={15} />

                                                                    {JSON.parse(itemData?.image).length > 0 &&
                                                                        <View padding={4} bgColor="$blue200" borderRadius={'$full'} position="absolute" >
                                                                            <IconCustom
                                                                                As={Ionicons}
                                                                                name={'camera'}
                                                                                size={7} />
                                                                        </View>
                                                                    }
                                                                </View>


                                                            ) : itemData.jenis === "transfer" ?
                                                                <View padding={13} bgColor="$yellow300" borderRadius={'$full'}>
                                                                    <IconCustom
                                                                        As={Ionicons}
                                                                        name={'repeat-outline'}
                                                                        size={15} />

                                                                    {JSON.parse(itemData.image).length > 0 &&
                                                                        <View padding={4} bgColor="$blue200" borderRadius={'$full'} position="absolute" >
                                                                            <IconCustom
                                                                                As={Ionicons}
                                                                                name={'camera'}
                                                                                size={7} />
                                                                        </View>
                                                                    }
                                                                </View>
                                                                : null}
                                                            <Text size="sm">
                                                                {itemData.jenis === "transfer"
                                                                    ? (() => {
                                                                        const separator = " 💸 ";
                                                                        const maxLength = 15;
                                                                        const sepLength = separator.length;
                                                                        const ellipsis = "...";
                                                                        const availableLength = maxLength - sepLength;

                                                                        const fromName = rekeningFrom?.name || "";
                                                                        const toName = rekeningTo?.name || "";

                                                                        let from = fromName;
                                                                        let to = toName;

                                                                        if ((from + to).length > availableLength) {
                                                                            const half = Math.floor((availableLength - ellipsis.length) / 2);
                                                                            from = from.slice(0, half) + ellipsis;
                                                                            to = to.slice(0, half) + ellipsis;
                                                                        }

                                                                        return `${from}${separator}${to}`;
                                                                    })()
                                                                    : truncatedCatatan}
                                                            </Text>

                                                        </HStack>
                                                        <VStack alignItems="flex-end">
                                                            <Text size="sm"> {formatThousand(amount)}</Text>
                                                            {defaultCurrency?.short_code !== itemData.matauang && <Text italic size="xs">({defaultCurrency?.short_code} {formatThousand((amount / (currencyData?.value_convert || 1)).toLocaleString("id-ID", { maximumFractionDigits: 2 }))})</Text>}
                                                        </VStack>
                                                    </HStack>
                                                </Box>
                                            </TouchableOpacity>
                                        </Swipeable>
                                    );
                                })}
                            </Box>
                        )}
                    />

                </Box>
            </View>
            <DeleteConfirm showAlertDialog={showAlertDialog} setShowAlertDialog={setShowAlertDialog} title={"Apakah anda yakin akan menghapus?"} actionConfirm={actionConfirm} />
        </SafeAreaCustom>
    )
}

export { CatatanScreen };