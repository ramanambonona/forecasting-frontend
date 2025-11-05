import React, { useState, useEffect } from 'react';
import { getModelParameters } from '../../api/api';

const ModelSelector = ({ 
  availableModels, 
  selectedModel, 
  onModelSelect, 
  modelParams, 
  onParamsChange 
}) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [modelDetails, setModelDetails] = useState({});

  useEffect(() => {
    if (Object.keys(availableModels).length > 0 && !selectedCategory) {
      setSelectedCategory(Object.keys(availableModels)[0]);
    }
  }, [availableModels]);

  useEffect(() => {
    const loadModelDetails = async () => {
      if (selectedModel) {
        try {
          const details = await getModelParameters(selectedModel);
          setModelDetails(prev => ({
            ...prev,
            [selectedModel]: details.parameters
          }));
        } catch (error) {
          console.error(`Error loading parameters for ${selectedModel}:`, error);
        }
      }
    };

    loadModelDetails();
  }, [selectedModel]);

  const handleParamChange = (paramName, value) => {
    onParamsChange(prev => ({
      ...prev,
      [selectedModel]: {
        ...prev[selectedModel],
        [paramName]: value
      }
    }));
  };

  const renderParameterInputs = () => {
    const details = modelDetails[selectedModel];
    if (!details || !details.parameters) return null;

    return Object.entries(details.parameters).map(([paramName, paramConfig]) => (
      <div key={paramName} className="mb-4">
        <label className="block text-sm font-medium text-amber-700 mb-1">
          {paramConfig.description || paramName}
        </label>
        {paramConfig.type === 'integer' ? (
          <div className="space-y-2">
            <input
              type="number"
              min={paramConfig.min}
              max={paramConfig.max}
              value={modelParams[selectedModel]?.[paramName] || paramConfig.default}
              onChange={(e) => handleParamChange(paramName, parseInt(e.target.value))}
              className="w-full p-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
            <div className="flex justify-between text-xs text-amber-600">
              <span>Min: {paramConfig.min}</span>
              <span>Max: {paramConfig.max}</span>
            </div>
          </div>
        ) : paramConfig.type === 'float' ? (
          <div className="space-y-2">
            <input
              type="number"
              step={paramConfig.step || 0.01}
              min={paramConfig.min}
              max={paramConfig.max}
              value={modelParams[selectedModel]?.[paramName] || paramConfig.default}
              onChange={(e) => handleParamChange(paramName, parseFloat(e.target.value))}
              className="w-full p-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
            <div className="flex justify-between text-xs text-amber-600">
              <span>Min: {paramConfig.min}</span>
              <span>Max: {paramConfig.max}</span>
            </div>
          </div>
        ) : (
          <input
            type="text"
            value={modelParams[selectedModel]?.[paramName] || paramConfig.default}
            onChange={(e) => handleParamChange(paramName, e.target.value)}
            className="w-full p-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder={paramConfig.description}
          />
        )}
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      {/* Sélection de catégorie */}
      <div>
        <label className="block text-sm font-medium text-amber-700 mb-2">
          Catégorie de modèles:
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
        >
          {Object.keys(availableModels).map(category => (
            <option key={category} value={category}>
              {category} ({availableModels[category].length})
            </option>
          ))}
        </select>
      </div>

      {/* Sélection de modèle */}
      <div>
        <label className="block text-sm font-medium text-amber-700 mb-2">
          Modèle de prévision:
        </label>
        <div className="space-y-2 max-h-60 overflow-y-auto border border-amber-200 rounded-lg p-2">
          {availableModels[selectedCategory]?.map(model => (
            <label key={model.name} className="flex items-start space-x-3 p-2 hover:bg-amber-50 rounded cursor-pointer">
              <input
                type="radio"
                name="model"
                value={model.name}
                checked={selectedModel === model.name}
                onChange={() => onModelSelect(model.name)}
                className="mt-1 text-amber-600 focus:ring-amber-500"
              />
              <div className="flex-1">
                <div className="font-medium text-amber-800">{model.name}</div>
                <div className="text-xs text-amber-600">{model.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Paramètres du modèle */}
      {selectedModel && (
        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
          <h4 className="font-semibold text-amber-800 mb-3">
            Paramètres - {selectedModel}
          </h4>
          {modelDetails[selectedModel]?.description && (
            <p className="text-sm text-amber-600 mb-3">
              {modelDetails[selectedModel].description}
            </p>
          )}
          {renderParameterInputs()}
        </div>
      )}
    </div>
  );
};

export default ModelSelector;