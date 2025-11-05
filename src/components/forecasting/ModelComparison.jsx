import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ModelComparison = ({ forecasts }) => {
  if (!forecasts || Object.keys(forecasts).length <= 1) {
    return null;
  }

  const models = Object.keys(forecasts);
  const firstVariable = Object.keys(forecasts[models[0]])[0];

  if (!firstVariable) return null;

  // Données pour le graphique de comparaison des prévisions
  const comparisonData = {
    labels: forecasts[models[0]][firstVariable].dates,
    datasets: models.map((model, index) => {
      const colors = ['#8FBC8F', '#6A8A6A', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
      return {
        label: model,
        data: forecasts[model][firstVariable].forecast,
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length] + '80',
        borderWidth: 2,
        tension: 0.1
      };
    })
  };

  // Données pour le graphique des métriques
  const metricsData = {
    labels: models,
    datasets: [
      {
        label: 'MAPE (%)',
        data: models.map(model => 
          (forecasts[model][firstVariable].metrics.mape * 100).toFixed(2)
        ),
        backgroundColor: '#8FBC8F',
        borderColor: '#8FBC8F',
        borderWidth: 1
      },
      {
        label: 'RMSE',
        data: models.map(model => 
          forecasts[model][firstVariable].metrics.rmse.toFixed(2)
        ),
        backgroundColor: '#6A8A6A',
        borderColor: '#6A8A6A',
        borderWidth: 1
      },
      {
        label: 'MAE',
        data: models.map(model => 
          forecasts[model][firstVariable].metrics.mae.toFixed(2)
        ),
        backgroundColor: '#FF6B6B',
        borderColor: '#FF6B6B',
        borderWidth: 1
      }
    ]
  };

  const comparisonOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Comparaison des Prévisions - ${firstVariable}`,
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
          text: 'Période'
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

  const metricsOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Comparaison des Métriques de Performance',
        font: {
          family: 'Palatino Linotype, Book Antiqua, Palatino, serif',
          size: 16
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-amber-900 mb-6">
        ⚖️ Comparaison des Modèles
      </h2>

      {/* Graphique de comparaison des prévisions */}
      <div className="chart-container mb-8">
        <Line data={comparisonData} options={comparisonOptions} />
      </div>

      {/* Graphique des métriques */}
      <div className="chart-container mb-8">
        <Bar data={metricsData} options={metricsOptions} />
      </div>

      {/* Tableau récapitulatif des métriques */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-amber-200 rounded-lg">
          <thead className="bg-amber-100">
            <tr>
              <th className="py-3 px-4 text-left font-semibold text-amber-800">Modèle</th>
              <th className="py-3 px-4 text-left font-semibold text-amber-800">MAPE</th>
              <th className="py-3 px-4 text-left font-semibold text-amber-800">RMSE</th>
              <th className="py-3 px-4 text-left font-semibold text-amber-800">MAE</th>
              <th className="py-3 px-4 text-left font-semibold text-amber-800">Qualité</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-200">
            {models.map(model => {
              const metrics = forecasts[model][firstVariable].metrics;
              const getQualityColor = (mape) => {
                if (mape < 0.1) return 'text-green-600 bg-green-100';
                if (mape < 0.2) return 'text-amber-600 bg-amber-100';
                return 'text-red-600 bg-red-100';
              };
              const getQualityText = (mape) => {
                if (mape < 0.1) return 'Excellent';
                if (mape < 0.2) return 'Bon';
                return 'Médiocre';
              };

              return (
                <tr key={model}>
                  <td className="py-2 px-4 font-medium text-amber-900">{model}</td>
                  <td className="py-2 px-4">{(metrics.mape * 100).toFixed(2)}%</td>
                  <td className="py-2 px-4">{metrics.rmse.toFixed(2)}</td>
                  <td className="py-2 px-4">{metrics.mae.toFixed(2)}</td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getQualityColor(metrics.mape)}`}>
                      {getQualityText(metrics.mape)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModelComparison;