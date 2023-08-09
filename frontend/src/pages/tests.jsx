import React from 'react';

import Notification from '@/components/general/notification/Notification';
import useNotification from '@/components/general/notification/useNotification';
import CheckIcon from '@mui/icons-material/Check';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

function ExampleUsage() {
    const { visible, notificationData, showNotification, hideNotification } =
        useNotification();

    return (
        <div className="h-screen bg-gray-100 p-8">
            {visible && (
                <Notification
                    message={notificationData.message}
                    icon={notificationData.icon}
                    className={notificationData.className}
                    duration={5000}
                    onTimeout={hideNotification}
                />
            )}

            <button
                onClick={() =>
                    showNotification(
                        'Information was saved!',
                        <CheckIcon className="h-5 w-5 text-green-500" />,
                        'bg-green-100'
                    )
                }
                className="rounded-md bg-blue-500 p-4 text-white"
            >
                Trigger Success Notification
            </button>

            <button
                onClick={() =>
                    showNotification(
                        'Something went wrong!',
                        <ReportProblemIcon className="h-5 w-5 text-red-500" />,
                        'bg-red-100'
                    )
                }
                className="mt-4 rounded-md bg-blue-500 p-4 text-white"
            >
                Trigger Error Notification
            </button>
        </div>
    );
}

export default ExampleUsage;
