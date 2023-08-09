// Notification.jsx
import React, { useEffect, useState } from 'react';

const Notification = ({ message, icon, className, duration, onTimeout }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Use this to delay the slide-in effect
        const showTimer = setTimeout(() => {
            setIsVisible(true);
        }, 50);

        const hideTimer = setTimeout(() => {
            setIsVisible(false);
        }, duration);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
        };
    }, [duration]);

    useEffect(() => {
        if (!isVisible) {
            const timer = setTimeout(() => {
                onTimeout();
            }, 300); // the transition duration

            return () => clearTimeout(timer);
        }
    }, [isVisible, onTimeout]);

    return (
        <div
            className={`fixed transform transition-transform duration-700 ease-out 
            ${
                isVisible ? 'z-50 -translate-y-2' : 'translate-y-96'
            } bottom-0 left-4 rounded-md 
            p-5 shadow-lg ${className}`}
        >
            <div className="flex">
                <div className="relative mr-2 scale-[1.6] transform self-center">
                    {icon}
                </div>
                <span className="ml-2 self-center text-lg">{message}</span>
            </div>
        </div>
    );
};

export default Notification;
