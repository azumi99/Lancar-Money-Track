import { PadStore, useKategoriStorePengeluaran } from "@config/store";
import { Text, View } from "@gluestack-ui/themed";
import React, { useEffect } from "react";
import { useState } from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { dataIcon } from "@screens/add/dummyData";
import { IconCustom } from "@components/iconCustom";
import Ionicons from "react-native-vector-icons/Ionicons";
import { fetchPengeluaran } from "@screens/profile/detailPengaturan/pengaturanKategori/globalGetFunctionKategori";

const Pengeluaran = () => {
    const { pad, setPad } = PadStore();
    const [selectedIndex, setSelectedIndex] = useState<number | null>();
    const { kategori, setKategori } = useKategoriStorePengeluaran();

    useEffect(() => {
        fetchPengeluaran({ kategori, setKategori })
    }, [])

    return (
        <View >
            <FlatList
                data={kategori}
                renderItem={({ item, index }) => {
                    const title = item?.title || '';
                    const firstLine = title.slice(0, 10);
                    const secondLine = title.length > 10 ? title.slice(10) : '';


                    return (
                        <TouchableOpacity onPress={() => { setPad(!pad); setSelectedIndex(index); }} style={{ alignItems: 'center', width: '25%', height: 90, justifyContent: 'center' }}>
                            <View style={{ padding: 10, borderRadius: 50, backgroundColor: selectedIndex === index && pad ? '#fde047' : '#E0E0E0' }}>
                                <IconCustom As={Ionicons} name={item?.kategoriIcon} size={20} />
                            </View>
                            <Text size="xs" >{firstLine}</Text>
                            {secondLine ? <Text size="xs">{secondLine}</Text> : null}
                        </TouchableOpacity>
                    );
                }}
                keyExtractor={(item, index) => index.toString()}
                horizontal={false}
                numColumns={4}
                contentContainerStyle={{ justifyContent: 'space-around', paddingHorizontal: 16, }}
            />
        </View>
    )
};

export { Pengeluaran }