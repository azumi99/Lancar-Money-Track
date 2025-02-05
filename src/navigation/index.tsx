import React, { useEffect, useState } from 'react';
// import {HomeScreen} from '@screens/Home';
import { TabNav } from '@navigation/tabNav';
import { StackNavigation } from '@navigation/stackNav';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';


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
