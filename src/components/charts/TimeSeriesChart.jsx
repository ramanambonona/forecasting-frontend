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

const TimeSeriesChart = ({ data, variables }) => {
  if (!data || data.length === 0 || !variables || variables.length === 0) {
    return (
      <div className="chart-container">
        <div className="text-center text-amber-600 py-8">
          Aucune donnée à afficher
        </div>
      </div>
    );
  }

  const chartData = {
    labels: data.map(item => item.Date),
    datasets: variables.map((variable, index) => {
      const colors = ['#8FBC8F', '#6A8A6A', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
      return {
        label: variable,
        data: data.map(item => item[variable]),
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length] + '20',
        borderWidth: 2,
        fill: false,
        tension: 0.1
      };
    })
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Évolution des Variables',
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

export default TimeSeriesChart;