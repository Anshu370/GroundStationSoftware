import React from 'react';

const LogPanel: React.FC = () => {
  return (
    <div className="w-[400px] flex flex-col">
      <h2 className="font-mono text-2xl mb-4">Logs</h2>
      <div className="flex-1 bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap">
        <div className="leading-relaxed">
          3103, 00:00:06, 123, FLIGHT, DESCENT, 850.5, 22.3,
          95.7, 4.8, 0.12, 0.05, 0.08, 0.98, 0.02, 0.01, 0.15, 0.10,
          0.12, 0.05, 12:34:55, 850.2, 37.7749, -122.4194, 8,
          RESET_CMD
        </div>
      </div>
    </div>
  );
};

export default LogPanel;