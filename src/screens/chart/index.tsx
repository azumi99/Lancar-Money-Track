import React, { useCallback, useEffect, useState } from "react";

import { Dimensions } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import SafeAreaCustom from "@components/safeArea";
import { HStack, Progress, ProgressFilledTrack, ScrollView, Text, View, VStack } from "@gluestack-ui/themed";
import dayjs from "dayjs";
import { GetCatatan, InterfaceCatatan } from "@screens/catatan/models/crudCatatan";
import { formatThousand } from "@components/formatRibuan";
import { Picker } from "@react-native-picker/picker";
import { IconCustom } from "@components/iconCustom";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import { playBeep } from "@utils/soundUtils";

const ChartScreen = () => {
    const screenWidth = Dimensions.get("window").width;

    const [data, setData] = useState<InterfaceCatatan[]>([]);
    const [jenis, setJenis] = useState<'pemasukan' | 'pengeluaran'>('pengeluaran');
    const [bulan, setBulan] = useState<string>(dayjs().format('MM'));
    const [tahun, setTahun] = useState<string>(dayjs().format('YYYY'));
    const [pieData, setPieData] = useState<any[]>([]);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [jenis, bulan, tahun]),
    );

    const fetchData = async () => {
        const allCatatan = await GetCatatan();
        setData(allCatatan);

        const filtered = allCatatan.filter(item =>
            item.jenis === jenis &&
            dayjs(item.tanggal).format('MM') === bulan &&
            dayjs(item.tanggal).format('YYYY') === tahun
        );

        const grouped = filtered.reduce<Record<string, { total: number, color: string, label: string, gradient: string, kategoriIcon: string }>>((acc, item) => {
            const key = item.kategoriIcon || 'Lainnya';
            if (!acc[key]) {
                const colors = [
                    { color: '#FFA000', gradient: '#FF7043' },
                    { color: '#26A69A', gradient: '#00897B' },
                    { color: '#8E24AA', gradient: '#6A1B9A' },
                    { color: '#43A047', gradient: '#2E7D32' },
                    { color: '#1E88E5', gradient: '#1565C0' },
                    { color: '#FF8F00', gradient: '#FF6F00' },
                ];
                const colorIndex = Object.keys(acc).length % colors.length;
                acc[key] = {
                    total: item.jumlah,
                    color: colors[colorIndex].color,
                    label: item.title || key,
                    gradient: colors[colorIndex].gradient,
                    kategoriIcon: item.kategoriIcon || '',
                };
            } else {
                acc[key].total += item.jumlah;
            }
            return acc;
        }, {});

        const entries = Object.entries(grouped);
        const max = Math.max(...entries.map(([_, val]) => val.total));

        const chartData = entries.map(([_, val]) => ({
            value: val.total,
            color: val.color,
            gradientCenterColor: val.gradient,
            text: val.label,
            kategoriIcon: val.kategoriIcon,
            focused: val.total === max,
        }));

        setPieData(chartData);
    };

    const years = () => {
        if (data.length === 0) return [currentYear.toString()];
        const yearSet = new Set(data.map(item => Number(dayjs(item.tanggal).format('YYYY'))));
        const yearArray = Array.from(yearSet).sort((a, b) => a - b);
        const lastYear = Math.max(...yearArray);
        const earliestAllowedYear = Math.max(lastYear - 5, Math.min(...yearArray));
        const validYears = yearArray.filter(y => y >= earliestAllowedYear && y <= lastYear);
        if (!validYears.includes(currentYear + 1)) {
            validYears.push(currentYear + 1);
        }
        return validYears.map(String);
    };

    const renderDot = (color: string) => (
        <View style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: color, marginRight: 10 }} />
    );

    const renderLegendComponent = () => {
        const total = pieData.reduce((acc, curr) => acc + curr.value, 0);
        return (
            <View style={{ flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'center' }}>
                {pieData.map((item, index) => {
                    const percent = total > 0 ? ((item.value / total) * 100).toFixed(0) : '0';
                    return (
                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', width: 140, margin: 5 }}>
                            {renderDot(item.gradientCenterColor)}
                            <Text style={{ color: '#222' }}>{item.text}: {percent}%</Text>
                        </View>
                    );
                })}
            </View>
        );
    };

    const renderCategoryList = () => {
        const total = pieData.reduce((acc, curr) => acc + curr.value, 0);
        return (
            <VStack space="lg" style={{ paddingHorizontal: 20, marginVertical: 20 }}>
                {pieData.map((item, index) => {
                    const percentage = total > 0 ? ((item.value / total) * 100).toFixed(0) : '0';
                    return (
                        <HStack key={index} space="sm">
                            <View padding={10} bgColor={item.gradientCenterColor} borderRadius={'$full'} mt={1}>
                                <IconCustom As={Ionicons} name={item.kategoriIcon} size={15} color={'#FFF'} />
                            </View>
                            <VStack flex={1} space="xs">
                                <HStack justifyContent="space-between" alignItems="center">
                                    <Text size="sm" color="#222">{item.text}</Text>
                                    <HStack space="md">
                                        <Text size="sm">{percentage}%</Text>
                                        <Text size="sm">{formatThousand(item.value)}</Text>
                                    </HStack>
                                </HStack>
                                <Progress value={parseFloat(percentage)} w="100%" size="xs">
                                    <ProgressFilledTrack bgColor={item.gradientCenterColor} />
                                </Progress>
                            </VStack>
                        </HStack>
                    );
                })}
            </VStack>
        );
    };

    return (
        <SafeAreaCustom>
            <View style={{ backgroundColor: '#FAF3DD', flex: 1 }}>
                <VStack style={{ margin: 20 }} space="md">
                    <Picker selectedValue={jenis} onValueChange={(val) => { playBeep(); setJenis(val) }} style={{ backgroundColor: '#FFA000', color: '#222', borderRadius: 10 }}>
                        <Picker.Item label="Pemasukan" value="pemasukan" />
                        <Picker.Item label="Pengeluaran" value="pengeluaran" />
                    </Picker>

                    <HStack space="md">
                        <Picker selectedValue={bulan} style={{ flex: 1, backgroundColor: '#FF7043', color: '#222', borderRadius: 10 }} onValueChange={(val) => { playBeep(); setBulan(val) }}>
                            {months.map((m) => (
                                <Picker.Item key={m} label={`Bulan ${m}`} value={m} />
                            ))}
                        </Picker>

                        <Picker selectedValue={tahun} style={{ flex: 1, backgroundColor: '#FF7043', color: '#222', borderRadius: 10 }} onValueChange={(val) => { playBeep(); setTahun(val) }}>
                            {years().map((y) => (
                                <Picker.Item key={y} label={`${y}`} value={y} />
                            ))}
                        </Picker>
                    </HStack>
                </VStack>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ margin: 20, padding: 16, borderRadius: 30, backgroundColor: '#FFFDF8' }}>
                        <Text style={{ color: '#222', fontSize: 16, fontWeight: 'bold' }}>
                            Statistik {jenis.charAt(0).toUpperCase() + jenis.slice(1)}
                        </Text>

                        {pieData.length > 0 ? (
                            <>
                                <View style={{ padding: 20, alignItems: 'center' }}>
                                    <PieChart
                                        data={pieData}
                                        donut
                                        showGradient
                                        sectionAutoFocus
                                        radius={100}
                                        innerRadius={70}
                                        innerCircleColor={'#FFF7E6'}
                                        centerLabelComponent={() => {
                                            const total = pieData.reduce((acc, curr) => acc + curr.value, 0);
                                            return (
                                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                    <Text style={{ fontSize: 22, color: '#222', fontWeight: 'bold' }}>{formatThousand(total)}</Text>
                                                    <Text style={{ fontSize: 14, color: '#444' }}>Total</Text>
                                                </View>
                                            );
                                        }}
                                    />
                                </View>
                                {renderCategoryList()}
                            </>
                        ) : (
                            <View style={{ padding: 20, alignItems: 'center' }}>
                                <Text style={{ fontSize: 16, color: '#666' }}>Tidak ada data {jenis} di bulan ini</Text>
                            </View>
                        )}
                    </View>
                    {/* <View mb={20}>{pieData.length > 0 && renderCategoryList()}</View> */}
                </ScrollView>
            </View>
        </SafeAreaCustom>
    );
};

export { ChartScreen };
