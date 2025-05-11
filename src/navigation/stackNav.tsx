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
  PadStore,
  SaveKategori,
  navigateIdRequestStore,
  useCurrencySearch,
  useHockRekening,
  useHookActionCurrency,
} from '@config/store';

import { HStack, Text, View } from '@gluestack-ui/themed';
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
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { SearchMainScreen } from '@screens/catatan/searchScreen';
import { ProfileScreen } from '@screens/profile';
import { EditProfileScreen } from '@screens/profile/pengaturanProfile/profileScreen';
import { BackupScreen } from '@screens/profile/detailPengaturan/backupScreen';
import { playBeep } from '@utils/soundUtils';
import { TermsAndConditions } from '@screens/profile/detailPengaturan/syaratScreen';
import { PrivacyPolicyScreen } from '@screens/profile/detailPengaturan/kebijakanScreen';
import { EksporScreen } from '@screens/ekspor';
import { WaktuLaporanScreen } from '@screens/waktuLaporan';
import { PembayaranScreen } from '@screens/pembayaran';
import { PembayaranFormScreen } from '@screens/pembayaran/formPembayaran';
import { ReminderScreen } from '@screens/reminder';
import { FormReminderScreen } from '@screens/reminder/addReminder';
import { AnggaranScreen } from '@screens/anggaran';
import { ResetCacheScreen } from '@screens/cacheScreen';
import { StatistikBulananScreen } from '@screens/laporan/statistikBulanan';
import { BudgetReport } from '@screens/laporan/anggaranStatistik';
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
  const { handleOpen, setHandleOpen } = useHookActionCurrency();
  const { pad } = PadStore();
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
                playBeep();
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
          // headerBackVisible: true,
          headerShown: true,
          headerTitleAlign: 'center',

          headerStyle: {
            backgroundColor: '#fde047',

          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                playBeep();
                navigation.navigate('StackNav', { screen: 'CalendarScreen' })
              }}
            >
              <IconCustom As={Ionicons} name="arrow-back" size={20} />
            </TouchableOpacity>
          ),
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
                playBeep()
                setIdNav(0);
                navigation.goBack();
              }}>
              <IconCustom As={Ionicons} name="arrow-back" size={20} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => { playBeep(); setModalDate(true) }}>
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

          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#fde047',
          },

          headerLeft: () => (

            <TouchableOpacity
              onPress={() => { playBeep(); route.params.params?.name ? navigation.navigate('StackNav', { screen: 'CalendarScreen' }) : navigation.goBack() }} style={{ marginTop: 7 }}>
              <Text color='black'>Batalkan</Text>
            </TouchableOpacity>
          ),
          headerRight: () => {
            return pad && (
              <TouchableOpacity onPress={() => { playBeep(); setHandleOpen(!handleOpen) }}>
                <IconCustom As={MaterialIcons} name="currency-exchange" size={20} />
              </TouchableOpacity>
            );
          }

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
      <Stack.Screen
        name="SearchMainScreen"
        component={SearchMainScreen}
        options={{
          title: 'Pencarian',
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#fde047',
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                playBeep()
                navigation.goBack()
              }}>
              <IconCustom As={Ionicons} name="arrow-back" size={20} />
            </TouchableOpacity>
          )
        }}
      />
      <Stack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{
          title: 'Pengaturan Profil',
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#fde047',
          },
          headerLeft: () => (
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
        name="BackupScreen"
        component={BackupScreen}
        options={{
          title: 'Backup',
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#fde047',
          },
          headerLeft: () => (
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
        name="EksporScreen"
        component={EksporScreen}
        options={{
          title: 'Ekspor Data',
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#fde047',
          },
          headerLeft: () => (
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
        name="WaktuLaporanScreen"
        component={WaktuLaporanScreen}
        options={{
          title: 'Tanggal Mulai Bulanan',
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#fde047',
          },
          headerLeft: () => (
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
        name="PembayaranScreen"
        component={PembayaranScreen}
        options={{
          title: 'Pembayaran Regular',
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#fde047',
          },
          headerLeft: () => (
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
        name="PembayaranFormScreen"
        component={PembayaranFormScreen}
        options={{
          title: 'Tambah Pembayaran',
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#fde047',
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('StackNav', { screen: "PembayaranScreen" })
              }>
              <IconCustom As={Ionicons} name="arrow-back" size={20} />
            </TouchableOpacity>
          )

        }}
      />
      <Stack.Screen
        name="ReminderScreen"
        component={ReminderScreen}
        options={{
          title: 'Pengingat',
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#fde047',
          },
          headerLeft: () => (
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
        name="FormReminderScreen"
        component={FormReminderScreen}
        options={{
          title: 'Form Pengingat',
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#fde047',
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('StackNav', { screen: "ReminderScreen" })
              }>
              <IconCustom As={Ionicons} name="arrow-back" size={20} />
            </TouchableOpacity>
          )

        }}
      />
      <Stack.Screen
        name="AnggaranScreen"
        component={AnggaranScreen}
        options={{
          title: 'Anggaran',
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#fde047',
          },
          headerLeft: () => (
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
        name="ResetCacheScreen"
        component={ResetCacheScreen}
        options={{
          title: 'Reset Cache',
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#fde047',
          },
          headerLeft: () => (
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
        name="StatistikBulananScreen"
        component={StatistikBulananScreen}
        options={{
          title: 'Statistik Bulanan',
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#fde047',
          },
          headerLeft: () => (
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
        name="BudgetReport"
        component={BudgetReport}
        options={{
          title: 'Statistik Anggaran',
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#fde047',
          },
          headerLeft: () => (
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
        name="TermsAndConditions"
        component={TermsAndConditions}
        options={{
          title: 'Syarat & Ketentuan',
          headerBackVisible: true,
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#fde047',
          },

        }}
      />
      <Stack.Screen
        name="PrivacyPolicyScreen"
        component={PrivacyPolicyScreen}
        options={{
          title: 'Kebijakan Privasi',
          headerBackVisible: true,
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#fde047',
          },

        }}
      />
    </Stack.Navigator>

  );
};
