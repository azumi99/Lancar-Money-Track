import React, { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { GluestackUIProvider, StatusBar, useColorMode } from '@gluestack-ui/themed';
import { NavigatorScreen } from './src/navigation';
import { config } from './src/config/customTheme';
import { DarkModeStore, useCurrency, useKategoriStorePemasukan } from '@config/store';
import { db } from '@config/dbService';
import { Buffer } from 'buffer';
import { CreateTableKategori } from '@screens/profile/detailPengaturan/pengaturanKategori/modelKategori';
import { CreateTableCatatan } from '@screens/catatan/models/crudCatatan';
import { CreateTableRekening } from '@screens/profile/detailPengaturan/pengaturanRekening/modelRekening';
import { initSound } from '@utils/soundUtils';
import { fetchPemasukan, fetchPengeluaran } from '@screens/profile/detailPengaturan/pengaturanKategori/globalGetFunctionKategori';
import { initialize } from '@screens/profile/detailPengaturan/pengaturanCurrency/utils';
import { CurrencyItemInterface } from '@screens/profile/detailPengaturan/pengaturanCurrency/currencyScreen';
import { configureBackgroundTasks, initializeDatabases, setupAppStateListener } from '@screens/pembayaran/helper';
import { CreateTablePembayaranRegular } from '@screens/pembayaran/model';
import PushNotification from 'react-native-push-notification';
import { CreateTableAnggaran } from '@screens/anggaran/model';


const App = () => {
  const colorMode = useColorMode();
  const isDarkMode = useColorScheme() === colorMode;
  const { kategori, setKategori } = useKategoriStorePemasukan();
  const { currency, setCurrency } = useCurrency();
  const [filteredData, setFilteredData] = useState<CurrencyItemInterface[]>([])
  const [isLoading, setIsLoading] = useState(true);
  const { mode, setMode } = DarkModeStore();

  if (typeof global.Buffer === 'undefined') {
    global.Buffer = Buffer;
  }

  const backgroundStyle = {
    backgroundColor: isDarkMode ? 'white' : 'black',
  };
  useEffect(() => {
    db
    CreateTableKategori();
    CreateTableCatatan();
    CreateTableRekening();
    CreateTablePembayaranRegular();
    initializeDatabases();
    configureBackgroundTasks();
    CreateTableAnggaran();
    initSound();
    kategori.length < 1 && fetchPemasukan({ kategori, setKategori });
    kategori.length < 1 && fetchPengeluaran({ kategori, setKategori });
    currency.length < 1 && initialize({ currency, setCurrency, setFilteredData, setIsLoading })

    PushNotification.createChannel(
      {
        channelId: "reminder-channels",
        channelName: "Reminder Channel",
      },
      (created) => console.log(`createChannel returned '${created}'`)
    );


    const unsubscribe = setupAppStateListener();

    // Cleanup
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <GluestackUIProvider config={config} colorMode={mode ? 'dark' : 'light'}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={'$yellow300'}
      />
      <NavigatorScreen />
    </GluestackUIProvider>
  );
};

export default App;
