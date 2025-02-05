import SafeAreaCustom from "@components/safeArea"
import { TextHeading } from "@components/textHeading"
import { Divider, HStack, ScrollView, Text, View, VStack } from "@gluestack-ui/themed"
import React from "react"
import { getIconLibrary } from "@screens/catatan"
import { IconCustom } from "@components/iconCustom"
import { CurrencyFormatter } from "@components/curencyComponent"
import { TouchableOpacity } from "react-native"
import { ModalCustom } from "@components/modalComponent"

const CatatanDetail = ({ route }) => {
    const [showAlertDialog, setShowAlertDialog] = React.useState(false)
    const IconLibrary = getIconLibrary(route.params.data.iconLibrary || '');
    const amount = route.params.data.jumlah !== undefined && route.params.data.jumlah !== null
        ? (route.params.data.jenis === 'Pengeluaran' ? -route.params.data.jumlah : route.params.data.jumlah)
        : 0;
    return (
        <SafeAreaCustom>
            <ScrollView paddingHorizontal={16} marginVertical={20} showsVerticalScrollIndicator={false}>
                <VStack space="4xl">
                    <HStack alignItems="center" space="md" marginVertical={16}>
                        {IconLibrary ? (
                            <View padding={13} bgColor="$yellow300" borderRadius={'$full'}>
                                <IconCustom
                                    As={IconLibrary}
                                    name={route.params.data.iconName}
                                    size={15}
                                />
                            </View>
                        ) : null}
                        <TextHeading>{route.params.data.kategori}</TextHeading>
                    </HStack>
                    <HStack space="4xl" alignItems="center">
                        <VStack space="4xl">
                            <TextHeading>Jenis</TextHeading>
                            <TextHeading>Jumlah</TextHeading>
                            <TextHeading>Tanggal</TextHeading>
                            <TextHeading>Catatan</TextHeading>
                        </VStack>
                        <VStack space="4xl" pr={'30%'}>
                            <Text>{route.params.data.jenis}</Text>
                            <CurrencyFormatter
                                amount={amount}
                                currency="IDR"
                            />
                            <Text>{route.params.data.tanggal}</Text>
                            <Text>{route.params.data.catatan}</Text>
                        </VStack>
                    </HStack>
                </VStack>
            </ScrollView>
            <View>
                <Divider my="$0.5" />
                <HStack justifyContent="space-around" paddingHorizontal={16} alignItems="center">
                    <TouchableOpacity>
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
            <ModalCustom showModal={showAlertDialog} setShowModal={setShowAlertDialog}>
                <VStack space="xl" alignSelf="center" mt={17}>
                    <Text size="lg" color="red" textAlign="center">Apakah anda yakin untuk menghapus?</Text>
                    <HStack space="4xl">
                        <TouchableOpacity onPress={() => setShowAlertDialog(false)} style={{ padding: 5, paddingHorizontal: 15 }}>
                            <TextHeading>Batalkan</TextHeading>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ padding: 5, paddingHorizontal: 15 }}>
                            <TextHeading>Konfirmasi</TextHeading>
                        </TouchableOpacity>
                    </HStack>
                </VStack>
            </ModalCustom>
        </SafeAreaCustom>
    )
}

export { CatatanDetail }