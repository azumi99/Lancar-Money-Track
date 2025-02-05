import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { GluestackUIProvider, StatusBar, useColorMode } from '@gluestack-ui/themed';
import { NavigatorScreen } from './src/navigation';
import { config } from './src/config/customTheme';
import { DarkModeStore } from '@config/store';
import { db } from '@config/dbService';

const App = () => {
  const colorMode = useColorMode();
  const isDarkMode = useColorScheme() === colorMode;
  const { mode, setMode } = DarkModeStore();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? 'white' : 'black',
  };
  useEffect(() => {
    db
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
