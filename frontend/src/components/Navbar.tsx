import { useState, useEffect } from 'react';

const Navbar = () => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="flex flex-col">
            <span className="text-xs text-gray-600 font-mono">Team Id:</span>
            <span className="text-lg font-mono">2024-ASI-CANSAT-057</span>
          </div>
        </div>
        
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <img src="./assets/PSIT_Vyomnauts.png" alt="PSIT Vyomnauts" className="h-8" />
          </div>
        </div>
        
        <div className="flex items-center space-x-8">
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-600 font-mono">State</span>
            <span className="text-lg font-mono">LAUNCH PAD</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-600 font-mono">Mission Time</span>
            <span className="text-lg font-mono">{currentTime}</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;