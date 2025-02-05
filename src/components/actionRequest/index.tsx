import {ActionEditStore, UserStore} from '@config/store';
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicatorWrapper,
  ActionsheetDragIndicator,
  ActionsheetItem,
  ActionsheetItemText,
} from '@gluestack-ui/themed';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {GestureResponderEvent} from 'react-native';
import Snackbar from 'react-native-snackbar';
type Props = {
  id?: number;
  deleteAction?: () => void;
  updateAction?: (value: string) => void;
  statusDetail?: string;
};
const ActionEdit: React.FC<Props> = ({
  id,
  deleteAction,
  updateAction,
  statusDetail,
}) => {
  const {edit, setEdit} = ActionEditStore();
  const {user} = UserStore();
  const handleClose = () => setEdit(!edit);
  const navigation = useNavigation<any>();
  const deleteActionFunc = () => {
    handleClose();
    Snackbar.show({
      text: 'You want delete this request?',
      duration: 2000,
      action: {
        text: 'Delete',
        textColor: 'red',
        onPress: deleteAction,
      },
    });
  };
  return (
    <Actionsheet isOpen={edit} onClose={handleClose} zIndex={999}>
      <ActionsheetBackdrop />
      <ActionsheetContent h="$72" zIndex={999}>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        {(user?.role === 'user' || user?.role === 'superadmin') && (
          <>
            <ActionsheetItem
              isDisabled={
                statusDetail === 'Cancel' || statusDetail === 'Done'
                  ? true
                  : false
              }
              onPress={() => {
                navigation.navigate('StackNav', {
                  screen: 'EditFormRequest',
                  params: {id: id},
                });
                handleClose();
              }}>
              <ActionsheetItemText>Edit</ActionsheetItemText>
            </ActionsheetItem>
            <ActionsheetItem onPress={deleteActionFunc}>
              <ActionsheetItemText>Delete</ActionsheetItemText>
            </ActionsheetItem>
          </>
        )}
        {user?.role === 'admin' && (
          <>
            <ActionsheetItem
              onPress={() => {
                navigation.navigate('StackNav', {
                  screen: 'EditFormRequest',
                  params: {id: id},
                });
                handleClose();
              }}>
              <ActionsheetItemText>Note</ActionsheetItemText>
            </ActionsheetItem>
            <ActionsheetItem
              onPress={() => {
                updateAction && updateAction('Processing');
                handleClose();
              }}>
              <ActionsheetItemText>Processing</ActionsheetItemText>
            </ActionsheetItem>
            <ActionsheetItem
              isDisabled={statusDetail === 'Waiting' ? true : false}
              onPress={() => {
                updateAction && updateAction('Done');
                handleClose();
              }}>
              <ActionsheetItemText>Done</ActionsheetItemText>
            </ActionsheetItem>
            <ActionsheetItem
              onPress={() => {
                updateAction && updateAction('Cancel');
                handleClose();
              }}>
              <ActionsheetItemText>Cancel</ActionsheetItemText>
            </ActionsheetItem>
          </>
        )}
      </ActionsheetContent>
    </Actionsheet>
  );
};

export {ActionEdit};
