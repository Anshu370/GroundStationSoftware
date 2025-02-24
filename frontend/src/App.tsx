import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import TelemetryData from './components/TelemetryData';
import LogPanel from './components/LogPanel';
import GraphsPage from './components/GraphsPage';
import MapPage from './components/MapPage';
import { SSEProvider } from './context/SSEContext';

function App() {
  const [currentPage, setCurrentPage] = useState<'telemetry' | 'graphs' | 'maps'>('telemetry');

  return (
    <SSEProvider>
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar onPageChange={setCurrentPage} currentPage={currentPage} />
          <div className="flex flex-1 p-6 gap-6">
            {currentPage === 'telemetry' && (
              <>
                <TelemetryData />
                <LogPanel />
              </>
            )}
            {currentPage === 'graphs' && (
              <>
                <GraphsPage />
                <LogPanel />
              </>
            )}
            {currentPage === 'maps' && (
              <>
                <MapPage />
                <LogPanel />
              </>
            )}
          </div>
        </div>
      </div>
    </SSEProvider>
  );
}

export default App;