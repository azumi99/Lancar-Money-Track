import React, { useEffect, useState } from "react";
import {
    Box,
    Text,
    HStack,
    VStack,
    Icon,
    Center,
    ScrollView,
    Button,
    ButtonText,
    Actionsheet,
    ActionsheetBackdrop,
    ActionsheetContent,
    ActionsheetDragIndicatorWrapper,
    ActionsheetDragIndicator,
    ActionsheetItem,
    ActionsheetItemText,
} from "@gluestack-ui/themed";
import { StyleSheet, TouchableOpacity } from "react-native";
import { ChevronDown, Edit2, Smartphone, Calendar } from "lucide-react-native";
import SafeAreaCustom from "@components/safeArea";
import Svg, { Circle } from "react-native-svg";
import { GetAnggaran, GetPengeluaranBulanIni, GetPengeluaranByMonthAndYear, GetAvailableYears } from "@screens/anggaran/model";
import { ShowToast } from "@components/toast";
import Ionicons from "react-native-vector-icons/Ionicons"
import { IconCustom } from "@components/iconCustom";
import { formatThousand } from "@components/formatRibuan";

// Komponen Progress Lingkaran
const CircularProgress = ({ percentage }) => {

    const radius = 36;  // Radius lingkaran
    const strokeWidth = 8;  // Lebar garis stroke
    const circumference = 2 * Math.PI * radius;  // Keliling lingkaran
    const strokeDashoffset = circumference - (percentage / 100) * circumference;  // Menghitung offset berdasarkan persentase

    let progressColor = "#22C55E";  // Default Green Color
    let textColor = "#333";  // Default Text Color

    // Menentukan warna berdasarkan persentase
    if (percentage >= 100) {
        progressColor = "#EF4444";  // Red Color when over budget
        textColor = "red.500";  // Red Text
    } else if (percentage >= 50) {
        progressColor = "#F59E0B";  // Yellow Color for moderate progress
        textColor = "#333";  // Default Text Color
    }

    const labelText = percentage >= 100 ? "Melebihi" : `${percentage}%`;

    return (
        <Center width={50} height={50} mt={5} mx={10} position="relative">
            {/* Background Circle */}
            <Svg width={80} height={80} viewBox="0 0 80 80">
                <Circle
                    cx="40"
                    cy="40"
                    r={radius}
                    stroke="#E0E0E0"  // Grey background circle
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {/* Progress Circle */}
                <Circle
                    cx="40"
                    cy="40"
                    r={radius}
                    stroke={progressColor}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                />
            </Svg>

            {/* Label */}
            <Center width="100%" height="100%" position="absolute">
                <Text size="xs" fontWeight="bold" color={textColor}>
                    {labelText}
                </Text>
            </Center>
        </Center>
    );
};

// Fungsi hitung persentase
const hitungPersentase = (pengeluaranStr, anggaranStr) => {
    const pengeluaran = Number(pengeluaranStr.replace(/\./g, "").replace(/\,/g, ""));
    const anggaran = Number(anggaranStr.replace(/\./g, "").replace(/\,/g, ""));

    if (anggaran === 0) return 0;
    return Math.min(Math.round((pengeluaran / anggaran) * 100), 999);
};

interface AnggaranInterface {
    id: number;
    id_kategori: string;
    jumlah: number;
    kategoriIcon?: string;
    sisa_anggaran: number;
    title?: string;
    total_pengeluaran: number;
    vendor?: string;
}

