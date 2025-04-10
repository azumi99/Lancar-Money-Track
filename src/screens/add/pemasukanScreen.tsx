import { IconCustom } from "@components/iconCustom";
import { PadStore, useKategoriStorePemasukan, useSelectedKategori } from "@config/store";
import { Text, View } from "@gluestack-ui/themed";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, FlatList } from "react-native";
import { dataPemasukan, KategoriItem } from "@screens/add/dummyData";
import Ionicons from "react-native-vector-icons/Ionicons";
import { fetchPemasukan } from "@screens/profile/detailPengaturan/pengaturanKategori/globalGetFunctionKategori";


const Pemasukan = () => {
    const { pad, setPad } = PadStore();
    const { selectedIndex, setSelectedIndex } = useSelectedKategori();
    const { kategori, setKategori } = useKategoriStorePemasukan()
    useEffect(() => {
        fetchPemasukan({ kategori, setKategori })
    }, [])
    const dataKategori = kategori.filter((item) => item.active === '1');
    console.log('dataKategori', dataKategori)
    return (
        <View >
            <FlatList
                data={dataKategori}
                renderItem={({ item, index }) => {
                    const title = item?.title || '';
                    const firstLine = title.slice(0, 10);
                    const secondLine = title.length > 10 ? title.slice(10) : '';
                    // console.log('kitem', item)
                    return (
                        <TouchableOpacity onPress={() => { setPad(!pad); setSelectedIndex(item?.key); }} style={{ alignItems: 'center', width: '25%', height: 90, justifyContent: 'center' }}>
                            <View style={{ padding: 10, borderRadius: 50, backgroundColor: selectedIndex === item?.key && pad ? '#fde047' : '#E0E0E0' }}>
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

export { Pemasukan }