// components/CustomColorPicker.jsx
"use client";

import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CustomColorPicker = ({ currentColor, onChangeColor }) => {
    const [color, setColor] = useState(currentColor);

    const applyColor = () => {
        onChangeColor(color);
    };

    return (
        <div className="flex flex-col space-y-2">
            <Label htmlFor="custom-color">Custom Color</Label>
            <Input
                id="custom-color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-10"
            />
            <Button onClick={applyColor}>Apply Color</Button>
        </div>
    );
};

export default CustomColorPicker;
