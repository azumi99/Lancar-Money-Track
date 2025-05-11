import { IconCustom } from "@components/iconCustom"
import { formatThousand, InputDefault } from "@components/input/inputDefault"
import SafeAreaCustom from "@components/safeArea"
import { TextHeading } from "@components/textHeading"
import { Box, HStack, Text, View } from "@gluestack-ui/themed"
import React, { useCallback, useRef, useState } from "react"
import { FlatList, Swipeable, TouchableOpacity } from "react-native-gesture-handler"
import Ionicons from "react-native-vector-icons/Ionicons"
import { getIconLibrary } from "@screens/catatan"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { GetCatatan, handleDelete, InterfaceCatatan } from "../models/crudCatatan"
import { useRekeningData } from "@config/store"
import { DeleteConfirm } from "@components/modalConfirm/deleteConfirm"
import { playBeep } from "@utils/soundUtils"

const SearchMainScreen = () => {
    const [search, setSearch] = useState<string>("")
    const navigation = useNavigation<any>();
    const { rekening } = useRekeningData();
    const [data, setData] = useState<InterfaceCatatan[]>([]);
    const [jenisFilter, setJenisFilter] = useState<'all' | 'pemasukan' | 'pengeluaran' | 'transfer'>('all');
    const [showAlertDialog, setShowAlertDialog] = React.useState(false)
    const [idToDelete, setIdToDelete] = useState<number>(0);

    const fetchData = async () => {
        try {
            const response = await GetCatatan();
            setData(response);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const swipeRefs = useRef<{ [key: string]: Swipeable | null }>({});

    const filterBySearch = (items: InterfaceCatatan[]): InterfaceCatatan[] => {
        let filtered = items;

        if (jenisFilter !== 'all') {
            filtered = filtered.filter(item => item.jenis === jenisFilter);
        }

        if (!search.trim()) return filtered;

        const keyword = search.toLowerCase();

        return filtered.filter(item =>
            item.catatan?.toLowerCase().includes(keyword) ||
            item.jenis?.toLowerCase().includes(keyword) ||
            rekening.find(rek => rek.key === item.id_rekening)?.name?.toLowerCase().includes(keyword) ||
            rekening.find(rek => rek.key === item.id_rekening_tf)?.name?.toLowerCase().includes(keyword)
        );
    };

    interface GroupedCatatan {
        tanggal: string;
        data: InterfaceCatatan[];
        totalMinus: number;
        totalPlus: number;
    }

    const filterDataByDate = (): GroupedCatatan[] => {
        const filtered = filterBySearch(data);
        const grouped: Record<string, GroupedCatatan> = {}

        filtered.forEach((item) => {
            const itemDate = new Date(item.tanggal)
            const tanggal = itemDate.toISOString().split('T')[0]

            if (!grouped[tanggal]) {
                grouped[tanggal] = {
                    tanggal,
                    data: [],
                    totalMinus: 0,
                    totalPlus: 0,
                }
            }

            grouped[tanggal].data.push(item)

            if (item.jenis === 'pemasukan') {
                grouped[tanggal].totalPlus += item.jumlah || 0
            } else if (item.jenis === 'pengeluaran') {
                grouped[tanggal].totalMinus += item.jumlah || 0
            }
        })

        return Object.values(grouped).sort(
            (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
        )
    }

    useFocusEffect(
        useCallback(() => {
            fetchData();
            Object.values(swipeRefs.current).forEach(ref => {
                if (ref && ref.close) {
                    ref.close();
                }
            });
        }, []),
    );
    const actionConfirm = async () => {
        await handleDelete(idToDelete);
        await fetchData();
        setShowAlertDialog(false);
    }

    const renderRightActions = (item) => (
        <HStack alignItems="center" ml={10}>
            <TouchableOpacity onPress={() => { playBeep(); navigation.navigate('StackNav', { screen: 'AddScreen', params: { data: item } }) }}>
                <Box py="100%" bgColor="$amber400" justifyContent="center" alignItems="center" width={70}>
                    <Text color="white">Edit</Text>
                </Box>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { playBeep(); setIdToDelete(item.id); setShowAlertDialog(true); }}>
                <Box py="100%" bgColor="$rose400" justifyContent="center" alignItems="center" width={70}>
                    <Text color="white">Hapus</Text>
                </Box>
            </TouchableOpacity>
        </HStack>
    );

    return (
        <SafeAreaCustom>
            <Box bgColor="$yellow300" padding={16}>
                <InputDefault
                    autoFocus
                    bgColor="$white"
                    borderColor="$white"
                    changeText={setSearch}
                    showIcon
                    iconElement={<IconCustom As={Ionicons} name="search" size={20} />}
                />
            </Box>

            <View flexDirection="row" justifyContent="space-around" mt={13}>
                {['all', 'pemasukan', 'pengeluaran', 'transfer'].map((jenis) => (
                    <TouchableOpacity
                        key={jenis}
                        onPress={() => { playBeep(); setJenisFilter(jenis as any) }}
                        style={{
                            paddingVertical: 6,
                            paddingHorizontal: 12,
                            borderRadius: 20,
                            backgroundColor: jenisFilter === jenis ? '#F59E0B' : '#E5E7EB',
                        }}
                    >
                        <Text style={{ color: jenisFilter === jenis ? 'white' : 'black', fontSize: 12 }}>
                            {jenis === 'all' ? 'Semua' : jenis.charAt(0).toUpperCase() + jenis.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {search.length > 1 &&
                <View paddingHorizontal={16} paddingVertical={16} flex={1}>
                    <FlatList
                        data={filterDataByDate()}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item) => item.tanggal}
                        renderItem={({ item }) => (
                            <Box mb="$4">
                                <HStack alignItems="center" justifyContent="space-between" paddingVertical={5}>
                                    <TextHeading size="xs">
                                        {new Date(item.tanggal).toLocaleDateString('id-ID', {
                                            weekday: 'long',
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </TextHeading>
                                </HStack>

                                {item.data.map((itemData) => {
                                    const IconLibrary = getIconLibrary(itemData.vendor || '');
                                    const maxLength = 15;
                                    const truncatedCatatan = itemData.catatan?.length > maxLength
                                        ? itemData.catatan.substring(0, maxLength) + "..."
                                        : itemData.catatan;
                                    const rekeningFrom = rekening.find((rek) => rek.key === itemData.id_rekening);
                                    const rekeningTo = rekening.find((rek) => rek.key === itemData.id_rekening_tf);

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
                                                                    <IconCustom As={IconLibrary} name={itemData.kategoriIcon} size={15} />
                                                                    {JSON.parse(itemData.image).length > 0 &&
                                                                        <View padding={4} bgColor="$blue200" borderRadius={'$full'} position="absolute">
                                                                            <IconCustom As={Ionicons} name={'camera'} size={7} />
                                                                        </View>
                                                                    }
                                                                </View>
                                                            ) : itemData.jenis === "transfer" ? (
                                                                <View padding={13} bgColor="$yellow300" borderRadius={'$full'}>
                                                                    <IconCustom As={Ionicons} name={'repeat-outline'} size={15} />
                                                                    {JSON.parse(itemData.image).length > 0 &&
                                                                        <View padding={4} bgColor="$blue200" borderRadius={'$full'} position="absolute">
                                                                            <IconCustom As={Ionicons} name={'camera'} size={7} />
                                                                        </View>
                                                                    }
                                                                </View>
                                                            ) : null}
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
                                                        <Text size="sm">{formatThousand(amount.toString())}</Text>
                                                    </HStack>
                                                </Box>
                                            </TouchableOpacity>
                                        </Swipeable>
                                    );
                                })}
                            </Box>
                        )}
                    />
                </View>

            }
            <DeleteConfirm showAlertDialog={showAlertDialog} setShowAlertDialog={setShowAlertDialog} title={"Apakah anda yakin akan menghapus?"} actionConfirm={actionConfirm} />
        </SafeAreaCustom>
    )
}

export { SearchMainScreen }
