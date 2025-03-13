import React, { useEffect, useState } from 'react';
// import {HomeScreen} from '@screens/Home';
import { TabNav } from '@navigation/tabNav';
import { StackNavigation } from '@navigation/stackNav';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { CreateTableKategori } from '@screens/profile/detailPengaturan/pengaturanKategori/modelKategori';
import { CreateTableCatatan } from '@screens/catatan/models/crudCatatan';
import { CreateTableRekening } from '@screens/profile/detailPengaturan/pengaturanRekening/modelRekening';


const NavigatorScreen = () => {
  const Stack = createStackNavigator();

  useEffect(() => {
    CreateTableKategori();
    CreateTableCatatan();
    CreateTableRekening();
  }, [])

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
