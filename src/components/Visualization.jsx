import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import { analyzeTimeSeries } from '../api/api';
import TimeSeriesChart from './charts/TimeSeriesChart';
import DecompositionChart from './charts/DecompositionChart';
import CorrelationHeatmap from './charts/CorrelationHeatmap';

const Visualization = () => {
  const { data, analysis, setAnalysis } = useContext(DataContext);
  const [selectedVariables, setSelectedVariables] = useState([]);
  const [detailedAnalysis, setDetailedAnalysis] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data && data.length > 0) {
      const numericColumns = Object.keys(data[0]).filter(key => 
        key !== 'Date' && typeof data[0][key] === 'number'
      );
      setSelectedVariables(numericColumns.slice(0, 3));
    }
  }, [data]);

  const handleVariableToggle = (variable) => {
    setSelectedVariables(prev => 
      prev.includes(variable)
        ? prev.filter(v => v !== variable)
        : [...prev, variable]
    );
  };

  const runDetailedAnalysis = async () => {
    if (!data || selectedVariables.length === 0) return;
    
    setLoading(true);
    try {
      const analysisResults = {};
      
      for (const variable of selectedVariables) {
        const seriesData = data.map(row => ({
          date: row.Date,
          value: row[variable]
        }));
        
        const result = await analyzeTimeSeries({
          data: seriesData,
          target_variable: variable
        });
        
        if (result.success) {
          analysisResults[variable] = result.analysis[variable];
        }
      }
      
      setDetailedAnalysis(analysisResults);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">📈</div>
          <h2 className="text-2xl font-bold text-amber-900 mb-4">
            Visualisation des Données
          </h2>
          <p className="text-amber-700">
            Veuillez d'abord uploader des données dans l'onglet "Upload"
          </p>
        </div>
      </div>
    );
  }

  const numericColumns = Object.keys(data[0]).filter(key => 
    key !== 'Date' && typeof data[0][key] === 'number'
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <h1 className="text-3xl font-bold text-amber-900 mb-6">
          📈 Visualisation et Analyse
        </h1>

        {/* Sélection des variables */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-amber-800 mb-4">
            Variables à visualiser:
          </h3>
          <div className="flex flex-wrap gap-2">
            {numericColumns.map(variable => (
              <button
                key={variable}
                onClick={() => handleVariableToggle(variable)}
                className={`px-4 py-2 rounded-full transition-all duration-300 ${
                  selectedVariables.includes(variable)
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                }`}
              >
                {variable}
              </button>
            ))}
          </div>
        </div>

        {/* Graphique des séries temporelles */}
        {selectedVariables.length > 0 && (
          <div className="mb-8">
            <TimeSeriesChart 
              data={data} 
              variables={selectedVariables} 
            />
          </div>
        )}

        {/* Bouton d'analyse détaillée */}
        <button
          onClick={runDetailedAnalysis}
          disabled={loading || selectedVariables.length === 0}
          className={`mb-8 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
            loading || selectedVariables.length === 0
              ? 'bg-amber-400 cursor-not-allowed'
              : 'bg-amber-600 hover:bg-amber-700 text-white shadow-lg hover:shadow-xl'
          }`}
        >
          {loading ? '🔍 Analyse en cours...' : '🔍 Analyser en détail'}
        </button>

        {/* Résultats d'analyse détaillée */}
        {Object.keys(detailedAnalysis).length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {selectedVariables.map(variable => (
              <div key={variable} className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                <h4 className="font-bold text-amber-900 mb-3">{variable}</h4>
                {detailedAnalysis[variable] && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Tendance:</span>
                      <span className={`font-semibold ${
                        detailedAnalysis[variable].tendance === 'Détectée' 
                          ? 'text-green-600' 
                          : 'text-amber-600'
                      }`}>
                        {detailedAnalysis[variable].tendance}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saisonnalité:</span>
                      <span className={`font-semibold ${
                        detailedAnalysis[variable].saisonnalite === 'Forte' 
                          ? 'text-green-600' 
                          : detailedAnalysis[variable].saisonnalite === 'Modérée'
                          ? 'text-amber-600'
                          : 'text-gray-600'
                      }`}>
                        {detailedAnalysis[variable].saisonnalite}
                      </span>
                    </div>
                    {detailedAnalysis[variable].recommandations && (
                      <div className="mt-3">
                        <span className="font-semibold text-amber-800">Recommandations:</span>
                        <ul className="mt-1 space-y-1">
                          {detailedAnalysis[variable].recommandations.map((rec, idx) => (
                            <li key={idx} className="text-xs text-amber-700">• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Graphiques d'analyse avancée */}
        {selectedVariables.length > 0 && (
          <>
            <div className="mb-8">
              <DecompositionChart 
                data={data} 
                variable={selectedVariables[0]} 
              />
            </div>
            
            <div className="mb-8">
              <CorrelationHeatmap data={data} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Visualization;