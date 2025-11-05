import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';

const DataAnalysis = () => {
  const { analysis } = useContext(DataContext);

  if (!analysis) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-amber-900 mb-6">
        <i className="fas fa-chart-bar mr-2"></i>Analyse des Séries Temporelles
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(analysis).map(([variable, analysisData]) => (
          <div key={variable} className="bg-amber-50 rounded-xl p-6 border border-amber-200">
            <h4 className="font-bold text-amber-900 mb-3 text-lg">{variable}</h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Tendance:</span>
                <span className={`font-semibold ${
                  analysisData.tendance === 'Détectée' 
                    ? 'text-green-600' 
                    : 'text-amber-600'
                }`}>
                  {analysisData.tendance}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span>Saisonnalité:</span>
                <span className={`font-semibold ${
                  analysisData.saisonnalite === 'Forte' 
                    ? 'text-green-600' 
                    : analysisData.saisonnalite === 'Modérée'
                    ? 'text-amber-600'
                    : 'text-gray-600'
                }`}>
                  {analysisData.saisonnalite}
                </span>
              </div>
              
              {analysisData.recommandations && analysisData.recommandations.length > 0 && (
                <div className="mt-3">
                  <span className="font-semibold text-amber-800">Recommandations:</span>
                  <ul className="mt-1 space-y-1">
                    {analysisData.recommandations.map((rec, idx) => (
                      <li key={idx} className="text-xs text-amber-700">• {rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataAnalysis;