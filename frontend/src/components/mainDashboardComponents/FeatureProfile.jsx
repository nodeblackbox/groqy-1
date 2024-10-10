// frontend/src/components/mainDashboardComponents/FeatureProfile.jsx

"use client";

import React from "react";

const FeatureProfile = () => (
    <div className="mb-8 bg-gradient-to-r from-gray-700 to-gray-700 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center space-x-4">
            <div className="relative">
                <img
                    src="https://i.ibb.co/tDxBcPq/Pitch-Deck-Logo-Asset-V7.png"
                    alt="User"
                    className="w-16 h-16 rounded-full ring-4 ring-purple-500 shadow-lg transform hover:scale-110 transition-transform duration-200"
                />
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                    <div className="bg-green-300 rounded-full w-3 h-3"></div>
                </div>
            </div>
            <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">CeeCee</span>
                <p className="text-sm text-gray-400 bg-gray-700 px-2 py-1 rounded-full inline-block">
                    CTO
                </p>
            </div>
        </div>
    </div>
);

export default FeatureProfile;
