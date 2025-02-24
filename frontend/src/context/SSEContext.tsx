import React, { createContext, useContext, useState, useCallback } from 'react';

interface TelemetryData {
  sensorData: {
    altitude: number;
    humidity: number;
    pressure: number;
    voltage: number;
    temperature: number;
    velocity: number;
  };
  gnssData: {
    time: string;
    latitude: number;
    longitude: number;
  };
  sensorMetrics: {
    gyro: [number, number, number];
    acceleration: [number, number, number];
    magneticField: [number, number, number];
    velocity: [number, number, number];
  };
}

interface SSEContextType {
  startConnection: () => Promise<void>;
  stopConnection: () => void;
  telemetry: TelemetryData | null;
  maps: any;
  graphs: any;
  connected: boolean;
}

const SSEContext = createContext<SSEContextType | undefined>(undefined);

export const SSEProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [maps, setMaps] = useState(null);
  const [graphs, setGraphs] = useState(null);
  const [connected, setConnected] = useState(false);
  const [eventSources, setEventSources] = useState<EventSource[]>([]);

  const startConnection = useCallback(async () => {
    const sources = [
      new EventSource('http://localhost:5000/telemetry'),
      new EventSource('http://localhost:5000/maps'),
      new EventSource('http://localhost:5000/graphs')
    ];

    sources[0].onmessage = (event) => {
      try {
        const rawData = JSON.parse(event.data);
        // Transform the data to match our interface
        const transformedData: TelemetryData = {
          sensorData: {
            altitude: rawData.altitude,
            humidity: rawData.humidity,
            pressure: rawData.pressure,
            voltage: rawData.voltage,
            temperature: rawData.temperature,
            velocity: rawData.velocity
          },
          gnssData: {
            time: rawData.gnss.time,
            latitude: rawData.gnss.latitude,
            longitude: rawData.gnss.longitude
          },
          sensorMetrics: {
            gyro: rawData.sensor_metrics.gyro,
            acceleration: rawData.sensor_metrics.acceleration,
            magneticField: rawData.sensor_metrics.magnetic_field,
            velocity: rawData.sensor_metrics.velocity_xyz
          }
        };
        setTelemetry(transformedData);
      } catch (error) {
        console.error('Error parsing telemetry data:', error);
      }
    };

    sources[1].onmessage = (event) => setMaps(JSON.parse(event.data));
    sources[2].onmessage = (event) => setGraphs(JSON.parse(event.data));

    setEventSources(sources);
    setConnected(true);
  }, []);

  const stopConnection = useCallback(() => {
    eventSources.forEach(source => source.close());
    setEventSources([]);
    setConnected(false);
    setTelemetry(null);
    setMaps(null);
    setGraphs(null);
  }, [eventSources]);

  return (
    <SSEContext.Provider value={{
      startConnection,
      stopConnection,
      telemetry,
      maps,
      graphs,
      connected
    }}>
      {children}
    </SSEContext.Provider>
  );
};

export const useSSE = () => {
  const context = useContext(SSEContext);
  if (context === undefined) {
    throw new Error('useSSE must be used within a SSEProvider');
  }
  return context;
};

