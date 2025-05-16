import { useEffect, useState } from 'react';

interface TimerProps {
  initialHours?: number;
  initialMinutes?: number;
  initialSeconds?: number;
}

export default function Timer({
  initialHours = 9,
  initialMinutes = 18,
  initialSeconds = 48
}: TimerProps) {
  const [time, setTime] = useState({
    hours: initialHours,
    minutes: initialMinutes,
    seconds: initialSeconds
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prevTime => {
        if (prevTime.seconds > 0) {
          return { ...prevTime, seconds: prevTime.seconds - 1 };
        } else if (prevTime.minutes > 0) {
          return { ...prevTime, minutes: prevTime.minutes - 1, seconds: 59 };
        } else if (prevTime.hours > 0) {
          return { hours: prevTime.hours - 1, minutes: 59, seconds: 59 };
        }
        return prevTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="flex gap-4 items-center">
      <div className="flex flex-col items-center">
        <div className="bg-[#009450] text-white rounded-lg p-3 min-w-[60px] text-center">
          <span className="text-2xl font-bold">{formatNumber(time.hours)}</span>
        </div>
        <span className="text-xs mt-1 text-gray-600">HRS</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-[#009450] text-white rounded-lg p-3 min-w-[60px] text-center">
          <span className="text-2xl font-bold">{formatNumber(time.minutes)}</span>
        </div>
        <span className="text-xs mt-1 text-gray-600">MIN</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-[#009450] text-white rounded-lg p-3 min-w-[60px] text-center">
          <span className="text-2xl font-bold">{formatNumber(time.seconds)}</span>
        </div>
        <span className="text-xs mt-1 text-gray-600">SEC</span>
      </div>
    </div>
  );
} 