import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DecompositionChart = ({ data, variable }) => {
  if (!data || data.length === 0 || !variable) {
    return (
      <div className="chart-container">
        <div className="text-center text-amber-600 py-8">
          Sélectionnez une variable pour voir sa décomposition
        </div>
      </div>
    );
  }

  // Simulation de décomposition (en production, cela viendrait du backend)
  const values = data.map(item => item[variable]).filter(v => v != null);
  
  if (values.length < 12) {
    return (
      <div className="chart-container">
        <div className="text-center text-amber-600 py-8">
          Données insuffisantes pour la décomposition saisonnière (minimum 12 points requis)
        </div>
      </div>
    );
  }

  // Simulation simple de décomposition
  const trend = values.map((_, i) => {
    const windowSize = Math.min(5, Math.floor(values.length / 4));
    const start = Math.max(0, i - windowSize);
    const end = Math.min(values.length, i + windowSize + 1);
    return values.slice(start, end).reduce((a, b) => a + b, 0) / (end - start);
  });

  const seasonal = values.map((val, i) => {
    const period = 12;
    const seasonalValue = Math.sin(2 * Math.PI * i / period) * (val * 0.1);
    return seasonalValue;
  });

  const residual = values.map((val, i) => val - trend[i] - seasonal[i]);

  const chartData = {
    labels: data.map(item => item.Date).slice(0, values.length),
    datasets: [
      {
        label: 'Original',
        data: values,
        borderColor: '#8FBC8F',
        backgroundColor: '#8FBC8F20',
        borderWidth: 2,
        tension: 0.1
      },
      {
        label: 'Tendance',
        data: trend,
        borderColor: '#FF6B6B',
        backgroundColor: '#FF6B6B20',
        borderWidth: 2,
        tension: 0.1
      },
      {
        label: 'Saisonnalité',
        data: seasonal,
        borderColor: '#4ECDC4',
        backgroundColor: '#4ECDC420',
        borderWidth: 2,
        tension: 0.1
      },
      {
        label: 'Résidu',
        data: residual,
        borderColor: '#FFEAA7',
        backgroundColor: '#FFEAA720',
        borderWidth: 2,
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Décomposition de ${variable}`,
        font: {
          family: 'Palatino Linotype, Book Antiqua, Palatino, serif',
          size: 16
        }
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Valeur'
        }
      }
    }
  };

  return (
    <div className="chart-container">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default DecompositionChart;