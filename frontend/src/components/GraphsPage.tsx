import React, { useEffect, useState } from 'react';
import { useSSE } from '../context/SSEContext';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Maximum number of data points to show
const MAX_DATA_POINTS = 50;

// Add type for dataset keys
type DatasetKey = 'altitude' | 'pressure' | 'temperature' | 'velocity';

const GraphsPage: React.FC = () => {
  const { graphs, connected } = useSSE();
  const [datasets, setDatasets] = useState<{
    [key in DatasetKey]: {
      times: number[];
      values: number[];
    };
  }>({
    altitude: { times: [], values: [] },
    pressure: { times: [], values: [] },
    temperature: { times: [], values: [] },
    velocity: { times: [], values: [] }
  });

  useEffect(() => {
    if (graphs) {
      console.log('Received graphs data:', graphs); // Debug log
      setDatasets(prev => {
        const newDatasets = { ...prev };
        const time = graphs.time_since_launch;

        // Map the correct properties from the graphs object
        const mappings = {
          altitude: graphs.altitude,
          pressure: graphs.pressure,
          temperature: graphs.temperature,
          velocity: graphs.velocity
        };

        Object.entries(mappings).forEach(([key, value]) => {
          if (typeof value === 'number') {
            newDatasets[key as DatasetKey].times = [...prev[key as DatasetKey].times, time].slice(-MAX_DATA_POINTS);
            newDatasets[key as DatasetKey].values = [...prev[key as DatasetKey].values, value].slice(-MAX_DATA_POINTS);
          }
        });

        return newDatasets;
      });
    }
  }, [graphs]);

  const createChartData = (values: number[], times: number[], label: string) => ({
    labels: times,
    datasets: [
      {
        label,
        data: values,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: false,
        pointRadius: 2
      }
    ]
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0 // Disable animation for better performance
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            family: 'monospace'
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        title: {
          display: true,
          text: 'Time (s)',
          font: {
            family: 'monospace'
          }
        },
        ticks: {
          font: {
            family: 'monospace'
          },
          maxTicksLimit: 10
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  // Remove the fixed ranges and add dynamic min/max calculation
  const getAxisRange = (values: number[]) => {
    if (values.length === 0) return { min: 0, max: 100 };
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1; // Add 10% padding
    return {
      min: min - padding,
      max: max + padding
    };
  };

  if (!connected) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <span className="font-mono text-gray-500">Waiting for connection...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 overflow-auto" style={{ height: 'calc(100vh - 2rem)' }}>
      <div className="grid grid-cols-2 gap-4 min-h-[1200px]">
        {Object.entries(datasets).map(([key, data]) => (
          <div key={key} className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col h-[500px]">
            <h3 className="font-mono text-lg mb-2 capitalize">{key}</h3>
            <div className="flex-1">
              <Line
                data={createChartData(data.values, data.times, key)}
                options={{
                  ...chartOptions,
                  scales: {
                    ...chartOptions.scales,
                    y: {
                      ...chartOptions.scales.y,
                      // Use dynamic range instead of fixed range
                      ...getAxisRange(data.values)
                    }
                  }
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GraphsPage;