import React, { createContext, useState, useContext } from 'react';

const ForecastContext = createContext();

export const ForecastProvider = ({ children }) => {
  const [forecasts, setForecasts] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addForecast = (modelName, forecastData) => {
    setForecasts(prev => ({
      ...prev,
      [modelName]: forecastData
    }));
  };

  const clearForecasts = () => {
    setForecasts({});
  };

  const removeForecast = (modelName) => {
    setForecasts(prev => {
      const newForecasts = { ...prev };
      delete newForecasts[modelName];
      return newForecasts;
    });
  };

  const value = {
    forecasts,
    setForecasts,
    addForecast,
    clearForecasts,
    removeForecast,
    loading,
    setLoading,
    error,
    setError
  };

  return (
    <ForecastContext.Provider value={value}>
      {children}
    </ForecastContext.Provider>
  );
};

export const useForecast = () => {
  const context = useContext(ForecastContext);
  if (!context) {
    throw new Error('useForecast must be used within a ForecastProvider');
  }
  return context;
};

export { ForecastContext };