const BudgetReport = () => {
    // Date state for filters
    const currentDate = new Date();
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
    const [displayMonth, setDisplayMonth] = useState(getMonthName(currentDate.getMonth() + 1));

    // Actionsheet states
    const [showMonthSheet, setShowMonthSheet] = useState(false);
    const [showYearSheet, setShowYearSheet] = useState(false);

    // Budget data states
    const [dataAnggaran, setDataAnggaran] = useState<AnggaranInterface[]>([]);
    const [totalBudget, setTotalBudget] = useState<AnggaranInterface | null>(null);
    const [kategoriBudgets, setKategoriBudgets] = useState<AnggaranInterface[]>([]);

    // Available years state
    const [availableYears, setAvailableYears] = useState<number[]>([]);

    // Get month name from month number
    function getMonthName(monthNumber) {
        const months = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];
        return months[monthNumber - 1];
    }

    // Generate months for filter
    const months = [
        { number: 1, name: "Januari" },
        { number: 2, name: "Februari" },
        { number: 3, name: "Maret" },
        { number: 4, name: "April" },
        { number: 5, name: "Mei" },
        { number: 6, name: "Juni" },
        { number: 7, name: "Juli" },
        { number: 8, name: "Agustus" },
        { number: 9, name: "September" },
        { number: 10, name: "Oktober" },
        { number: 11, name: "November" },
        { number: 12, name: "Desember" }
    ];

    // Load available years
    const loadAvailableYears = async () => {
        try {
            const years = await GetAvailableYears();

            // Add next year to the available years
            const nextYear = currentDate.getFullYear() + 1;
            if (!years.includes(nextYear)) {
                years.push(nextYear);
            }

            // Sort years in ascending order
            years.sort((a, b) => a - b);

            setAvailableYears(years);
            console.log('Available years:', years);
        } catch (error) {
            console.error('Error loading available years:', error);
            // Fallback to current year and next year if there's an error
            setAvailableYears([currentDate.getFullYear(), currentDate.getFullYear() + 1]);
        }
    };

    const getAnggaran = async (month = selectedMonth, year = selectedYear) => {
        try {
            // Get data from API using the selected month and year
            const response = await GetPengeluaranByMonthAndYear(month, year);
            console.log(`Original response data for ${month}/${year}:`, response);

            // Check if there's already a total budget item in the response
            let total = response.find(item => item.id_kategori === '0' || item.id_kategori === 0);
            const categories = response.filter(item => item.id_kategori !== '0' && item.id_kategori !== 0);

            // If no total budget item exists in the response, let's calculate it
            if (!total) {
                // Calculate total budget values
                const totalJumlah = categories.reduce((sum, item) => sum + item.jumlah, 0);
                const totalPengeluaran = categories.reduce((sum, item) => sum + item.total_pengeluaran, 0);
                const sisaAnggaran = totalJumlah - totalPengeluaran;

                // Create a total budget object
                total = {
                    id: 0,
                    id_kategori: '0',
                    jumlah: totalJumlah,
                    total_pengeluaran: totalPengeluaran,
                    sisa_anggaran: sisaAnggaran,
                    title: 'Total Anggaran',
                    kategoriIcon: 'wallet-outline'
                };

                // Add the total budget to all data
                setDataAnggaran([total, ...categories]);
            } else {
                setDataAnggaran(response);
            }

            // Set the total budget and category budgets
            setTotalBudget(total);
            setKategoriBudgets(categories);

            console.log('Total budget:', total);
            console.log('Category budgets:', categories);

        } catch (error) {
            ShowToast('Ada masalah');
            console.log('error', error);
        }
    };

    // Handle month selection
    const selectMonth = (monthNumber) => {
        setSelectedMonth(monthNumber);
        setDisplayMonth(getMonthName(monthNumber));
        setShowMonthSheet(false);
        getAnggaran(monthNumber, selectedYear);
    };

    // Handle year selection
    const selectYear = (year) => {
        setSelectedYear(year);
        setShowYearSheet(false);
        getAnggaran(selectedMonth, year);
    };

    useEffect(() => {
        // Load available years first
        loadAvailableYears();

        // Then get anggaran data
        getAnggaran(selectedMonth, selectedYear);
    }, []);

    return (
        <SafeAreaCustom>
            {/* Filter Bar */}
            <HStack
                bg="$yellow300"
                px={16}
                py={12}
                justifyContent="space-between"
                alignItems="center"
            >
                <Text size="lg" fontWeight="bold" color="$black">Filter</Text>

                <HStack space="sm">
                    {/* Month Filter Button */}
                    <TouchableOpacity onPress={() => setShowMonthSheet(true)}>
                        <HStack
                            bg="$yellow100"
                            borderRadius={8}
                            px={12}
                            py={4}
                            alignItems="center"
                            space="xs"
                        >
                            <Text fontWeight="medium">{displayMonth}</Text>
                            <ChevronDown size={16} color="#000" />
                        </HStack>
                    </TouchableOpacity>

                    {/* Year Filter Button */}
                    <TouchableOpacity onPress={() => setShowYearSheet(true)}>
                        <HStack
                            bg="$yellow100"
                            borderRadius={8}
                            px={12}
                            py={4}
                            alignItems="center"
                            space="xs"
                        >
                            <Text fontWeight="medium">{selectedYear}</Text>
                            <ChevronDown size={16} color="#000" />
                        </HStack>
                    </TouchableOpacity>
                </HStack>
            </HStack>

            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {/* Total Budget Card (id_kategori = 0) */}
                {totalBudget && (
                    <Box
                        borderWidth={1}
                        borderColor="#ddd"
                        borderRadius={8}
                        p={16}
                        mb={16}
                        bg="$yellow50"
                    >
                        <HStack justifyContent="space-between" mb={12}>
                            <HStack space="sm" alignItems="center">
                                <IconCustom As={Ionicons} name="wallet-outline" size={24} color="$amber500" />
                                <Text fontWeight="bold" size="lg">Total Anggaran</Text>
                            </HStack>
                        </HStack>

                        <HStack justifyContent="center" alignItems="center" space="md">
                            <CircularProgress percentage={hitungPersentase(String(totalBudget.total_pengeluaran), String(totalBudget.jumlah))} />
                            <VStack flex={1} space="xs">
                                <HStack justifyContent="space-between">
                                    <Text size="sm" color="#666">Tersisa :</Text>
                                    <Text fontWeight="bold" size="md">{formatThousand(totalBudget.sisa_anggaran)}</Text>
                                </HStack>
                                <HStack justifyContent="space-between">
                                    <Text size="sm" color="#666">Anggaran :</Text>
                                    <Text fontWeight="bold" size="md">{formatThousand(totalBudget.jumlah)}</Text>
                                </HStack>
                                <HStack justifyContent="space-between">
                                    <Text size="sm" color="#666">Pengeluaran :</Text>
                                    <Text fontWeight="bold" size="md" color={totalBudget.total_pengeluaran > totalBudget.jumlah ? "$red500" : "$gray700"}>
                                        {formatThousand(totalBudget.total_pengeluaran)}
                                    </Text>
                                </HStack>
                            </VStack>
                        </HStack>
                    </Box>
                )}

                {/* Kategori Budgets */}
                {kategoriBudgets.map((value, key) => (
                    <Box key={key} borderWidth={1} borderColor="#ddd" borderRadius={8} p={16} mb={16}>
                        <HStack justifyContent="space-between" mb={12}>
                            <HStack space="sm" alignItems="center">
                                <IconCustom As={Ionicons} name={value.kategoriIcon || "apps-outline"} size={20} color="$yellow300" />
                                <Text fontWeight="bold">{value.title}</Text>
                            </HStack>
                        </HStack>

                        <HStack justifyContent="center" alignItems="center" space="md">
                            <CircularProgress percentage={hitungPersentase(String(value.total_pengeluaran), String(value.jumlah))} />
                            <VStack flex={1} space="xs">
                                <HStack justifyContent="space-between">
                                    <Text size="sm" color="#666">Tersisa :</Text>
                                    <Text>{formatThousand(value.sisa_anggaran)}</Text>
                                </HStack>
                                <HStack justifyContent="space-between">
                                    <Text size="sm" color="#666">Anggaran :</Text>
                                    <Text>{formatThousand(value.jumlah)}</Text>
                                </HStack>
                                <HStack justifyContent="space-between">
                                    <Text size="sm" color="#666">Pengeluaran :</Text>
                                    <Text>{formatThousand(value.total_pengeluaran)}</Text>
                                </HStack>
                            </VStack>
                        </HStack>
                    </Box>
                ))}
            </ScrollView>

            {/* Month Selection Actionsheet */}
            <Actionsheet isOpen={showMonthSheet} onClose={() => setShowMonthSheet(false)} zIndex={999}>
                <ActionsheetBackdrop />
                <ActionsheetContent h="$80" zIndex={999}>
                    <ActionsheetDragIndicatorWrapper>
                        <ActionsheetDragIndicator />
                    </ActionsheetDragIndicatorWrapper>

                    <Box p={16}>
                        <Text size="lg" fontWeight="bold" mb={12}>Pilih Bulan</Text>

                        {months.map((month) => (
                            <ActionsheetItem
                                key={month.number}
                                onPress={() => selectMonth(month.number)}
                                bg={selectedMonth === month.number ? "$yellow100" : "transparent"}
                                borderRadius={8}
                                mb={4}
                            >
                                <HStack width="100%" justifyContent="space-between" alignItems="center">
                                    <ActionsheetItemText>{month.name}</ActionsheetItemText>
                                    {selectedMonth === month.number && (
                                        <IconCustom As={Ionicons} name="checkmark" size={20} color="$yellow500" />
                                    )}
                                </HStack>
                            </ActionsheetItem>
                        ))}
                    </Box>
                </ActionsheetContent>
            </Actionsheet>

            {/* Year Selection Actionsheet */}
            <Actionsheet isOpen={showYearSheet} onClose={() => setShowYearSheet(false)} zIndex={999}>
                <ActionsheetBackdrop />
                <ActionsheetContent h="$72" zIndex={999}>
                    <ActionsheetDragIndicatorWrapper>
                        <ActionsheetDragIndicator />
                    </ActionsheetDragIndicatorWrapper>

                    <Box p={16}>
                        <Text size="lg" fontWeight="bold" mb={12}>Pilih Tahun</Text>

                        {availableYears.map((year) => (
                            <ActionsheetItem
                                key={year}
                                onPress={() => selectYear(year)}
                                bg={selectedYear === year ? "$yellow100" : "transparent"}
                                borderRadius={8}
                                mb={4}
                            >
                                <HStack width="100%" justifyContent="space-between" alignItems="center">
                                    <ActionsheetItemText>{year}</ActionsheetItemText>
                                    {selectedYear === year && (
                                        <IconCustom As={Ionicons} name="checkmark" size={20} color="$yellow500" />
                                    )}
                                </HStack>
                            </ActionsheetItem>
                        ))}
                    </Box>
                </ActionsheetContent>
            </Actionsheet>
        </SafeAreaCustom>
    );
};

const styles = StyleSheet.create({});

export { BudgetReport };