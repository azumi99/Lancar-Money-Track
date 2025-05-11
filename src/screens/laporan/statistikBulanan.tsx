import SafeAreaCustom from "@components/safeArea";
import {
    ScrollView,
    Box,
    Text,
    HStack,
    VStack,
    Icon,
    Center,
    Pressable,
    Select,
    SelectTrigger,
    SelectInput,
    SelectPortal,
    SelectBackdrop,
    SelectContent,
    SelectDragIndicator,
    SelectDragIndicatorWrapper,
    SelectItem,
    ChevronDownIcon,
} from "@gluestack-ui/themed";
import React, { useState, useEffect } from "react";
import { Dimensions } from "react-native";
import {
    ChevronLeft,
    Eye,
    TrendingUp,
    TrendingDown,
    Calendar,
    Filter as FilterIcon,
} from "lucide-react-native";
import { db } from "@config/dbService";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

type MonthlyItem = {
    year: string;
    month: string;
    total_pengeluaran: number;
    total_pemasukan: number;
    saldo: number;
};

const StatistikBulananScreen = () => {
    const navigation = useNavigation();
    const [monthlyData, setMonthlyData] = useState<MonthlyItem[]>([]);
    const [filteredData, setFilteredData] = useState<MonthlyItem[]>([]);
    const [totalSaldo, setTotalSaldo] = useState(0);
    const [totalPengeluaran, setTotalPengeluaran] = useState(0);
    const [totalPemasukan, setTotalPemasukan] = useState(0);
    const [currentTab, setCurrentTab] = useState("all");

    const [years, setYears] = useState<string[]>([]);
    const months = [
        "01", "02", "03", "04", "05", "06",
        "07", "08", "09", "10", "11", "12"
    ];
    const [selectedYear, setSelectedYear] = useState<string>("all");
    const [selectedMonth, setSelectedMonth] = useState<string>("all");

    useEffect(() => {
        fetchMonthlyData();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [monthlyData, selectedYear, selectedMonth, currentTab]);

    const fetchMonthlyData = () => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT 
          strftime('%Y', tanggal) as year,
          strftime('%m', tanggal) as month,
          SUM(CASE WHEN jenis = 'pengeluaran' THEN jumlah ELSE 0 END) as total_pengeluaran,
          SUM(CASE WHEN jenis = 'pemasukan' THEN jumlah ELSE 0 END) as total_pemasukan,
          SUM(CASE WHEN jenis = 'pemasukan' THEN jumlah ELSE -jumlah END) as saldo
        FROM catatan
        GROUP BY year, month
        ORDER BY year DESC, month DESC`,
                [],
                (_, { rows }) => {
                    const data: MonthlyItem[] = rows.raw();
                    setMonthlyData(data);
                    setFilteredData(data);

                    const uniqueYears = [...new Set(data.map((item) => item.year))];
                    setYears(uniqueYears.sort((a, b) => b.localeCompare(a)));

                    updateTotals(data);
                },
                (error) => {
                    console.error("Error fetching monthly data:", error);
                }
            );
        });
    };

    const updateTotals = (data: MonthlyItem[]) => {
        let pengeluaran = 0;
        let pemasukan = 0;
        let saldo = 0;

        data.forEach((item) => {
            pengeluaran += item.total_pengeluaran;
            pemasukan += item.total_pemasukan;
            saldo += item.total_pemasukan - item.total_pengeluaran;
        });

        setTotalPengeluaran(pengeluaran);
        setTotalPemasukan(pemasukan);
        setTotalSaldo(saldo);
    };

    const applyFilters = () => {
        let filtered = [...monthlyData];

        if (selectedYear !== "all") {
            filtered = filtered.filter((item) => item.year === selectedYear);
        }

        if (selectedMonth !== "all") {
            filtered = filtered.filter((item) => item.month === selectedMonth);
        }

        if (currentTab === "expenses") {
            filtered = filtered.filter((item) => item.total_pengeluaran > 0);
        } else if (currentTab === "income") {
            filtered = filtered.filter((item) => item.total_pemasukan > 0);
        }

        setFilteredData(filtered);
        updateTotals(filtered);
    };

    const getMonthName = (monthNum: string): string => {
        const monthNames: { [key: string]: string } = {
            "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr",
            "05": "Mei", "06": "Jun", "07": "Jul", "08": "Agt",
            "09": "Sep", "10": "Okt", "11": "Nov", "12": "Des"
        };
        return monthNames[monthNum] || monthNum;
    };

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat("id-ID", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    const groupedByYear = filteredData.reduce<{ [key: string]: MonthlyItem[] }>(
        (acc, item) => {
            if (!acc[item.year]) acc[item.year] = [];
            acc[item.year].push(item);
            return acc;
        },
        {}
    );

    const sortedYears = Object.keys(groupedByYear).sort((a, b) =>
        b.localeCompare(a)
    );

    return (
        <SafeAreaCustom>
            <VStack space="xs" bg="$yellow300" px={10} py={20} borderBottomLeftRadius={20} borderBottomRightRadius={20}>
                <Box bg="$white" mx={4} mt={4} py={20} borderRadius={16} p={4}>
                    <VStack space="sm" alignItems="center" mb={4}>
                        <Text color="$gray600" size="sm">Saldo Total</Text>
                        <Text size="3xl" fontWeight="bold" color="$gray800">
                            {totalSaldo >= 0 ? "" : "-"}{formatCurrency(Math.abs(totalSaldo))}
                        </Text>
                    </VStack>

                    <HStack space="md" justifyContent="center">
                        {["expenses", "income"].map((tab) => (
                            <Pressable
                                key={tab}
                                bg={currentTab === tab ? "$blue50" : "$white"}
                                borderRadius={12}
                                borderWidth={currentTab === tab ? 1 : 0}
                                borderColor="$blue500"
                                p={3}
                                w="48%"
                                alignItems="center"
                                onPress={() => setCurrentTab(tab)}
                            >
                                <Center bg={tab === "expenses" ? "$red100" : "$green100"} borderRadius="$full">
                                    <Icon as={tab === "expenses" ? TrendingDown : TrendingUp} size="sm" color={tab === "expenses" ? "$red500" : "$green600"} />
                                </Center>
                                <VStack mt={2}>
                                    <Text color="$gray600" size="xs">
                                        {tab === "expenses" ? "Pengeluaran" : "Pemasukan"}
                                    </Text>
                                    <Text fontWeight="bold" color="$gray800">
                                        {formatCurrency(tab === "expenses" ? totalPengeluaran : totalPemasukan)}
                                    </Text>
                                </VStack>
                            </Pressable>
                        ))}
                    </HStack>
                </Box>

                <HStack bg="$white" mx={4} borderRadius="$lg" p={1} justifyContent="space-between">
                    {["all", "expenses", "income"].map((tab) => (
                        <Pressable
                            key={tab}
                            flex={1}
                            py={5}
                            alignItems="center"
                            bg={currentTab === tab ? "$blue50" : "transparent"}
                            borderRadius={8}
                            onPress={() => setCurrentTab(tab)}
                        >
                            <Text fontWeight="medium" color={currentTab === tab ? "$blue600" : "$gray600"}>
                                {tab === "all" ? "Semua" : tab === "expenses" ? "Pengeluaran" : "Pemasukan"}
                            </Text>
                        </Pressable>
                    ))}
                </HStack>
            </VStack>

            <Box p={4} bg="$white" mx={10} my={4} borderRadius="$lg">
                <HStack space="md" alignItems="center" mb={2}>
                    <Icon as={FilterIcon} size="sm" color="$gray600" />
                    <Text fontWeight="medium" color="$gray700">Filter</Text>
                </HStack>

                <HStack space="md" justifyContent="space-between">
                    <Box w="48%">
                        <Select selectedValue={selectedYear} onValueChange={setSelectedYear}>
                            <SelectTrigger variant="outline" borderRadius={10} size="md" borderColor="$secondary200">
                                <SelectInput placeholder="Tahun" />
                                <ChevronDownIcon mr={3} size="sm" />
                            </SelectTrigger>
                            <SelectPortal>
                                <SelectBackdrop />
                                <SelectContent>
                                    <SelectDragIndicatorWrapper>
                                        <SelectDragIndicator />
                                    </SelectDragIndicatorWrapper>
                                    <SelectItem label="Semua Tahun" value="all" />
                                    {years.map((year) => (
                                        <SelectItem key={year} label={year} value={year} />
                                    ))}
                                </SelectContent>
                            </SelectPortal>
                        </Select>
                    </Box>

                    <Box w="48%">
                        <Select selectedValue={selectedMonth} onValueChange={setSelectedMonth}>
                            <SelectTrigger variant="outline" borderRadius={10} size="md" borderColor="$secondary200">
                                <SelectInput placeholder="Bulan" />
                                <ChevronDownIcon mr={3} size="sm" />
                            </SelectTrigger>
                            <SelectPortal>
                                <SelectBackdrop />
                                <SelectContent>
                                    <SelectDragIndicatorWrapper>
                                        <SelectDragIndicator />
                                    </SelectDragIndicatorWrapper>
                                    <SelectItem label="Semua Bulan" value="all" />
                                    {months.map((month) => (
                                        <SelectItem key={month} label={getMonthName(month)} value={month} />
                                    ))}
                                </SelectContent>
                            </SelectPortal>
                        </Select>
                    </Box>
                </HStack>
            </Box>

            {/* Table */}
            <ScrollView flex={1} px={10} showsVerticalScrollIndicator={false}>
                <HStack bg="$gray50" p={4} borderRadius="$md" mx={4} mb={2}>
                    <Box w="25%"><Text size="xs" fontWeight="medium" color="$gray600">Bulan</Text></Box>
                    <Box w="25%"><Text size="xs" fontWeight="medium" color="$gray600">Pengeluaran</Text></Box>
                    <Box w="25%"><Text size="xs" fontWeight="medium" color="$gray600">Pemasukan</Text></Box>
                    <Box w="25%" alignItems="flex-end"><Text size="xs" fontWeight="medium" color="$gray600">Saldo</Text></Box>
                </HStack>

                {sortedYears.map((year) => (
                    <Box key={year} mb={4} mx={4}>
                        <HStack alignItems="center" bg="$gray100" p={3} borderRadius="$md" mb={2}>
                            <Icon as={Calendar} size="sm" color="$gray600" mr={2} />
                            <Text fontWeight="bold" color="$gray700">{year}</Text>
                        </HStack>

                        {groupedByYear[year].map((item, idx) => (
                            <Box key={`${item.year}-${item.month}-${idx}`} bg="$white" p={5} borderRadius="$md" mb={2}>
                                <HStack alignItems="center">
                                    <Box w="25%"><Text fontWeight="medium">{getMonthName(item.month)}</Text></Box>
                                    <Box w="25%"><Text color="$gray700">{formatCurrency(item.total_pengeluaran)}</Text></Box>
                                    <Box w="25%"><Text color="$gray700">{formatCurrency(item.total_pemasukan)}</Text></Box>
                                    <Box w="25%" alignItems="flex-end">
                                        <HStack alignItems="center" space="xs">
                                            {item.saldo !== 0 && (
                                                <Icon as={item.saldo >= 0 ? TrendingUp : TrendingDown} size="xs" color={item.saldo >= 0 ? "$green600" : "$red500"} />
                                            )}
                                            <Text fontWeight="bold" color={item.saldo < 0 ? "$red500" : "$green600"}>
                                                {item.saldo < 0 ? '-' : ''}{formatCurrency(Math.abs(item.saldo))}
                                            </Text>
                                        </HStack>
                                    </Box>
                                </HStack>
                            </Box>
                        ))}
                    </Box>
                ))}
                <Box h={20} />
            </ScrollView>
        </SafeAreaCustom>
    );
};

export { StatistikBulananScreen };
