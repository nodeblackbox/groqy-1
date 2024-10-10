// frontend/src/components/mainDashboardComponents/Button.jsx

"use client";

import React from "react";

const Button = ({
    onClick,
    children,
    variant = "primary",
    size = "md",
    className = "",
    ...props
}) => {
    const baseClasses =
        "flex items-center justify-center space-x-1 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105";

    const variants = {
        primary: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
        secondary: "bg-gradient-to-r from-green-500 to-teal-500 text-white",
        destructive: "bg-gradient-to-r from-red-500 to-orange-500 text-white",
        success: "bg-gradient-to-r from-blue-500 to-green-500 text-white",
        ghost: "bg-transparent text-gray-200 hover:bg-gray-700",
        outline: "border border-gray-500 text-gray-200 hover:bg-gray-700",
    };

    const sizes = {
        sm: "px-2 py-1 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
        xs: "px-1 py-0.5 text-xs",
    };

    return (
        <button
            onClick={onClick}
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
