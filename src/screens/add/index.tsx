import { PadStore } from "@config/store";
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
import { useFocusEffect } from "@react-navigation/native";


const renderScene = SceneMap({
    pemasukan: Pemasukan,
    pengeluaran: Pengeluaran,
    transfer: Transfer

});

const AddScreen = () => {
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);
    const [nominal, setnominal] = useState(0);
    const [catatan, setCatatan] = useState('');
    const { pad, setPad } = PadStore();
    const [showModal, setShowModal] = useState(false)
    const [showActionsheet, setShowActionsheet] = React.useState(false)
    const handleClose = () => setShowActionsheet(!showActionsheet)
    const [sheetCamera, setSheetCamera] = React.useState(false)
    const handleCamera = () => setSheetCamera(!sheetCamera)
    const [imageManage, setImageManage] = React.useState(false)
    const handleImage = () => setImageManage(!imageManage)
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [images, setImages] = useState<{ uri: string; base64: string }[]>([]);
    const [convertedRates, setConvertedRates] = useState({});
    const [input, setInput] = useState("");
    console.log(date)
    const ref = React.useRef(null)
    const getFormattedDate = () => {
        const today = new Date(date);
        const year = today.getFullYear();
        const month = today.toLocaleString('default', { month: 'short' });
        const day = String(today.getDate()).padStart(2, '0');
        return `${day}-${month}-${year}`;
    };
    const [routes] = useState([

        { key: "pengeluaran", title: "Pengeluaran" },
        { key: "pemasukan", title: "Pemasukan" },
        { key: "transfer", title: "Transfer" },
    ]);

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

            console.log("Rates with IDR as base:", baseToIDR);
        } catch (error) {
            console.log("Error:", error);
        }
    };

    useEffect(() => {
        currency();
    }, [])
    useFocusEffect(
        useCallback(() => {
            setPad(false)
        }, []),
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
            <SheetPickRekening showActionsheet={showActionsheet} handleClose={handleClose} />
            <SheetSelectMedia sheetCamera={sheetCamera} handleCamera={handleCamera} openCamera={openCamera} openImageLibrary={openImageLibrary} />
            <SheetManageImage imageManage={imageManage} handleImage={handleImage} images={images} removeImage={removeImage} handleCamera={handleCamera} />

            {pad &&
                <PadFormAdd handleClose={handleClose} input={input} images={images} handleImage={handleImage} handleCamera={handleCamera} setCatatan={setCatatan} setInput={setInput} setShowModal={setShowModal} />
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
