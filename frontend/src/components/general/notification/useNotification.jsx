import { useState, useEffect, useCallback } from 'react';
import Notification from './Notification';
import { v4 as uuidv4 } from 'uuid';

const useNotification = () => {
    const [notifications, setNotifications] = useState([]);

    const showNotification = useCallback((message, icon, className, duration = 3000, onTimeout = () => {}) => {
        const id = uuidv4(); // Unique ID for the notification
        setNotifications(prevNotifications => [...prevNotifications, { id, message, icon, className, duration, onTimeout }]);
    }, []);

    const renderNotification = () => {
        return notifications.map((notification) => (
            <Notification
                key={notification.id}
                message={notification.message}
                icon={notification.icon}
                className={notification.className}
                duration={notification.duration}
                onTimeout={() => handleTimeout(notification.id)}
            />
        ));
    };

    const handleTimeout = (id) => {
        setNotifications(notifications => notifications.filter(notification => notification.id !== id));
    };

    useEffect(() => {
        // Automatically remove notifications after their duration
        notifications.forEach(notification => {
            const timer = setTimeout(() => {
                handleTimeout(notification.id);
                notification.onTimeout(); // Additional callback if needed
            }, notification.duration);
            return () => clearTimeout(timer); // Clear timer if the component unmounts
        });
    }, [notifications]);

    return { showNotification, renderNotification };
};

export default useNotification;
