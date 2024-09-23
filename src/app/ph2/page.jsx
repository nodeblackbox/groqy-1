'use client'
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

const SpiralGraphic = ({ turns = 5, size = 200 }) => {
  const points = [];
  const steps = turns * 100;
  
  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * turns * Math.PI * 2;
    const radius = (i / steps) * size / 2;
    const x = size / 2 + radius * Math.cos(angle);
    const y = size / 2 + radius * Math.sin(angle);
    points.push(`${x},${y}`);
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
};

const SpiralGraphicWebsite = () => {
  const [turns, setTurns] = React.useState(5);

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Spiral Graphic</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <SpiralGraphic turns={turns} size={300} />
          <div className="w-full max-w-xs">
            <Slider
              min={1}
              max={10}
              step={0.1}
              value={[turns]}
              onValueChange={(value) => setTurns(value[0])}
            />
            <p className="text-center mt-2">Turns: {turns.toFixed(1)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpiralGraphicWebsite;