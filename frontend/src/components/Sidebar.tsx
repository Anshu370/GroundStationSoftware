import React, { useState } from 'react';
import { useSSE } from '../context/SSEContext';

interface SidebarProps {
  onPageChange: (page: 'telemetry' | 'graphs' | 'maps') => void;
  currentPage: 'telemetry' | 'graphs' | 'maps';
}

const Sidebar: React.FC<SidebarProps> = ({ onPageChange, currentPage }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedBaudRate, setSelectedBaudRate] = useState('9600');
  const [comPort, setComPort] = useState('COM1');
  const [error, setError] = useState<string | null>(null);
  const { startConnection, stopConnection } = useSSE();

  const baudRates = ['9600', '19200', '38400', '57600', '115200'];

  const handleConnect = async () => {
    try {
      setError(null); // Clear any previous errors
      
      const response = await fetch('http://localhost:5000/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          baudrate: parseInt(selectedBaudRate),
          com_port: comPort
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to connect to serial port');
        setIsConnected(false);
        return;
      }

      const data = await response.json();
      setIsConnected(data.connected);
      if (!data.connected) {
        setError(data.error || 'Failed to connect to serial port');
        return;
      }

      setShowModal(false);
      setError(null);
      await startConnection();
      
    } catch (err) {
      console.error('Connection error:', err);
      setError('Failed to connect to server. Please check if the backend is running.');
      setIsConnected(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      // First stop the SSE connections
      stopConnection();
      
      const response = await fetch('http://localhost:5000/disconnect', {
        method: 'POST'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to disconnect properly');
        return;
      }
      
      setIsConnected(false);
      setShowModal(false);
      setError(null);
      
    } catch (err) {
      console.error('Disconnect error:', err);
      setError('Failed to disconnect properly');
      // Still set as disconnected even if backend fails
      setIsConnected(false);
      stopConnection();
    }
  };

  return (
    <>
      <div className="w-64 bg-gray-100 h-full flex flex-col">
        <div className="flex flex-col space-y-4 p-4">
          <button 
            className={`w-full py-4 text-center rounded-lg ${currentPage === 'graphs' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
            onClick={() => onPageChange('graphs')}
          >
            <span className="font-mono text-lg tracking-widest">GRAPHS</span>
          </button>
          
          <button 
            className={`w-full py-4 text-center rounded-lg ${currentPage === 'maps' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
            onClick={() => onPageChange('maps')}
          >
            <span className="font-mono text-lg tracking-widest">MAPS</span>
          </button>
          
          <button 
            className={`w-full py-4 text-center rounded-lg ${currentPage === 'telemetry' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
            onClick={() => onPageChange('telemetry')}
          >
            <span className="font-mono text-lg tracking-widest">TELEMETRY</span>
          </button>
        </div>
        
        <div className="flex-grow"></div>
        
        <div className="p-4">
          <button 
            className={`w-full py-4 rounded-full font-mono text-lg transition-colors ${
              isConnected 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
            onClick={isConnected ? handleDisconnect : () => setShowModal(true)}
          >
            {isConnected ? 'Unlink' : 'Link'}
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-2xl font-mono mb-6">Connection Settings</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block font-mono mb-2">Baud Rate</label>
                <select 
                  className="w-full p-2 border rounded font-mono"
                  value={selectedBaudRate}
                  onChange={(e) => setSelectedBaudRate(e.target.value)}
                >
                  {baudRates.map(rate => (
                    <option key={rate} value={rate}>{rate}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono mb-2">COM Port</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded font-mono"
                  value={comPort}
                  onChange={(e) => setComPort(e.target.value)}
                  placeholder="Enter COM port (e.g., COM1)"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button 
                className="px-4 py-2 bg-gray-300 rounded font-mono"
                onClick={() => {
                  setShowModal(false);
                  setError(null);
                }}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded font-mono"
                onClick={handleConnect}
              >
                Connect
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;