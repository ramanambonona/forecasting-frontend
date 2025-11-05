import React from 'react';

const Navbar = ({ activeTab, setActiveTab, backendStatus }) => {
  const tabs = [
    { id: 'upload', label: 'Upload', icon: '📤' },
    { id: 'visualization', label: 'Visualisation', icon: '📈' },
    { id: 'forecasting', label: 'Prévisions', icon: '🔮' }
  ];

  const getStatusColor = () => {
    switch (backendStatus) {
      case 'connected': return 'text-green-500';
      case 'error': return 'text-red-500';
      default: return 'text-yellow-500';
    }
  };

  const getStatusText = () => {
    switch (backendStatus) {
      case 'connected': return 'Connecté';
      case 'error': return 'Erreur';
      default: return 'Connexion...';
    }
  };

  return (
    <nav className="bg-white shadow-elegant py-4 px-6 sticky top-0 z-50">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        {/* Logo et titre */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-800 rounded-xl flex items-center justify-center">
            <i className="fas fa-chart-line text-white"></i>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-amber-900">Macro Forecasting Pro</h1>
            <div className="flex items-center space-x-2 text-sm">
              <div className={`flex items-center space-x-1 ${getStatusColor()}`}>
                <i className="fas fa-circle text-xs"></i>
                <span>{getStatusText()}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="flex space-x-1 bg-amber-100 p-1 rounded-xl">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-amber-700 hover:bg-amber-200'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
        
        {/* Status et actions */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => window.location.reload()}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            <i className="fas fa-sync-alt mr-2"></i>
            Actualiser
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;