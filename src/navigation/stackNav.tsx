import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { IconCustom } from '@components/iconCustom';
import {
  ActionEditStore,
  AddAccountStore,
  ChangePasswordStore,
  DarkModeStore,
  DateCalenderDetail,
  DefaultDate,
  EditProfileStore,
  MessageStore,
  ModalDate,
  NotifStore,
  SaveKategori,
  navigateIdRequestStore,
  useCurrencySearch,
  useHockRekening,
} from '@config/store';

import { HStack, Text } from '@gluestack-ui/themed';
import { DetailScreen } from '@screens/detail';
import { CatatanDetail } from '@screens/catatan/detailCatatan';
import { CalendarScreen } from '@screens/calendar';
import { TextHeading } from '@components/textHeading';
import { DetailCalendar } from '@screens/calendar/detailCalender';
import { AddScreen } from '@screens/add';
import { PengaturanScreen } from '@screens/profile/pengaturanScreen';
import { KategoriSettings } from '@screens/profile/detailPengaturan/pengaturanKategori/kategoriSettings';
import { AddKategori } from '@screens/profile/detailPengaturan/pengaturanKategori/AddKategori';
import { RekeningScreen } from '@screens/profile/detailPengaturan/pengaturanRekening/rekeningScreen';
import { AddRekeningScreen } from '@screens/profile/detailPengaturan/pengaturanRekening/addRekening';
import { CurrencyScreen } from '@screens/profile/detailPengaturan/pengaturanCurrency/currencyScreen';
const Stack = createNativeStackNavigator();
export const StackNavigation = ({ route }) => {
  const navigation = useNavigation<any>();
  const dataRoute = useRoute<any>();
  const { edit, setEdit } = ActionEditStore();
  const { titleDate } = DateCalenderDetail();
  const { setParam } = EditProfileStore();
  const { setChange } = ChangePasswordStore();
  const { setIdNav } = navigateIdRequestStore();
  const { setSaveKategori } = SaveKategori();
  const { setSaveRekening } = useHockRekening();
  const { mode } = DarkModeStore();
  const { setAdd } = AddAccountStore();
  const { setMessageData } = MessageStore();
  const { setNotif } = NotifStore();
  const { date } = DefaultDate();
  const { setModalDate } = ModalDate()
  const { currencySearch, setCurrencySearch } = useCurrencySearch();
  // console.log(route.params.params.title)

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: mode ? 'black' : 'white',
        },
        headerTitleStyle: {
          color: mode ? 'white' : 'black',
        },
      }}>
      <Stack.Screen
        name="DetailsRequest"
        component={DetailScreen}
        options={{
          title: 'Request Detail',
          headerBackVisible: false,
          headerShown: false,
          headerTitleAlign: 'center',

          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                setIdNav(0);
                navigation.goBack();
              }}>
              <IconCustom As={Ionicons} name="chevron-back" size={20} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => setEdit(!edit)}>
              <IconCustom As={Ionicons} name="ellipsis-vertical" size={20} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="CatatanDetail"
        component={CatatanDetail}
        options={{
          title: 'Detail',
          headerBackVisible: route?.params?.params?.back,
          headerShown: true,
          headerTitleAlign: 'center',

          headerStyle: {
            backgroundColor: '#fde047',

          },

          headerLeft: () => (
            !route.params.params?.back &&
            <TouchableOpacity
              onPress={() => {
                setIdNav(0);
                navigation.goBack();
              }}>
              <IconCustom As={Ionicons} name="arrow-back" size={20} />
            </TouchableOpacity>
          )
        }}
      />
      <Stack.Screen
        name="DetailCalendar"
        component={DetailCalendar}
        options={{
          title: titleDate,
          headerBackVisible: true,
          headerShown: true,
          headerTitleAlign: 'center',

          headerStyle: {
            backgroundColor: '#fde047',

          },
        }}
      />
      <Stack.Screen
        name="CalendarScreen"
        component={CalendarScreen}
        options={{
          title: 'Kalender',
          headerBackVisible: true,
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#fde047',
          },

          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                setIdNav(0);
                navigation.goBack();
              }}>
              <IconCustom As={Ionicons} name="arrow-back" size={20} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => setModalDate(true)}>
              <HStack alignItems='center'>
                <Text mt={5}>{date}</Text>
                <IconCustom As={Ionicons} name="caret-down" size={30} />
              </HStack>
            </TouchableOpacity>
          )
        }}
      />
      <Stack.Screen
        name="AddScreen"
        component={AddScreen}
        options={{
          title: 'Tambahkan',
          headerBackVisible: route?.params?.params?.name,
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#fde047',
          },

          headerLeft: () => (
            !route.params.params?.name &&
            <TouchableOpacity
              onPress={() => navigation.goBack()} style={{ marginTop: 7 }}>
              <Text color='black'>Batalkan</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => setEdit(!edit)}>
              <IconCustom As={Ionicons} name="calendar" size={20} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="PengaturanScreen"
        component={PengaturanScreen}
        options={{
          title: 'Pengaturan',
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#fde047',
          },

          headerLeft: () => (
            !route.params.params?.back &&
            <TouchableOpacity
              onPress={() =>
                navigation.goBack()
              }>
              <IconCustom As={Ionicons} name="arrow-back" size={20} />
            </TouchableOpacity>
          )
        }}
      />
      <Stack.Screen
        name="KategoriSettings"
        component={KategoriSettings}
        options={{
          title: 'Pengaturan Kategori',
          headerBackVisible: true,
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#fde047',
          },


        }}
      />
      <Stack.Screen
        name="AddKategori"
        component={AddKategori}
        options={{
          title: 'Tambah Kategori',
          headerBackVisible: true,
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#fde047',
          },

          headerRight: () => (
            <TouchableOpacity onPress={() => setSaveKategori(true)}>
              <IconCustom As={Ionicons} name="checkmark-sharp" size={20} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="RekeningScreen"
        component={RekeningScreen}
        options={{
          title: 'Rekening',
          headerBackVisible: true,
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#fde047',
          },


        }}
      />
      <Stack.Screen
        name="AddRekeningScreen"
        component={AddRekeningScreen}
        options={{
          title: 'Tambahkan',
          headerBackVisible: true,
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#fde047',
          },
          headerRight: () => (
            <TouchableOpacity onPress={() => setSaveRekening(true)}>
              <IconCustom As={Ionicons} name="checkmark-sharp" size={20} />
            </TouchableOpacity>
          ),


        }}
      />
      <Stack.Screen
        name="CurrencyScreen"
        component={CurrencyScreen}
        options={{
          title: 'Currency',
          headerBackVisible: true,
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#fde047',
          },
          headerRight: () => (
            <TouchableOpacity onPress={() => setCurrencySearch(!currencySearch)} >
              <IconCustom As={Ionicons} name="search" size={20} />
            </TouchableOpacity>
          ),


        }}
      />
    </Stack.Navigator>
  );
};
