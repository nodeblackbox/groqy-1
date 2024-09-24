// src/components/NotificationProvider.jsx

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Transition } from '@headlessui/react';
import { CheckCircle, XCircle, Info, ExclamationTriangle } from 'lucide-react';

const NotificationContext = createContext();

export const useNotification = () => {
    return useContext(NotificationContext);
};

const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((message, type = 'info') => {
        const id = Date.now();
        setNotifications((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, 5000); // Auto-remove after 5 seconds
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    return (
        <NotificationContext.Provider value={addNotification}>
            {children}
            <div className="fixed top-5 right-5 z-50 space-y-2">
                {notifications.map(({ id, message, type }) => (
                    <Transition
                        key={id}
                        show={true}
                        enter="transform transition duration-300"
                        enterFrom="translate-y-2 opacity-0"
                        enterTo="translate-y-0 opacity-100"
                        leave="transform transition duration-300"
                        leaveFrom="translate-y-0 opacity-100"
                        leaveTo="translate-y-2 opacity-0"
                    >
                        <div
                            className={`max-w-sm w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden`}
                        >
                            <div className="p-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        {type === 'success' && <CheckCircle className="h-6 w-6 text-green-400" />}
                                        {type === 'error' && <XCircle className="h-6 w-6 text-red-400" />}
                                        {type === 'info' && <Info className="h-6 w-6 text-blue-400" />}
                                        {type === 'warning' && <ExclamationTriangle className="h-6 w-6 text-yellow-400" />}
                                    </div>
                                    <div className="ml-3 w-0 flex-1">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{message}</p>
                                    </div>
                                    <div className="ml-4 flex-shrink-0 flex">
                                        <button
                                            onClick={() => removeNotification(id)}
                                            className="bg-white dark:bg-gray-800 rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
                                        >
                                            <span className="sr-only">Close</span>
                                            <XCircle className="h-5 w-5" aria-hidden="true" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Transition>
                ))}
            </div>
        </NotificationContext.Provider>
    );
};

export default NotificationProvider;
