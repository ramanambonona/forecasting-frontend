const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

console.log('🔗 URL API:', API_BASE_URL);

const getHeaders = () => ({
  'Content-Type': 'application/json',
});

const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMessage = 'Erreur réseau';
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorData.message || JSON.stringify(errorData);
    } catch (e) {
      errorMessage = await response.text() || `Erreur ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }
  return response.json();
};

export const uploadData = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/upload-data`, {
    method: 'POST',
    body: formData,
  });
  return handleResponse(response);
};

export const analyzeTimeSeries = async (data) => {
  const response = await fetch(`${API_BASE_URL}/analyze-timeseries`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const generateForecast = async (forecastData) => {
  const response = await fetch(`${API_BASE_URL}/generate-forecast`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(forecastData),
  });
  return handleResponse(response);
};

export const getAvailableModels = async () => {
  const response = await fetch(`${API_BASE_URL}/models`);
  return handleResponse(response);
};

export const checkHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return handleResponse(response);
  } catch (error) {
    throw new Error(`API non accessible: ${error.message}`);
  }
};

export const validateData = (data) => {
  const errors = [];
  
  if (!data || data.length === 0) {
    errors.push('Aucune donnée fournie');
  }
  
  if (!data.some(row => row.Date)) {
    errors.push('Colonne Date manquante');
  }
  
  const numericColumns = Object.keys(data[0]).filter(key => 
    key !== 'Date' && typeof data[0][key] === 'number'
  );
  
  if (numericColumns.length === 0) {
    errors.push('Aucune colonne numérique trouvée');
  }
  
  const dates = data.map(row => row.Date).filter(Boolean);
  if (dates.length > 0) {
    const uniqueDates = [...new Set(dates)];
    if (uniqueDates.length !== dates.length) {
      errors.push('Dates dupliquées détectées');
    }
  }
  
  return {
    is_valid: errors.length === 0,
    errors: errors
  };
};

export const formatNumber = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }
  
  const absValue = Math.abs(value);
  
  if (absValue >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)} Md`;
  } else if (absValue >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)} M`;
  } else if (absValue >= 1_000) {
    return `${(value / 1_000).toFixed(2)} k`;
  } else {
    return value.toFixed(2);
  }
};

export const getModelParameters = async (modelType) => {
  const response = await fetch(`${API_BASE_URL}/model-parameters/${modelType}`);
  return handleResponse(response);
};

export const calculateMetrics = (actual, predicted) => {
  if (!actual || !predicted || actual.length !== predicted.length) {
    return null;
  }
  
  const n = actual.length;
  const mape = actual.reduce((sum, val, i) => {
    if (val !== 0) {
      return sum + Math.abs((val - predicted[i]) / val);
    }
    return sum;
  }, 0) / n;
  
  const rmse = Math.sqrt(
    actual.reduce((sum, val, i) => sum + Math.pow(val - predicted[i], 2), 0) / n
  );
  
  const mae = actual.reduce((sum, val, i) => sum + Math.abs(val - predicted[i]), 0) / n;
  
  return {
    mape,
    rmse,
    mae
  };

};
