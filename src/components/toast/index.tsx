import { ToastAndroid } from "react-native";

const ShowToast = (message: string) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
};

export { ShowToast }
