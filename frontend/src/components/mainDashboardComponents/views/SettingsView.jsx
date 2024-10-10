// frontend/src/components/mainDashboardComponents/views/SettingsView.jsx

"use client";

import React from "react";
import Button from "../Button";

const SettingsView = () => (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold mb-6">Account Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Information */}
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Profile Information</h3>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <input
                            type="text"
                            className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            defaultValue="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            defaultValue="john.doe@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Role</label>
                        <input
                            type="text"
                            className="w-full p-2 rounded-md bg-gray-700"
                            defaultValue="Senior Developer"
                            readOnly
                        />
                    </div>
                    <Button variant="primary" className="w-full">
                        Update Profile
                    </Button>
                </form>
            </div>

            {/* Security Settings */}
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Security Settings</h3>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Current Password</label>
                        <input
                            type="password"
                            className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">New Password</label>
                        <input
                            type="password"
                            className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                        <input
                            type="password"
                            className="w-full p-2 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <Button variant="primary" className="w-full">
                        Change Password
                    </Button>
                </form>
            </div>
        </div>
    </div>
);

export default SettingsView;
