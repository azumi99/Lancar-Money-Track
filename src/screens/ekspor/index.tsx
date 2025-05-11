import SafeAreaCustom from "@components/safeArea";
import {
    VStack,
    Text,
    Button,
    HStack,
    ScrollView,
    ButtonText,
    Spinner,
} from "@gluestack-ui/themed";
import React, { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import { View, Platform, PermissionsAndroid, Alert, NativeModules } from "react-native";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import { ShowToast } from "@components/toast";
import { months } from "./utils";
import {
    GetCatatan,
    InterfaceCatatan,
} from "@screens/catatan/models/crudCatatan";
import { formatThousand } from "@components/formatRibuan";
import dayjs from "dayjs";
import RNFS from 'react-native-fs';
import { Linking, TouchableOpacity, Share } from 'react-native';
import { Platform as ReactNativePlatform } from 'react-native';
import { playBeep } from "@utils/soundUtils";

const EksporScreen = () => {
    const [jenis, setJenis] = useState<string>("semua");
    const [bulan, setBulan] = useState<string>(`${new Date().getMonth() + 1}`);
    const [tahun, setTahun] = useState<string>(`${new Date().getFullYear()}`);
    const [isLoading, setIsLoading] = useState(false);
    const [catatanData, setCatatanData] = useState<InterfaceCatatan[]>([]);
    const [exportedFiles, setExportedFiles] = useState<
        { name: string; path: string; created_at: string }[]
    >([]);

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    useEffect(() => {
        const fetchCatatanData = async () => {
            try {
                const data = await GetCatatan();
                setCatatanData(data);
            } catch (error) {
                ShowToast("Gagal memuat data catatan.");
            }
        };
        fetchCatatanData();
        loadExportedFiles();
    }, []);

    const years = () => {
        if (catatanData.length === 0) return [currentYear.toString()];
        const yearSet = new Set(
            catatanData.map((item) =>
                Number(dayjs(item.tanggal).format("YYYY"))
            )
        );
        const yearArray = Array.from(yearSet).sort((a, b) => a - b);
        const lastYear = Math.max(...yearArray);
        const earliestAllowedYear = Math.max(
            lastYear - 5,
            Math.min(...yearArray)
        );
        const validYears = yearArray.filter(
            (y) => y >= earliestAllowedYear && y <= lastYear
        );
        if (!validYears.includes(currentYear + 1)) {
            validYears.push(currentYear + 1);
        }
        return validYears.map(String);
    };

    const loadExportedFiles = async () => {
        try {
            const basePath = `${RNFS.DocumentDirectoryPath}/exports`;

            const exists = await RNFS.exists(basePath);
            if (!exists) {
                await RNFS.mkdir(basePath);
                setExportedFiles([]);
                return;
            }

            const files = await RNFS.readDir(basePath);
            const pdfFiles = files
                .filter((file) => file.isFile() && file.name.endsWith(".pdf"))
                .map((file) => ({
                    name: file.name,
                    path: file.path,
                    created_at: new Date(file.mtime ?? file.ctime ?? Date.now()).toISOString(),
                }));

            pdfFiles.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            setExportedFiles(pdfFiles);
        } catch (err) {
            console.error("Gagal membaca file PDF", err);
        }
    };

    const requestStoragePermission = async () => {
        if (Platform.OS !== 'android') return true;

        try {
            if (parseInt(String(Platform.Version), 10) >= 33) {
                const permissions = [
                    PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
                    PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
                    PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
                ];

                const statuses = await PermissionsAndroid.requestMultiple(permissions);
                return Object.values(statuses).every(
                    status => status === PermissionsAndroid.RESULTS.GRANTED
                );
            } else {
                const writeGranted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: "Izin Penyimpanan",
                        message: "Aplikasi memerlukan izin untuk menyimpan file PDF",
                        buttonNeutral: "Tanya Nanti",
                        buttonNegative: "Batal",
                        buttonPositive: "OK"
                    }
                );

                const readGranted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
                );

                return writeGranted === PermissionsAndroid.RESULTS.GRANTED &&
                    readGranted === PermissionsAndroid.RESULTS.GRANTED;
            }
        } catch (err) {
            console.error("Gagal meminta izin", err);
            return false;
        }
    };

    const handleExportPDF = async () => {
        const permissionGranted = await requestStoragePermission();

        if (!permissionGranted) {
            Alert.alert(
                "Izin Ditolak",
                "Aplikasi memerlukan izin penyimpanan untuk mengekspor PDF. Silakan aktifkan izin di pengaturan aplikasi.",
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ]
            );
            return;
        }

        setIsLoading(true);

        try {
            const filteredData = catatanData.filter(item => {
                const itemMonth = dayjs(item.tanggal).format("M");
                const itemYear = dayjs(item.tanggal).format("YYYY");

                const matchesJenis = jenis === "semua" || item.jenis === jenis;
                const matchesMonth = bulan === "0" || itemMonth === bulan;
                const matchesYear = itemYear === tahun;

                return matchesJenis && matchesMonth && matchesYear;
            });

            if (filteredData.length === 0) {
                ShowToast("Tidak ada data untuk diekspor");
                setIsLoading(false);
                return;
            }

            const htmlContent = `
                <html>
                    <head>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                margin: 20px;
                            }
                            h1 {
                                color: #facc15;
                                text-align: center;
                            }
                            p {
                                font-size: 14px;
                                color: #333;
                            }
                            .report-table {
                                width: 100%;
                                border-collapse: collapse;
                                margin-top: 20px;
                            }
                            .report-table th, .report-table td {
                                border: 1px solid #ddd;
                                padding: 8px;
                                text-align: left;
                            }
                            .report-table th {
                                background-color: #facc15;
                            }
                            .summary {
                                margin-top: 20px;
                                font-weight: bold;
                            }
                        </style>
                    </head>
                    <body>
                        <h1>Laporan Keuangan</h1>
                        <p><strong>Jenis:</strong> ${jenis === "semua" ? "Semua Transaksi" : jenis}</p>
                        <p><strong>Bulan:</strong> ${bulan === "0" ? "Semua Bulan" : months[parseInt(bulan) - 1]}</p>
                        <p><strong>Tahun:</strong> ${tahun}</p>
        
                        <table class="report-table">
                            <thead>
                                <tr>
                                    <th>Jenis</th>
                                    <th>Jumlah</th>
                                    <th>Tanggal</th>
                                    <th>Catatan</th>
                                    <th>Kategori</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${filteredData.map(
                (item) => `
                                        <tr>
                                            <td>${item.jenis}</td>
                                            <td>${formatThousand(item.jumlah)} ${item.matauang}</td>
                                            <td>${dayjs(item.tanggal).format("DD/MM/YYYY")}</td>
                                            <td>${item.catatan || "-"}</td>
                                            <td>${item.title || "N/A"}</td>
                                        </tr>
                                    `
            ).join("")}
                            </tbody>
                        </table>
                        
                        <div class="summary">
                            <p>Total Pemasukan: ${formatThousand(
                filteredData
                    .filter(item => item.jenis === "pemasukan")
                    .reduce((sum, item) => sum + item.jumlah, 0)
            )} IDR</p>
                            <p>Total Pengeluaran: ${formatThousand(
                filteredData
                    .filter(item => item.jenis === "pengeluaran")
                    .reduce((sum, item) => sum + item.jumlah, 0)
            )} IDR</p>
                        </div>
                    </body>
                </html>
            `;

            const exportDir = `${RNFS.DocumentDirectoryPath}/exports`;
            const exists = await RNFS.exists(exportDir);
            if (!exists) {
                await RNFS.mkdir(exportDir);
            }

            const timestamp = Date.now();
            const fileName = `Laporan_${jenis}_${bulan}_${tahun}_${timestamp}.pdf`;
            const filePath = `${exportDir}/${fileName}`;

            const options = {
                html: htmlContent,
                fileName: fileName.replace(".pdf", ""),
                directory: Platform.OS === 'ios' ? 'Documents/exports' : 'exports',
            };

            const file = await RNHTMLtoPDF.convert(options);

            if (file.filePath) {
                const newExportedFile = {
                    name: fileName,
                    path: file.filePath,
                    created_at: new Date().toISOString()
                };

                setExportedFiles(prev => [newExportedFile, ...prev]);
                ShowToast("Berhasil mengekspor PDF");

                // Also save to downloads folder if possible
                if (Platform.OS === 'android') {
                    try {
                        const downloadPath = `${RNFS.DownloadDirectoryPath}/${fileName}`;
                        await RNFS.copyFile(file.filePath, downloadPath);
                        ShowToast("PDF juga tersimpan di folder Download");
                    } catch (err) {
                        console.log("Gagal menyimpan ke Downloads", err);
                    }
                }
            } else {
                ShowToast("Gagal membuat file PDF");
            }
        } catch (error) {
            console.error("Error saat mengekspor PDF:", error);
            ShowToast("Gagal mengekspor PDF");
        } finally {
            setIsLoading(false);
        }
    };



    const formatDisplayDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleString('id-ID', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return dateString;
        }
    };

    return (
        <SafeAreaCustom>
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <VStack
                    space="lg"
                    bgColor="#FFF9EC"
                    padding={20}
                    borderRadius={20}
                    style={{
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 5,
                        elevation: 3,
                    }}
                >
                    <Text size="xl" fontWeight="bold" color="#F59E0B">
                        Filter Laporan
                    </Text>

                    <View style={{ backgroundColor: "#FFE59D", borderRadius: 10 }}>
                        <Picker
                            mode="dropdown"
                            selectedValue={jenis}
                            onValueChange={(val) => { playBeep(); setJenis(val) }}
                            style={{ color: "#333333" }}
                        >
                            <Picker.Item label="Semua" value="semua" />
                            <Picker.Item label="Pemasukan" value="pemasukan" />
                            <Picker.Item label="Pengeluaran" value="pengeluaran" />
                            <Picker.Item label="Transfer" value="transfer" />
                        </Picker>
                    </View>

                    <HStack space="md">
                        <View style={{ flex: 1, backgroundColor: "#FFE3A3", borderRadius: 10 }}>
                            <Picker
                                selectedValue={bulan}
                                onValueChange={(val) => { playBeep(); setBulan(val) }}
                                style={{ color: "#333" }}
                            >
                                <Picker.Item label="Semua Bulan" value="0" />
                                {months.map((m, i) => (
                                    <Picker.Item key={i} label={`${m}`} value={`${i + 1}`} />
                                ))}
                            </Picker>
                        </View>

                        <View style={{ flex: 1, backgroundColor: "#FFE3A3", borderRadius: 10 }}>
                            <Picker
                                selectedValue={tahun}
                                onValueChange={(val) => { playBeep(); setTahun(val) }}
                                style={{ color: "#333" }}
                            >
                                {years().map((y) => (
                                    <Picker.Item key={y} label={`${y}`} value={`${y}`} />
                                ))}
                            </Picker>
                        </View>
                    </HStack>

                    <Button
                        bg="#F59E0B"
                        borderRadius={10}
                        onPress={() => { playBeep(); handleExportPDF() }}
                        isDisabled={isLoading}
                        style={{
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.15,
                            shadowRadius: 4,
                            elevation: 3,
                        }}
                    >
                        <ButtonText color="#FFF" fontWeight="bold" fontSize="$md">
                            {isLoading ? "Mengekspor..." : "Ekspor PDF"}
                        </ButtonText>
                        {isLoading && (
                            <Spinner size="small" color="#FFF" style={{ marginLeft: 10 }} />
                        )}
                    </Button>
                </VStack>

            </ScrollView>
        </SafeAreaCustom>
    );
};

export { EksporScreen };