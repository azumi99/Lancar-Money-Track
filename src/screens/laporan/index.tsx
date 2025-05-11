import SafeAreaCustom from "@components/safeArea";
import {
    ScrollView,
    Box,
    Text,
    HStack,
    VStack,
    Icon,
    Center,
} from "@gluestack-ui/themed";
import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { db } from "@config/dbService";
import Svg, { Circle } from "react-native-svg";
import Ionicons from "react-native-vector-icons/Ionicons";
import { IconCustom } from "@components/iconCustom";
import { formatThousand } from "@components/formatRibuan";
import { GetPengeluaranByMonthAndYear } from "@screens/anggaran/model";

// Circular Progress Component (copied from BudgetReport)
const CircularProgress = ({ percentage }) => {
    const radius = 36;
    const strokeWidth = 8;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    let progressColor = "#22C55E";  // Default Green Color
    let textColor = "#333";  // Default Text Color

    // Determine color based on percentage
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

// Calculate percentage function (copied from BudgetReport)
const hitungPersentase = (pengeluaranStr, anggaranStr) => {
    const pengeluaran = Number(String(pengeluaranStr).replace(/\./g, "").replace(/\,/g, ""));
    const anggaran = Number(String(anggaranStr).replace(/\./g, "").replace(/\,/g, ""));

    if (anggaran === 0) return 0;
    return Math.min(Math.round((pengeluaran / anggaran) * 100), 999);
};

const LaporanScreen = () => {
    const navigation = useNavigation<any>();
    const [currentMonthData, setCurrentMonthData] = useState({
        month: "",
        pengeluaran: "0",
        pemasukan: "0",
        saldo: "0",
    });

    // Budget data state with initial values
    const [budgetData, setBudgetData] = useState({
        tersisa: "0",
        anggaran: "0",
        pengeluaran: "0",
        percentage: 0,
    });

    useEffect(() => {
        fetchCurrentMonthData();
        fetchBudgetData();
    }, []);

    // Function to fetch only the current month's data
    const fetchCurrentMonthData = () => {
        const date = new Date();
        const currentYear = date.getFullYear().toString();
        const currentMonth = (date.getMonth() + 1).toString().padStart(2, '0');

        db.transaction((tx) => {
            tx.executeSql(
                `SELECT 
                    strftime('%Y', tanggal) as year,
                    strftime('%m', tanggal) as month,
                    SUM(CASE WHEN jenis = 'pengeluaran' THEN jumlah ELSE 0 END) as total_pengeluaran,
                    SUM(CASE WHEN jenis = 'pemasukan' THEN jumlah ELSE 0 END) as total_pemasukan,
                    SUM(CASE WHEN jenis = 'pemasukan' THEN jumlah ELSE -jumlah END) as saldo
                FROM catatan
                WHERE strftime('%Y', tanggal) = ? AND strftime('%m', tanggal) = ?
                GROUP BY year, month`,
                [currentYear, currentMonth],
                (_, { rows }) => {
                    if (rows.length > 0) {
                        const data = rows.item(0);
                        setCurrentMonthData({
                            month: getMonthName(data.month),
                            pengeluaran: formatCurrency(data.total_pengeluaran),
                            pemasukan: formatCurrency(data.total_pemasukan),
                            saldo: (data.saldo < 0 ? '-' : '') + formatCurrency(Math.abs(data.saldo)),
                        });
                    } else {
                        // If no data for current month, set default month name
                        setCurrentMonthData({
                            month: getMonthName(currentMonth),
                            pengeluaran: "0",
                            pemasukan: "0",
                            saldo: "0",
                        });
                    }
                },
                (error) => {
                    console.error("Error fetching current month data:", error);
                }
            );
        });
    };

    // Function to fetch budget data
    const fetchBudgetData = async () => {
        try {
            const date = new Date();
            const currentMonth = date.getMonth() + 1;
            const currentYear = date.getFullYear();

            // Get data from the model function used in BudgetReport
            const response = await GetPengeluaranByMonthAndYear(currentMonth, currentYear);

            // Look for total budget (id_kategori = 0 or '0')
            let total = response.find(item => item.id_kategori === '0' || item.id_kategori === 0);

            // If no total budget exists, calculate from categories
            if (!total) {
                const categories = response.filter(item => item.id_kategori !== '0' && item.id_kategori !== 0);
                const totalJumlah = categories.reduce((sum, item) => sum + item.jumlah, 0);
                const totalPengeluaran = categories.reduce((sum, item) => sum + item.total_pengeluaran, 0);
                const sisaAnggaran = totalJumlah - totalPengeluaran;

                total = {
                    jumlah: totalJumlah,
                    total_pengeluaran: totalPengeluaran,
                    sisa_anggaran: sisaAnggaran
                };
            }

            // Set budget data for display
            setBudgetData({
                tersisa: formatThousand(total.sisa_anggaran),
                anggaran: formatThousand(total.jumlah),
                pengeluaran: formatThousand(total.total_pengeluaran),
                percentage: hitungPersentase(total.total_pengeluaran, total.jumlah)
            });

        } catch (error) {
            console.error("Error fetching budget data:", error);
            // Keep default values in case of error
        }
    };

    const getMonthName = (monthNum) => {
        const months = {
            '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
            '05': 'Mei', '06': 'Jun', '07': 'Jul', '08': 'Agt',
            '09': 'Sep', '10': 'Okt', '11': 'Nov', '12': 'Des'
        };
        return months[monthNum] || monthNum;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    return (
        <SafeAreaCustom>
            {/* Header */}
            <Box bg="$yellow300" p={4} py={20}>
                <Text size="xl" fontWeight="bold" textAlign="center">
                    Laporan
                </Text>
            </Box>

            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {/* Statistik Bulanan */}
                <TouchableOpacity onPress={() => navigation.navigate('StackNav', { screen: "StatistikBulananScreen" })}>
                    <VStack space="xs">
                        <HStack justifyContent="space-between" alignItems="center" mb={3}>
                            <Text size="md" fontWeight="bold">
                                Statistik Bulanan
                            </Text>
                            <Icon as={ChevronRight} size="sm" />
                        </HStack>

                        <Box borderWidth={1} borderColor="#ddd" borderRadius={8} p={12} mb={16}>
                            <HStack mb={8}>
                                <Box flex={1}>
                                    <Text size="xs" color="#888">
                                        Bulan
                                    </Text>
                                </Box>
                                <Box flex={1.5}>
                                    <Text size="xs" color="#888">
                                        Pengeluaran
                                    </Text>
                                </Box>
                                <Box flex={1}>
                                    <Text size="xs" color="#888">
                                        Pemasukan
                                    </Text>
                                </Box>
                                <Box flex={1.5}>
                                    <Text size="xs" color="#888">
                                        Saldo
                                    </Text>
                                </Box>
                            </HStack>

                            <HStack>
                                <Box flex={1}>
                                    <Text fontWeight="medium">{currentMonthData.month}</Text>
                                </Box>
                                <Box flex={1.5}>
                                    <Text>{currentMonthData.pengeluaran}</Text>
                                </Box>
                                <Box flex={1}>
                                    <Text>{currentMonthData.pemasukan}</Text>
                                </Box>
                                <Box flex={1.5}>
                                    <Text>{currentMonthData.saldo}</Text>
                                </Box>
                            </HStack>
                        </Box>
                    </VStack>
                </TouchableOpacity>

                {/* Anggaran Bulanan */}
                <TouchableOpacity onPress={() => navigation.navigate('StackNav', { screen: 'BudgetReport' })}>
                    <VStack space="xs">
                        <HStack justifyContent="space-between" alignItems="center" mb={3}>
                            <Text size="md" fontWeight="bold">
                                Anggaran Bulanan
                            </Text>
                            <Icon as={ChevronRight} size="sm" />
                        </HStack>

                        <Box borderWidth={1} borderColor="#ddd" borderRadius={8} p={16}>
                            <HStack space="lg" alignItems="center">
                                {/* Progress Circle */}
                                <CircularProgress percentage={budgetData.percentage} />

                                {/* Detail Anggaran */}
                                <VStack flex={1} space="xs">
                                    <HStack justifyContent="space-between">
                                        <Text size="sm" color="#666">
                                            Tersisa :
                                        </Text>
                                        <Text
                                            color={budgetData.percentage >= 100 ? "$red500" : "$gray700"}
                                        >
                                            {budgetData.tersisa}
                                        </Text>
                                    </HStack>
                                    <HStack justifyContent="space-between">
                                        <Text size="sm" color="#666">
                                            Anggaran :
                                        </Text>
                                        <Text>{budgetData.anggaran}</Text>
                                    </HStack>
                                    <HStack justifyContent="space-between">
                                        <Text size="sm" color="#666">
                                            Pengeluaran :
                                        </Text>
                                        <Text
                                            color={budgetData.percentage >= 100 ? "$red500" : "$gray700"}
                                        >
                                            {budgetData.pengeluaran}
                                        </Text>
                                    </HStack>
                                </VStack>
                            </HStack>
                        </Box>
                    </VStack>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaCustom>
    );
};

const styles = StyleSheet.create({});

export { LaporanScreen };