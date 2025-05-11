import React, { useEffect, useState } from 'react';
// import {HomeScreen} from '@screens/Home';
import { TabNav } from '@navigation/tabNav';
import { StackNavigation } from '@navigation/stackNav';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { CreateTableKategori } from '@screens/profile/detailPengaturan/pengaturanKategori/modelKategori';
import { CreateTableCatatan } from '@screens/catatan/models/crudCatatan';
import { CreateTableRekening } from '@screens/profile/detailPengaturan/pengaturanRekening/modelRekening';
import { useCurrency, useKategoriStorePemasukan } from '@config/store';
import { fetchPemasukan, fetchPengeluaran } from '@screens/profile/detailPengaturan/pengaturanKategori/globalGetFunctionKategori';
import { initialize } from '@screens/profile/detailPengaturan/pengaturanCurrency/utils';
import { CurrencyItemInterface } from '@screens/profile/detailPengaturan/pengaturanCurrency/currencyScreen';
import { initSound } from '@utils/soundUtils';



const NavigatorScreen = () => {
  const Stack = createStackNavigator();




  return (
    <NavigationContainer>
      <Stack.Navigator>

        <Stack.Screen
          name="TabNav"
          component={TabNav}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="StackNav"
          component={StackNavigation}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export { NavigatorScreen };
