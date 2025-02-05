import React from 'react';
import {VStack, Icon, Divider, ChevronLeftIcon} from '@gluestack-ui/themed';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

type Props = {
  testID?: string;
};
const GoBackForgot: React.FC<Props> = ({testID}) => {
  const navigation = useNavigation<any>();
  return (
    <VStack space="lg" mt={20}>
      <TouchableOpacity testID={testID} onPress={() => navigation.goBack()}>
        <Icon as={ChevronLeftIcon} paddingHorizontal={16} size="xl" />
      </TouchableOpacity>
      <Divider my="$0.5" />
    </VStack>
  );
};

export {GoBackForgot};
