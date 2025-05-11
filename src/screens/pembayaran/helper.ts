import { AppState, AppStateStatus } from 'react-native';
import { processScheduledPayments, CreateTablePembayaranRegular } from '@screens/pembayaran/model';
import { ShowToast } from '@components/toast';
import { NativeModules, NativeEventEmitter } from 'react-native';

// Define a simple periodic task manager using React Native's native modules
const TaskManager = {
    scheduledTasks: {},

    scheduleTask: (taskId, intervalMinutes, taskFn) => {
        // Clear any existing task with the same ID
        if (TaskManager.scheduledTasks[taskId]) {
            clearInterval(TaskManager.scheduledTasks[taskId]);
        }

        // Convert minutes to milliseconds
        const intervalMs = intervalMinutes * 60 * 1000;

        // Schedule the periodic task
        const taskInterval = setInterval(() => {
            if (AppState.currentState !== 'active') {
                console.log(`[TaskManager] Running background task: ${taskId}`);
            } else {
                console.log(`[TaskManager] Running task while app active: ${taskId}`);
            }

            // Execute the task
            taskFn()
                .catch(error => console.error(`[TaskManager] Error in task ${taskId}:`, error));

        }, intervalMs);

        // Store the interval reference
        TaskManager.scheduledTasks[taskId] = taskInterval;

        return true;
    },

    stopTask: (taskId) => {
        if (TaskManager.scheduledTasks[taskId]) {
            clearInterval(TaskManager.scheduledTasks[taskId]);
            delete TaskManager.scheduledTasks[taskId];
            return true;
        }
        return false;
    },

    stopAllTasks: () => {
        Object.keys(TaskManager.scheduledTasks).forEach(taskId => {
            clearInterval(TaskManager.scheduledTasks[taskId]);
            delete TaskManager.scheduledTasks[taskId];
        });
    }
};

// Initialize all database tables
export const initializeDatabases = async () => {
    try {
        // Create tables if they don't exist
        await CreateTablePembayaranRegular();
        console.log('All database tables initialized successfully');
    } catch (error) {
        console.error('Error initializing database tables:', error);
    }
};

// Configure background tasks for scheduled payments
export const configureBackgroundTasks = async () => {
    try {
        // Schedule a task to process payments every 15 minutes
        TaskManager.scheduleTask(
            'process-scheduled-payments',
            15, // 15 minutes interval
            async () => {
                // Process scheduled payments
                await processScheduledPayments();
                console.log('[TaskManager] Scheduled payments processed');
            }
        );

        console.log('[TaskManager] Background tasks configured');
        return true;
    } catch (error) {
        console.error('[TaskManager] Failed to configure background tasks:', error);
        return false;
    }
};

// Process scheduled payments when app becomes active
export const setupAppStateListener = () => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
        if (nextAppState === 'active') {
            try {
                await processScheduledPayments();
            } catch (error) {
                console.error('Error processing scheduled payments:', error);
            }
        }
    };

    // Subscribe to app state changes
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Return cleanup function
    return () => {
        subscription.remove();
        // Also clean up all tasks when this listener is removed
        TaskManager.stopAllTasks();
    };
};

// Manual check for scheduled payments
export const checkForScheduledPayments = async () => {
    try {
        await processScheduledPayments();
        ShowToast('Cek pembayaran terjadwal selesai');
    } catch (error) {
        console.error('Error checking scheduled payments:', error);
        ShowToast('Gagal memeriksa pembayaran terjadwal');
    }
};

// Add a method to register headless task for more comprehensive background support
export const registerHeadlessTask = () => {
    // Note: For a true headless task implementation in production,
    // you would need to use a native module approach with:
    // - iOS: Background Tasks Framework or Background Fetch
    // - Android: WorkManager or Foreground Service
    console.log('For true background processing, consider implementing platform-specific native modules');
};