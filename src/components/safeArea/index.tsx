import {useColorMode} from '@gluestack-style/react';
import {View} from '@gluestack-ui/themed';
import React from 'react';
import {Platform, SafeAreaView} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface SafeAreaCustomProps {
  children: React.ReactNode;
  bacgroundHeader?: boolean;
  bgColor?: string;
  customBg?: boolean;
  colorBg?: string;
}

const SafeAreaCustom: React.FC<SafeAreaCustomProps> = ({
  children,
  bacgroundHeader,
  bgColor,
  customBg,
  colorBg,
}) => {
  const colorMode = useColorMode();
  const insets = useSafeAreaInsets();
  return (
    <>
      {bacgroundHeader
        ? Platform.OS === 'ios' && (
            <View
              backgroundColor={
                bacgroundHeader
                  ? bgColor
                  : colorMode === 'light'
                  ? 'white'
                  : 'black'
              }
              height={insets.top}
            />
          )
        : null}
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor:
            colorMode === 'light' ? (customBg ? colorBg : 'white') : 'black',
        }}>
        {children}
      </SafeAreaView>
    </>
  );
};

export default SafeAreaCustom;
