import SafeAreaCustom from "@components/safeArea"
import { TextHeading } from "@components/textHeading"
import { Box, Divider, HStack, Image, ScrollView, Text, View, VStack } from "@gluestack-ui/themed"
import React, { useEffect, useState } from "react"
import { getIconLibrary } from "@screens/catatan"
import { IconCustom } from "@components/iconCustom"
import { CurrencyFormatter } from "@components/curencyComponent"
import { TouchableOpacity } from "react-native"
import { ModalCustom } from "@components/modalComponent"
import { DeleteConfirm } from "@components/modalConfirm/deleteConfirm"
import { useKategoriStorePemasukan, useRekeningData } from "@config/store"
import { GetKategoriByKey, KategoriInterface } from "@screens/profile/detailPengaturan/pengaturanKategori/modelKategori"
import { handleDelete } from "../models/crudCatatan"
import { useNavigation } from "@react-navigation/native"
import { chunk } from 'lodash';
import Ionicons from "react-native-vector-icons/Ionicons"

const CatatanDetail = ({ route }) => {
    const [showAlertDialog, setShowAlertDialog] = React.useState(false)
    const navigation = useNavigation<any>();
    const [kategori, setKategori] = useState<KategoriInterface | null>()
    const [kategoriIcon, setKategoriIcon] = useState(null)
    const { rekening } = useRekeningData();

    useEffect(() => {
        const fetchData = async () => {
            const kategori = await GetKategoriByKey(String(route.params.data.id_kategori));
            setKategori(kategori)
        };

        fetchData();
    }, []);

    const IconLibrary = getIconLibrary(kategori?.vendor || '');
    const amount = route.params.data.jumlah !== undefined && route.params.data.jumlah !== null
        ? (route.params.data.jenis === 'Pengeluaran' ? -route.params.data.jumlah : route.params.data.jumlah)
        : 0;
    const imageArray = JSON.parse(route.params.data.image || '[]');
    const rekeningFrom = rekening.find((rek) => rek.key === route.params.data.id_rekening);
    const rekeningTo = rekening.find((rek) => rek.key === route.params.data.id_rekening_tf);
    console.log('imageArray', imageArray)

    console.log('route', route.params.data)
    return (
        <SafeAreaCustom>
            <ScrollView paddingHorizontal={16} marginVertical={20} showsVerticalScrollIndicator={false}>
                <VStack space="4xl">
                    <HStack alignItems="center" space="md" marginVertical={16}>
                        {IconLibrary ? (
                            <View padding={13} bgColor="$yellow300" borderRadius={'$full'}>
                                <IconCustom
                                    As={IconLibrary}
                                    name={kategori?.kategoriIcon}
                                    size={15}
                                />
                            </View>
                        ) : route.params.data.jenis === "transfer" ?
                            <View padding={13} bgColor="$yellow300" borderRadius={'$full'}>
                                <IconCustom
                                    As={Ionicons}
                                    name={'repeat-outline'}
                                    size={15}
                                />
                            </View>
                            : null}
                        <TextHeading>{kategori?.title}</TextHeading>
                    </HStack>
                    <HStack space="4xl" alignItems="center">
                        <VStack space="4xl">
                            <TextHeading>Jenis</TextHeading>
                            <TextHeading>Jumlah</TextHeading>
                            <TextHeading>Rekening</TextHeading>
                            <TextHeading>Tanggal</TextHeading>
                            <TextHeading>Catatan</TextHeading>

                        </VStack>
                        <VStack space="4xl" pr={'30%'}>
                            <Box bgColor="$yellow300" paddingHorizontal={5} borderRadius={10}>
                                <Text>{route.params.data.jenis}</Text>
                            </Box>
                            <CurrencyFormatter
                                amount={amount}
                                currency="IDR"
                            />
                            {route.params.data.jenis === "transfer" ?
                                <Text>{`${rekeningFrom?.name} 💸 ${rekeningTo?.name}`}</Text> : <Text>{`${rekeningFrom?.name}`}</Text>}
                            <Text>{route.params.data.tanggal}</Text>
                            <Text>{route.params.data.catatan}</Text>


                        </VStack>
                    </HStack>
                    {imageArray.length > 0 && <VStack space="md" >
                        <TextHeading>Gambar</TextHeading>
                        <VStack space="md">
                            {chunk(imageArray, 3).map((row, rowIndex) => (
                                <HStack key={rowIndex} space="md">
                                    {row.map((img, index) => (
                                        <Image
                                            key={index}
                                            source={{ uri: 'file://' + img }}
                                            style={{ width: 100, height: 100, borderRadius: 10 }}
                                            resizeMode="cover"
                                            alt={`Image-${rowIndex}-${index}`}
                                        />
                                    ))}
                                </HStack>
                            ))}
                        </VStack>
                    </VStack>}

                </VStack>
            </ScrollView>
            <View>
                <Divider my="$0.5" />
                <HStack justifyContent="space-around" paddingHorizontal={16} alignItems="center">
                    <TouchableOpacity onPress={() => navigation.navigate('StackNav', { screen: 'AddScreen', params: { data: route.params.data } })}>
                        <View paddingVertical={16} paddingHorizontal={16} alignItems="center">
                            <TextHeading>Edit</TextHeading>
                        </View>
                    </TouchableOpacity>
                    <Divider my="$0.5" orientation="vertical" h={15} />
                    <TouchableOpacity onPress={() => setShowAlertDialog(true)}>
                        <View paddingVertical={16} paddingHorizontal={16} alignItems="center">
                            <TextHeading>Hapus</TextHeading>
                        </View>
                    </TouchableOpacity>
                </HStack>
            </View>
            <DeleteConfirm showAlertDialog={showAlertDialog} setShowAlertDialog={setShowAlertDialog} title={"Apakah anda yakin akan menghapus?"} actionConfirm={() => { handleDelete(route.params.data.id); setShowAlertDialog(false); navigation.goBack() }} />
        </SafeAreaCustom>
    )
}

export { CatatanDetail }