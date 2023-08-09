import { useState } from 'react';
import Notification from './Notification';

const useNotification = () => {
    const [notification, setNotification] = useState(null);

    const showNotification = (message, icon, className, duration = 3000) => {
        setNotification({ message, icon, className, duration });
    };

    const hideNotification = () => {
        setNotification(null);
    };

    const renderNotification = () => {
        if (!notification) return null;

        const { message, icon, className, duration } = notification;

        return (
            <Notification
                message={message}
                icon={icon}
                className={className}
                duration={duration}
                onTimeout={hideNotification}
            />
        );
    };

    return { showNotification, renderNotification };
};

export default useNotification;
