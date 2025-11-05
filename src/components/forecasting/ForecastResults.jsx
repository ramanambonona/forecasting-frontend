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

const ForecastResults = ({ forecasts, data }) => {
  if (!forecasts || Object.keys(forecasts).length === 0) {
    return null;
  }

  const renderForecastChart = (modelName, variable, forecastData) => {
    const historicalData = data.map(item => item[variable]).filter(v => v != null);
    const allDates = [
      ...data.map(item => item.Date).slice(0, historicalData.length),
      ...forecastData.dates
    ];
    
    const allValues = [
      ...historicalData,
      ...forecastData.forecast
    ];

    const chartData = {
      labels: allDates,
      datasets: [
        {
          label: 'Historique',
          data: [...historicalData, ...Array(forecastData.forecast.length).fill(null)],
          borderColor: '#8FBC8F',
          backgroundColor: '#8FBC8F20',
          borderWidth: 2,
          tension: 0.1
        },
        {
          label: 'Prévision',
          data: [...Array(historicalData.length).fill(null), ...forecastData.forecast],
          borderColor: '#FF6B6B',
          backgroundColor: '#FF6B6B20',
          borderWidth: 2,
          borderDash: [5, 5],
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
          text: `Prévision de ${variable} - ${modelName}`,
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
      <div key={`${modelName}-${variable}`} className="chart-container mb-6">
        <Line data={chartData} options={options} />
        
        {/* Métriques de performance */}
        {forecastData.metrics && (
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div className={`p-3 rounded-lg ${
              forecastData.metrics.mape < 0.1 ? 'bg-green-100 text-green-800' :
              forecastData.metrics.mape < 0.2 ? 'bg-amber-100 text-amber-800' :
              'bg-red-100 text-red-800'
            }`}>
              <div className="font-semibold">MAPE</div>
              <div>{(forecastData.metrics.mape * 100).toFixed(2)}%</div>
            </div>
            <div className="bg-blue-100 text-blue-800 p-3 rounded-lg">
              <div className="font-semibold">RMSE</div>
              <div>{forecastData.metrics.rmse.toFixed(2)}</div>
            </div>
            <div className="bg-purple-100 text-purple-800 p-3 rounded-lg">
              <div className="font-semibold">MAE</div>
              <div>{forecastData.metrics.mae.toFixed(2)}</div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
      <h2 className="text-2xl font-bold text-amber-900 mb-6">
        📊 Résultats des Prévisions
      </h2>
      
      <div className="space-y-8">
        {Object.entries(forecasts).map(([modelName, modelForecasts]) =>
          Object.entries(modelForecasts).map(([variable, forecastData]) =>
            renderForecastChart(modelName, variable, forecastData)
          )
        )}
      </div>
    </div>
  );
};

export default ForecastResults;