// frontend/src/components/mainDashboardComponents/NavButton.jsx

"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Transition } from "@headlessui/react";

const NavButton = ({
    children,
    icon: Icon,
    onClick,
    isActive,
    dropdown,
    dropdownItems,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        if (dropdown)
        {
            setIsOpen(!isOpen);
        } else
        {
            onClick();
        }
    };

    return (
        <div className="w-full">
            <button
                className={`w-full p-3 text-left rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-between ${isActive
                    ? "bg-gradient-to-r from-purple-600 to-pink-600"
                    : "bg-gradient-to-r from-purple-500 to-blue-500"
                    }`}
                onClick={handleToggle}
            >
                <div className="flex items-center">
                    <Icon className="mr-3" size={20} />
                    <span>{children}</span>
                </div>
                {dropdown && (isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
            </button>
            {dropdown && isOpen && (
                <Transition
                    show={isOpen}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <div className="mt-2 space-y-2 pl-8">
                        {dropdownItems.map((item) => (
                            <button
                                key={item.label}
                                className={`w-full p-2 text-left rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out ${isActive === item.value
                                    ? "bg-gradient-to-r from-purple-600 to-pink-600"
                                    : "bg-gradient-to-r from-purple-400 to-blue-400"
                                    }`}
                                onClick={() => {
                                    item.onClick();
                                    setIsOpen(false);
                                }}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </Transition>
            )}
        </div>
    );
};

export default NavButton;
