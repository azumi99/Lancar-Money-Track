import { PadStore, useKategoriStorePengeluaran, useSelectedKategori } from "@config/store";
import { Text, View } from "@gluestack-ui/themed";
import React, { useEffect } from "react";
import { useState } from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { dataIcon } from "@screens/add/dummyData";
import { IconCustom } from "@components/iconCustom";
import Ionicons from "react-native-vector-icons/Ionicons";
import { fetchPengeluaran } from "@screens/profile/detailPengaturan/pengaturanKategori/globalGetFunctionKategori";
import { playBeep } from "@utils/soundUtils";
import { useNavigation } from "@react-navigation/native";

const Pengeluaran = ({ route }) => {
    const { pad, setPad } = PadStore();
    const navigation = useNavigation<any>();
    const { selectedIndex, setSelectedIndex } = useSelectedKategori();
    const { kategori, setKategori } = useKategoriStorePengeluaran();
    useEffect(() => {
        fetchPengeluaran({ kategori, setKategori })
    }, [])
    const dataKategori = kategori.filter((item) => item.active === '1');
    console.log('dataKategori', selectedIndex)
    console.log('routesss', route)
    return (
        <View >
            <FlatList
                data={dataKategori}
                renderItem={({ item, index }) => {
                    const title = item?.title || '';
                    const firstLine = title.slice(0, 10);
                    const secondLine = title.length > 10 ? title.slice(10) : '';


                    return (
                        <TouchableOpacity
                            onPress={() => {
                                if (route.params) {
                                    setSelectedIndex(item?.key);
                                    navigation.goBack();
                                } else {
                                    playBeep();
                                    setPad(true);
                                    setSelectedIndex(item?.key);
                                }
                            }}
                            style={{ alignItems: 'center', width: '25%', height: 90, justifyContent: 'center' }}
                        >

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

export { Pengeluaran }