import React, { useEffect } from 'react';
import { useSSE } from '../context/SSEContext';

const TelemetryData: React.FC = () => {
  const { telemetry, connected } = useSSE();

  useEffect(() => {
    console.log('Telemetry data updated:', telemetry);
  }, [telemetry]);

  // Add connection status indicator
  if (!connected) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <span className="font-mono text-gray-500">Waiting for connection...</span>
      </div>
    );
  }

  // If no telemetry data yet, show loading
  if (!telemetry) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <span className="font-mono text-gray-500">Loading telemetry data...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4">
      <div>
        <h2 className="font-mono text-xl mb-2">CanSat</h2>
        <div className="border border-gray-300 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-x-16 gap-y-2">
            <div className="flex justify-between">
              <span className="font-mono">Altitude</span>
              <span className="font-mono">{telemetry.sensorData.altitude.toFixed(1)} m</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono">Voltage</span>
              <span className="font-mono">{telemetry.sensorData.voltage.toFixed(1)} V</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono">Humidity</span>
              <span className="font-mono">{telemetry.sensorData.humidity.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono">Temperature</span>
              <span className="font-mono">{telemetry.sensorData.temperature.toFixed(1)} C</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono">Pressure</span>
              <span className="font-mono">{telemetry.sensorData.pressure.toFixed(1)} kpa</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono">Velocity</span>
              <span className="font-mono">{telemetry.sensorData.velocity.toFixed(1)} m/s</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-mono text-xl mb-2">GNSS Data</h2>
        <div className="border border-gray-300 rounded-lg p-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-mono">Time</span>
              <span className="font-mono">{telemetry.gnssData.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono">Latitude</span>
              <span className="font-mono">{telemetry.gnssData.latitude.toFixed(7)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono">Longitude</span>
              <span className="font-mono">{telemetry.gnssData.longitude.toFixed(7)}</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-mono text-xl mb-2">Sensor Metrics</h2>
        <div className="border border-gray-300 rounded-lg p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="font-mono">
                <th className="text-left"></th>
                <th className="text-right px-4">X</th>
                <th className="text-right px-4">Y</th>
                <th className="text-right px-4">Z</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              <tr>
                <td>Gyro</td>
                <td className="text-right px-4">{telemetry.sensorMetrics.gyro[0].toFixed(2)}</td>
                <td className="text-right px-4">{telemetry.sensorMetrics.gyro[1].toFixed(2)}</td>
                <td className="text-right px-4">{telemetry.sensorMetrics.gyro[2].toFixed(2)}</td>
              </tr>
              <tr>
                <td>Acceleration</td>
                <td className="text-right px-4">{telemetry.sensorMetrics.acceleration[0].toFixed(2)}</td>
                <td className="text-right px-4">{telemetry.sensorMetrics.acceleration[1].toFixed(2)}</td>
                <td className="text-right px-4">{telemetry.sensorMetrics.acceleration[2].toFixed(2)}</td>
              </tr>
              <tr>
                <td>Magnetic Field</td>
                <td className="text-right px-4">{telemetry.sensorMetrics.magneticField[0].toFixed(2)}</td>
                <td className="text-right px-4">{telemetry.sensorMetrics.magneticField[1].toFixed(2)}</td>
                <td className="text-right px-4">{telemetry.sensorMetrics.magneticField[2].toFixed(2)}</td>
              </tr>
              <tr>
                <td>Velocity</td>
                <td className="text-right px-4">{telemetry.sensorMetrics.velocity[0].toFixed(2)}</td>
                <td className="text-right px-4">{telemetry.sensorMetrics.velocity[1].toFixed(2)}</td>
                <td className="text-right px-4">{telemetry.sensorMetrics.velocity[2].toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TelemetryData;