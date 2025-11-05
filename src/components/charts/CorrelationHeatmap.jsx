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
  BarElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
);

const CorrelationHeatmap = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <div className="text-center text-amber-600 py-8">
          Aucune donnée à afficher
        </div>
      </div>
    );
  }

  const numericColumns = Object.keys(data[0]).filter(key => 
    key !== 'Date' && typeof data[0][key] === 'number'
  );

  if (numericColumns.length === 0) {
    return (
      <div className="chart-container">
        <div className="text-center text-amber-600 py-8">
          Aucune colonne numérique trouvée
        </div>
      </div>
    );
  }

  // Calcul des corrélations
  const correlations = numericColumns.map(col1 => 
    numericColumns.map(col2 => {
      const values1 = data.map(item => item[col1]).filter(v => v != null);
      const values2 = data.map(item => item[col2]).filter(v => v != null);
      
      if (values1.length === 0 || values2.length === 0) return 0;
      
      const mean1 = values1.reduce((a, b) => a + b, 0) / values1.length;
      const mean2 = values2.reduce((a, b) => a + b, 0) / values2.length;
      
      let numerator = 0;
      let denom1 = 0;
      let denom2 = 0;
      
      for (let i = 0; i < Math.min(values1.length, values2.length); i++) {
        const diff1 = values1[i] - mean1;
        const diff2 = values2[i] - mean2;
        numerator += diff1 * diff2;
        denom1 += diff1 * diff1;
        denom2 += diff2 * diff2;
      }
      
      const correlation = numerator / Math.sqrt(denom1 * denom2);
      return isNaN(correlation) ? 0 : correlation;
    })
  );

  const chartData = {
    labels: numericColumns,
    datasets: correlations.map((row, i) => ({
      label: numericColumns[i],
      data: row,
      backgroundColor: row.map(corr => {
        const intensity = Math.abs(corr);
        if (intensity > 0.7) return '#8FBC8F';
        if (intensity > 0.4) return '#6A8A6A';
        if (intensity > 0.2) return '#FFEAA7';
        return '#F3F4F6';
      }),
      borderColor: '#6A8A6A',
      borderWidth: 1,
    }))
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Matrice de Corrélation',
        font: {
          family: 'Palatino Linotype, Book Antiqua, Palatino, serif',
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Corrélation: ${context.raw.toFixed(3)}`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Variables'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Variables'
        }
      }
    }
  };

  return (
    <div className="chart-container">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default CorrelationHeatmap;