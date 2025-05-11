// utils/notification.ts
import PushNotification from 'react-native-push-notification';
import { Linking, PermissionsAndroid, Platform } from 'react-native';


export const requestNotificationPermission = async () => {
    if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
};

export const getRepeatType = (frequency) => {
    switch (frequency) {
        case 'Sekali':
            return null; // nggak repeat
        case 'Sekali sehari':
            return 'day';
        case 'Mingguan':
            return 'week';
        case 'Bulanan':
            return 'month';
        default:
            return null;
    }
};


export const scheduleReminderNotification = (reminder) => {
    const { id, name, notes, time, frequency } = reminder;

    const [hour, minute] = time.split(":").map(Number);
    const now = new Date();
    const notificationTime = new Date(now);
    notificationTime.setHours(hour);
    notificationTime.setMinutes(minute);
    notificationTime.setSeconds(0);

    if (notificationTime <= now) {
        notificationTime.setDate(notificationTime.getDate() + 1);
    }

    const repeatType = getRepeatType(frequency);

    PushNotification.localNotificationSchedule({
        id: id.toString(),
        channelId: "reminder-channels",
        message: notes || `Ingat: ${name}`,
        date: notificationTime,
        allowWhileIdle: true,
        repeatType: repeatType,
    });

    console.log(`Scheduled notification for: ${notificationTime} | repeat: ${repeatType}`);
};
