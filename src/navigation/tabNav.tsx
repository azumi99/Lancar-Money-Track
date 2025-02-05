import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Center, Text, VStack, View } from '@gluestack-ui/themed';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';

import { DarkModeStore, MessageStore, UserStore } from '@config/store';
import { CatatanScreen } from '@screens/catatan';
import { ProfileScreen } from '@screens/profile';
import { ChartScreen } from '@screens/chart';
import { LaporanScreen } from '@screens/laporan';
import { AddScreen } from '@screens/add';
import { StackNavigation } from './stackNav';


const TabNav = () => {
  const Tab = createBottomTabNavigator();
  const { user } = UserStore();
  const { mode } = DarkModeStore();
  const size = 20;
  const iconHome = (color: string, focused: boolean) => (
    <VStack space="xs" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <MaterialCommunityIcons
        size={focused ? 25 : size}
        color={focused ? '#eab308' : mode ? 'white' : 'black'}
        name={'file-document-outline'}
      />
      <Text
        style={{
          textAlign: 'center',
          fontFamily: 'Poppins-Regular',
          fontSize: 10,
          color: focused ? '#eab308' : mode ? 'white' : 'black',
        }}>
        Catatan
      </Text>
    </VStack>
  );

  const iconChart = (color: string, focused: boolean) => (
    <VStack space="xs" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Feather
        size={focused ? 25 : size}
        color={focused ? '#eab308' : mode ? 'white' : 'black'}
        name={'pie-chart'}
      />
      <Text
        style={{
          textAlign: 'center',
          fontFamily: 'Poppins-Regular',
          fontSize: 10,
          color: focused ? '#eab308' : mode ? 'white' : 'black',
        }}>
        Grafik
      </Text>
    </VStack>
  );
  const iconAdd = (color: string, focused: boolean) => (
    <VStack space="xs" style={{ justifyContent: 'center', alignItems: 'center' }} bgColor='$yellow300' padding={15} borderRadius={50} mt={-40}  >
      <Ionicons
        size={30}
        name={'add-outline'}
      />
    </VStack>

  );

  const iconLaporan = (color: string, focused: boolean) => (
    <VStack space="xs" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Octicons
        size={focused ? 25 : size}
        color={focused ? '#eab308' : mode ? 'white' : 'black'}
        name={'log'}
      />
      <Text
        style={{
          textAlign: 'center',
          fontFamily: 'Poppins-Regular',
          fontSize: 10,
          color: focused ? '#eab308' : mode ? 'white' : 'black',
        }}>
        Laporan
      </Text>
    </VStack>
  );

  const iconAccount = (color: string, focused: boolean) => (
    <VStack space="xs" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Ionicons
        size={focused ? 24 : size}
        color={focused ? '#eab308' : mode ? 'white' : 'black'}
        name={'person-outline'}
      />
      <Text
        style={{
          textAlign: 'center',
          fontFamily: 'Poppins-Regular',
          fontSize: 10,
          color: focused ? '#eab308' : mode ? 'white' : 'black',
        }}>
        Saya
      </Text>
    </VStack>
  );
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabel: () => null,
        headerStyle: {
          backgroundColor: mode ? 'black' : 'white',
        },
        headerTitleStyle: {
          color: mode ? 'white' : 'black',
        },
        tabBarStyle: {
          height: 75,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: mode ? 'black' : 'white',
        },
      }}>
      <Tab.Screen
        name="CatatanScreen"
        component={CatatanScreen}
        options={{
          tabBarIcon: ({ color, focused }) => iconHome(color, focused),
        }}
      />
      <Tab.Screen
        name="ChartScreen"
        component={ChartScreen}
        options={{
          tabBarIcon: ({ color, focused }) => iconChart(color, focused),

        }}

      />
      <Tab.Screen
        name="AddScreen"
        component={AddScreen}
        options={{
          tabBarIcon: ({ color, focused }) => iconAdd(color, focused),

        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('StackNav', { screen: 'AddScreen' });
          },
        })}
      />
      <Tab.Screen
        name="LaporanScreen"
        component={LaporanScreen}
        options={{
          tabBarIcon: ({ color, focused }) => iconLaporan(color, focused),
        }}
      />
      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, focused }) => iconAccount(color, focused),
        }}
      />

    </Tab.Navigator>
  );
};

export { TabNav };
