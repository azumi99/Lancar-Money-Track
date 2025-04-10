import { PadStore, useCurrency, useDefaultOpenRek, useHookActionCurrency, useHookDataCurrency, useKategoriStorePengeluaran, useRekeningData, useRekeningTransferStore, useSelectedKategori } from "@config/store";
import React, { useCallback, useEffect, useState } from "react";
import { useWindowDimensions, StyleSheet } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { Asset, CameraOptions, ImageLibraryOptions, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { getCurrencyRates } from "@services/Currency/getCurrency";
import { Pemasukan } from "@screens/add/pemasukanScreen";
import { Pengeluaran } from "@screens/add/pengeluaranScreen";
import { Transfer } from "@screens/add/transferScreen";
import { DateModal } from "@screens/add/componenets/pickDateModal";
import { SheetPickRekening } from "@screens/add/componenets/sheetPickRekening";
import { SheetSelectMedia } from "@screens/add/componenets/sheetSelectMedia";
import { SheetManageImage } from "@screens/add/componenets/sheetManageImage";
import { PadFormAdd } from "./componenets/padFormAdd";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { View } from "@gluestack-ui/themed";
import { ActionCurrencyScreen } from "@screens/profile/detailPengaturan/pengaturanCurrency/actionCurrencyScreen";
import { AddCatatan, GetCatatan, UpdateCatatan } from "@screens/catatan/models/crudCatatan";
import { ShowToast } from "@components/toast";
import RNFS from 'react-native-fs';
import { GetRekeningById, UpdateJumlah } from "@screens/profile/detailPengaturan/pengaturanRekening/modelRekening";
import { fetchRekening } from "@screens/profile/detailPengaturan/pengaturanRekening/globalFuncGetRekening";


const renderScene = SceneMap({
    pemasukan: Pemasukan,
    pengeluaran: Pengeluaran,
    transfer: Transfer

});

const AddScreen = ({ route }) => {
    const navigation = useNavigation<any>();
    const layout = useWindowDimensions();
    const defaultTab = route.params?.data ? route.params?.data.jenis : 0; // bisa juga 2

    const [nominal, setnominal] = useState(0);
    const [catatan, setCatatan] = useState(route.params?.data ? route.params?.data.catatan : '');
    const { pad, setPad } = PadStore();
    const [showModal, setShowModal] = useState(false)
    const { handleOpen, setHandleOpen } = useHookActionCurrency();
    const { defaultHandle, setHandleDefault } = useDefaultOpenRek();
    const [showActionsheet, setShowActionsheet] = useState(false)
    const handleClose = () => setShowActionsheet(!showActionsheet)
    const [sheetCamera, setSheetCamera] = React.useState(false)
    const handleCamera = () => setSheetCamera(!sheetCamera)
    const [imageManage, setImageManage] = React.useState(false)
    const handleImage = () => setImageManage(!imageManage)
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [images, setImages] = useState<{ uri: string; base64: string }[]>([]);
    const { selectedCurrency, setSelectedCurrency } = useHookDataCurrency();
    const { currency: dataCurrency } = useCurrency();
    const { selectedIndex, setSelectedIndex } = useSelectedKategori();
    const handleActionCurrency = () => setHandleOpen(!handleOpen)
    const defaultCurrency = dataCurrency.find(value => value.is_default);
    const [input, setInput] = useState(route.params?.data ? route.params?.data.jumlah : "");
    const { rekening, setRekening } = useRekeningData();
    const defaultSelect = rekening.find(value => value.is_default);
    const [selectedRekening, setSelectedRekening] = useState<number | undefined>(route.params?.data ? route.params?.data.id_rekening : defaultSelect?.key);

    const { selectedRekeningFrom, selectedRekeningTo, setSelectedRekeningFrom, setSelectedRekeningTo } = useRekeningTransferStore();

    const ref = React.useRef(null)
    const getFormattedDate = () => {
        const today = new Date(date);
        const year = today.getFullYear();
        const month = today.toLocaleString('default', { month: 'short' });
        const day = String(today.getDate()).padStart(2, '0');
        return `${day}-${month}-${year}`;
    };

    console.log('date', new Date().toISOString().slice(0, 10))
    const [routes] = useState([

        { key: "pengeluaran", title: "Pengeluaran" },
        { key: "pemasukan", title: "Pemasukan" },
        { key: "transfer", title: "Transfer" },
    ]);
    const [index, setIndex] = useState(() => {
        if (typeof defaultTab === 'number') return defaultTab;

        const defaultIndex = routes.findIndex(route => route.key === defaultTab);
        return defaultIndex !== -1 ? defaultIndex : 0;
    });


    const openCamera = () => {
        const options: CameraOptions = {
            mediaType: 'photo',
            quality: 1,
            includeBase64: true,
            saveToPhotos: true,
        };

        launchCamera(options, handleImageSelection);

    };
    const openImageLibrary = () => {
        const options: ImageLibraryOptions = {
            mediaType: 'photo',
            quality: 1,
            includeBase64: true,
        };

        launchImageLibrary(options, handleImageSelection);

    };

    const handleImageSelection = (response: { assets?: Asset[] }) => {
        if (response.assets && response.assets.length > 0) {
            const newImages = response.assets.map((asset) => ({
                uri: asset.uri || '',
                base64: asset.base64 || '',
            }));
            setImages((prevImages) => [...prevImages, ...newImages]);
            setSheetCamera(false);
        }
    };
    const removeImage = (index: number) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    const renderTabBar = (props) => (
        <TabBar
            {...props}
            style={styles.tabBar}
            inactiveColor="black"
            indicatorStyle={styles.indicator}
        />
    );

    const currency = async () => {
        try {
            const response = await getCurrencyRates();
            const rates = response.rates;

            const baseToIDR: Record<string, number> = {};
            for (const [key, value] of Object.entries(rates)) {
                if (typeof value === "number") {
                    baseToIDR[key] = key === "IDR" ? 1 : 1 / value;
                }
            }

            // console.log("Rates with IDR as base:", baseToIDR);
        } catch (error) {
            console.log("Error:", error);
        }
    };

    useEffect(() => {
        currency();
    }, [])
    useEffect(() => {
        pad && defaultHandle && routes[index].key !== "transfer" ? setShowActionsheet(true) : setShowActionsheet(false);
    }, [pad])
    useFocusEffect(
        useCallback(() => {
            fetchRekening({ rekening, setRekening });
            route.params?.data ? setSelectedIndex(String(route.params?.data.id_kategori)) : setSelectedIndex('');
            route.params?.data ? setPad(true) : setPad(false)
            defaultCurrency && setSelectedCurrency(defaultCurrency?.short_code);
            setSelectedRekeningFrom(undefined);
            setSelectedRekeningTo(undefined);
            routes[index].key === "transfer" && setSelectedIndex("");
            route.params?.data && routes[index].key === "transfer" && setSelectedRekeningTo(route.params?.data.id_rekening_tf);
            route.params?.data && routes[index].key === "transfer" && setSelectedRekeningFrom(route.params?.data.id_rekening);
        }, []),
    );
    console.log('render', route.params?.data)

    const funcSave = async () => {
        try {
            if (!input) return ShowToast('Nominal tidak boleh kosong!');
            if (!catatan) return ShowToast('Catatan tidak boleh kosong!');

            const imagePaths = await Promise.all(
                images.map(async (img, index) => {
                    const filename = `img_${Date.now()}_${index}.jpg`;
                    const path = `${RNFS.DocumentDirectoryPath}/${filename}`;
                    await RNFS.writeFile(path, img.base64, 'base64');
                    return path;
                })
            );

            const jumlahInput = Number(input);
            const jenis = routes[index].key;
            const isEdit = !!route.params?.data;

            const oldData = route.params?.data;
            const rekeningValue = jenis === "transfer" ? selectedRekeningFrom : selectedRekening;

            // === STEP 1: KEMBALIKAN SALDO TRANSAKSI LAMA SAAT EDIT ===
            if (isEdit) {
                const oldJumlah = oldData.jumlah;
                const oldJenis = oldData.jenis;
                const oldRek = await GetRekeningById(oldData.id_rekening);
                const oldRekTf = await GetRekeningById(oldData.id_rekening_tf);

                if (oldJenis === 'pemasukan') {
                    if (oldRek) await UpdateJumlah(oldRek.key, oldRek.jumlah - oldJumlah);
                }
                if (oldJenis === 'pengeluaran') {
                    if (oldRek) await UpdateJumlah(oldRek.key, oldRek.jumlah + oldJumlah);
                }
                if (oldJenis === 'transfer') {
                    if (oldRek) await UpdateJumlah(oldRek.key, oldRek.jumlah + oldJumlah);
                    if (oldRekTf) await UpdateJumlah(oldRekTf.key, oldRekTf.jumlah - oldJumlah);
                }
            }

            // === STEP 2: VALIDASI DAN PROSES SALDO BARU ===
            if (jenis === 'transfer') {
                if (
                    selectedRekeningFrom === undefined ||
                    selectedRekeningTo === undefined
                ) {
                    ShowToast('Rekening asal dan tujuan harus dipilih');
                    return;
                }

                if (selectedRekeningFrom === selectedRekeningTo) {
                    ShowToast('Rekening asal dan tujuan tidak boleh sama');
                    return;
                }

                const rekFrom = await GetRekeningById(selectedRekeningFrom);
                const rekTo = await GetRekeningById(selectedRekeningTo);

                if (!rekFrom || !rekTo) {
                    ShowToast('Rekening tidak ditemukan');
                    return;
                }

                if ((rekFrom.jumlah ?? 0) < jumlahInput) {
                    ShowToast('Saldo tidak cukup');
                    return;
                }

                await UpdateJumlah(rekFrom.key, rekFrom.jumlah - jumlahInput);
                await UpdateJumlah(rekTo.key, rekTo.jumlah + jumlahInput);
            }

            if (jenis === 'pemasukan') {
                if (!selectedRekening) {
                    ShowToast('Pilih rekening terlebih dahulu');
                    return;
                }
                const rek = await GetRekeningById(selectedRekening);
                if (!rek) {
                    ShowToast('Rekening tidak ditemukan');
                    return;
                }

                await UpdateJumlah(rek.key, rek.jumlah + jumlahInput);
            }

            if (jenis === 'pengeluaran') {
                if (!selectedRekening) {
                    ShowToast('Pilih rekening terlebih dahulu');
                    return;
                }
                const rek = await GetRekeningById(selectedRekening);
                if (!rek) {
                    ShowToast('Rekening tidak ditemukan');
                    return;
                }

                if ((rek.jumlah ?? 0) < jumlahInput) {
                    ShowToast('Saldo tidak cukup');
                    return;
                }

                await UpdateJumlah(rek.key, rek.jumlah - jumlahInput);
            }

            // === STEP 3: SIMPAN DATA ===
            const data = {
                jenis,
                jumlah: jumlahInput,
                tanggal: date,
                catatan: catatan,
                image: JSON.stringify(imagePaths),
                matauang: selectedCurrency,
                id_kategori: Number(selectedIndex),
                id_rekening_tf: selectedRekeningTo,
                id_rekening: rekeningValue
            };

            if (isEdit) {
                await UpdateCatatan(
                    oldData.id,
                    data.jenis,
                    data.jumlah,
                    data.tanggal,
                    data.catatan,
                    data.image,
                    data.matauang,
                    data.id_rekening,
                    data.id_rekening_tf,
                    data.id_kategori
                );
            } else {
                await AddCatatan(
                    data.jenis,
                    data.jumlah,
                    data.tanggal,
                    data.catatan,
                    data.image,
                    data.matauang,
                    data.id_rekening,
                    data.id_rekening_tf,
                    data.id_kategori
                );
            }

            navigation.goBack();
        } catch (error) {
            console.error('funcSave error:', error);
            ShowToast('Ada masalah saat menyimpan!');
        }
    };




    useFocusEffect(
        useCallback(() => {
            if (routes[index].key === "transfer") {
                if (selectedRekeningFrom !== undefined && selectedRekeningTo !== undefined) {
                    setPad(true);
                }
            }
        }, [index, selectedRekeningFrom, selectedRekeningTo])
    );

    return (
        <>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={(index) => { setIndex(index); setPad(false); setDate(new Date().toISOString().slice(0, 10)); setImages([]); }}
                initialLayout={{ width: layout.width }}
                renderTabBar={renderTabBar} />
            <DateModal showModal={showModal} setShowModal={setShowModal} getFormatedDate={getFormattedDate()} setDate={setDate} date={date} />
            <SheetPickRekening selectedRekening={selectedRekening} showActionsheet={showActionsheet} handleClose={handleClose} handleToggle={defaultHandle} setHandleToggle={setHandleDefault} setSelectedRekening={(value) => setSelectedRekening(value)} />
            <SheetSelectMedia sheetCamera={sheetCamera} handleCamera={handleCamera} openCamera={openCamera} openImageLibrary={openImageLibrary} />
            <SheetManageImage imageManage={imageManage} handleImage={handleImage} images={images} removeImage={removeImage} handleCamera={handleCamera} />
            <ActionCurrencyScreen showActionsheet={handleOpen} handleClose={handleActionCurrency} matauang={selectedCurrency} setMataUang={setSelectedCurrency} />

            {pad &&
                <PadFormAdd catatan={catatan} handleClose={handleClose} input={input} images={images} handleImage={handleImage} handleCamera={handleCamera} setCatatan={setCatatan} setInput={setInput} setShowModal={setShowModal} funcSave={funcSave} date={date === new Date().toISOString().slice(0, 10) ? 'Hari Ini' : date} showRekening={routes[index].key !== "transfer"} />
            }

        </>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: "#fde047",
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
        marginHorizontal: 16,
        borderRadius: 25,
        overflow: "hidden",
        color: 'black',
        marginVertical: 10
    },

    indicator: {
        backgroundColor: "black",
        height: "100%",
        borderRadius: 25,
    },
});

export { AddScreen };
