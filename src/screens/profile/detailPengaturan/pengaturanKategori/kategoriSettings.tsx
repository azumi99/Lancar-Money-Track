import SafeAreaCustom from "@components/safeArea"
import { View } from "@gluestack-ui/themed"
import React, { useEffect, useState } from "react"
import { StyleSheet, useWindowDimensions } from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { SettingsPemasukan } from "@screens/profile/detailPengaturan/pengaturanKategori/SettingsPemasukan";
import { SettingsPengeluaran } from "@screens/profile/detailPengaturan/pengaturanKategori/SettingsPengeluaran";
import { CreateTableKategori, GetKategori, handleAddHarcodeKategori } from "@screens/profile/detailPengaturan/pengaturanKategori/modelKategori";

const renderScene = SceneMap({
    SettingsPemasukan: SettingsPemasukan,
    SettingsPengeluaran: SettingsPengeluaran,
});

const KategoriSettings = () => {
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);
    const [routes] = useState([

        { key: "SettingsPengeluaran", title: "Pengeluaran" },
        { key: "SettingsPemasukan", title: "Pemasukan" },
    ]);
    const renderTabBar = (props) => (
        <TabBar
            {...props}
            style={styles.tabBar}
            inactiveColor="black"
            indicatorStyle={styles.indicator}
        />
    );

    

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={(index) => setIndex(index)}
            initialLayout={{ width: layout.width }}
            renderTabBar={renderTabBar} />

    )
}
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

export { KategoriSettings }