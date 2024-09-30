// frontend/src/components/ui/modal.jsx
import React from 'react';
import { Dialog } from '@headlessui/react';

export const Modal = ({ isOpen, onClose, children }) => {
    return (
        <Dialog open={isOpen} onClose={onClose} className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
                <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                <div className="relative bg-gray-800 rounded max-w-lg mx-auto p-6 z-20">
                    {children}
                </div>
            </div>
        </Dialog>
    );
};

export const ModalHeader = ({ children }) => (
    <Dialog.Title className="text-lg font-medium text-white mb-4">{children}</Dialog.Title>
);

export const ModalBody = ({ children }) => (
    <div className="text-white">{children}</div>
);

export const ModalFooter = ({ children }) => (
    <div className="mt-4 flex justify-end space-x-2">{children}</div>
);