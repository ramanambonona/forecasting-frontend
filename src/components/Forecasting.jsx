import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import { ForecastContext } from '../context/ForecastContext';
import { getAvailableModels, generateForecast } from '../api/api';
import ModelSelector from './forecasting/ModelSelector';
import ForecastResults from './forecasting/ForecastResults';
import ModelComparison from './forecasting/ModelComparison';

const Forecasting = () => {
  const { data } = useContext(DataContext);
  const { forecasts, addForecast } = useContext(ForecastContext);
  const [availableModels, setAvailableModels] = useState({});
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedVariables, setSelectedVariables] = useState([]);
  const [periods, setPeriods] = useState(12);
  const [modelParams, setModelParams] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forecastHistory, setForecastHistory] = useState([]);

  useEffect(() => {
    loadAvailableModels();
  }, []);

  useEffect(() => {
    if (data && data.length > 0) {
      const numericColumns = getNumericColumns(data);
      setSelectedVariables(numericColumns.slice(0, 1));
    }
  }, [data]);

  const loadAvailableModels = async () => {
    try {
      const response = await getAvailableModels();
      if (response.success) {
        setAvailableModels(response.categories);
        const firstModel = Object.values(response.categories)[0]?.[0]?.name;
        if (firstModel) {
          setSelectedModel(firstModel);
        }
      }
    } catch (error) {
      console.error('Error loading models:', error);
      setError('Erreur lors du chargement des modèles');
    }
  };

  const getNumericColumns = (data) => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]).filter(key => 
      key !== 'Date' && typeof data[0][key] === 'number'
    );
  };

  const handleGenerateForecast = async () => {
    if (!selectedModel || selectedVariables.length === 0) {
      setError('Veuillez sélectionner un modèle et au moins une variable');
      return;
    }

    if (!data || data.length === 0) {
      setError('Aucune donnée disponible pour la prévision');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const forecastData = {
        data: data,
        model_type: selectedModel,
        periods: periods,
        params: modelParams[selectedModel] || {},
        target_variables: selectedVariables
      };

      const response = await generateForecast(forecastData);
      
      if (response.success) {
        const newForecast = {
          model: selectedModel,
          variables: selectedVariables,
          periods: periods,
          timestamp: new Date().toISOString(),
          results: response.forecasts,
          metrics: response.metrics
        };

        addForecast(selectedModel, response.forecasts);
        setForecastHistory(prev => [...prev, newForecast]);
        
        setError('');
      } else {
        setError(response.message || 'Erreur lors de la génération des prévisions');
      }
    } catch (err) {
      console.error('Forecast error:', err);
      setError(err.message || 'Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleVariableToggle = (variable) => {
    setSelectedVariables(prev => 
      prev.includes(variable)
        ? prev.filter(v => v !== variable)
        : [...prev, variable]
    );
  };

  if (!data || data.length === 0) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">🔮</div>
          <h2 className="text-2xl font-bold text-amber-900 mb-4">
            Génération de Prévisions
          </h2>
          <p className="text-amber-700 mb-4">
            Veuillez d'abord uploader des données dans l'onglet "Upload"
          </p>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'upload' }))}
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl transition-all duration-300"
          >
            📤 Aller à l'Upload
          </button>
        </div>
      </div>
    );
  }

  const numericColumns = getNumericColumns(data);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <h1 className="text-3xl font-bold text-amber-900 mb-6">
          🔮 Génération de Prévisions
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Configuration */}
          <div className="space-y-6">
            {/* Sélection des variables */}
            <div>
              <h3 className="text-lg font-semibold text-amber-800 mb-3">
                📊 Variables à prévoir:
              </h3>
              <div className="max-h-60 overflow-y-auto border border-amber-200 rounded-lg p-4">
                <div className="space-y-2">
                  {numericColumns.map(variable => (
                    <label key={variable} className="flex items-center space-x-3 p-2 hover:bg-amber-50 rounded">
                      <input
                        type="checkbox"
                        checked={selectedVariables.includes(variable)}
                        onChange={(e) => handleVariableToggle(variable)}
                        className="rounded text-amber-600 focus:ring-amber-500"
                      />
                      <span className="text-amber-700 flex-1">{variable}</span>
                      <span className="text-xs text-amber-500 bg-amber-100 px-2 py-1 rounded">
                        {data.filter(d => d[variable] != null).length} points
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              {selectedVariables.length > 0 && (
                <p className="text-sm text-amber-600 mt-2">
                  {selectedVariables.length} variable(s) sélectionnée(s)
                </p>
              )}
            </div>

            {/* Période de prévision */}
            <div>
              <label className="block text-lg font-semibold text-amber-800 mb-3">
                📅 Périodes à prévoir:
              </label>
              <select
                value={periods}
                onChange={(e) => setPeriods(parseInt(e.target.value))}
                className="w-full p-3 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value={3}>3 mois</option>
                <option value={6}>6 mois</option>
                <option value={12}>12 mois</option>
                <option value={24}>24 mois</option>
                <option value={36}>36 mois</option>
              </select>
            </div>
          </div>

          {/* Sélection du modèle */}
          <div>
            <ModelSelector
              availableModels={availableModels}
              selectedModel={selectedModel}
              onModelSelect={setSelectedModel}
              modelParams={modelParams}
              onParamsChange={setModelParams}
            />
          </div>
        </div>

        {/* Bouton de génération */}
        <div className="mt-8">
          <button
            onClick={handleGenerateForecast}
            disabled={loading || !selectedModel || selectedVariables.length === 0}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
              loading || !selectedModel || selectedVariables.length === 0
                ? 'bg-amber-400 cursor-not-allowed'
                : 'bg-amber-600 hover:bg-amber-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="loading-spinner mr-3"></div>
                Génération des prévisions...
              </div>
            ) : (
              '🚀 Générer les Prévisions'
            )}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-xl text-red-700">
              ⚠️ {error}
            </div>
          )}
        </div>
      </div>

      {/* Historique des prévisions */}
      {forecastHistory.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-amber-900 mb-6">
            📋 Historique des Prévisions
          </h2>
          <div className="space-y-4">
            {forecastHistory.map((forecast, index) => (
              <div key={index} className="border border-amber-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-amber-800">
                      {forecast.model} - {forecast.variables.join(', ')}
                    </h3>
                    <p className="text-sm text-amber-600">
                      {new Date(forecast.timestamp).toLocaleString('fr-FR')}
                    </p>
                  </div>
                  <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-sm">
                    {forecast.periods} périodes
                  </span>
                </div>
                {forecast.metrics && (
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-amber-700">MAPE</div>
                      <div className={forecast.metrics.mape < 0.1 ? 'text-green-600' : forecast.metrics.mape < 0.2 ? 'text-amber-600' : 'text-red-600'}>
                        {(forecast.metrics.mape * 100).toFixed(2)}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-amber-700">RMSE</div>
                      <div>{forecast.metrics.rmse?.toFixed(2) || 'N/A'}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-amber-700">MAE</div>
                      <div>{forecast.metrics.mae?.toFixed(2) || 'N/A'}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Résultats des prévisions */}
      {Object.keys(forecasts).length > 0 && (
        <ForecastResults forecasts={forecasts} data={data} />
      )}

      {/* Comparaison des modèles */}
      {Object.keys(forecasts).length > 1 && (
        <ModelComparison forecasts={forecasts} />
      )}
    </div>
  );
};

export default Forecasting;