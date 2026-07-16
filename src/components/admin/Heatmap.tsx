'use client';

import { useState, useEffect } from 'react';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const hours = Array.from({ length: 24 }, (_, i) => {
  const h = i % 12 === 0 ? 12 : i % 12;
  const ampm = i < 12 ? 'a' : 'p';
  return `${h}${ampm}`;
});

function getIntensityClass(val: number) {
  if (val < 25) return 'bg-surface-container';
  if (val < 50) return 'bg-primary-fixed';
  if (val < 75) return 'bg-primary';
  return 'bg-on-primary-fixed-variant';
}

export default function Heatmap() {
  const [grid, setGrid] = useState<Record<string, number[]>>({});

  useEffect(() => {
    const data: Record<string, number[]> = {};
    days.forEach((day) => {
      data[day] = Array.from({ length: 24 }, () => Math.floor(Math.random() * 100));
    });
    const timer = setTimeout(() => {
      setGrid(data);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        <div className="grid grid-cols-[80px_repeat(24,_1fr)] gap-1">
          <div></div>
          
          {hours.map((hour, idx) => (
            <div key={idx} className="text-[10px] text-center text-outline font-bold">
              {hour}
            </div>
          ))}

          {days.map((day) => (
            <div key={day} className="contents">
              <div className="text-label-md font-label-md text-on-surface-variant flex items-center">
                {day}
              </div>
              {grid[day]?.map((val, idx) => (
                <div
                  key={idx}
                  className={`h-8 rounded-sm heatmap-cell cursor-pointer ${getIntensityClass(val)}`}
                  title={`Traffic Index: ${val}`}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
