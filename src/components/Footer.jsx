import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-amber-800 to-amber-900 text-white py-12 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <i className="fas fa-chart-line text-amber-700 text-xl"></i>
              </div>
              <h2 className="text-2xl font-bold">Forecasting Tools</h2>
            </div>
            <p className="text-amber-200 max-w-md">
              Plateforme avancée d'analyse et de prévision utilisant les modèles de prévisions classiques et l'intelligence artificielle et le machine learning.
            </p>
          </div>
          
          <div className="flex space-x-6">
            <a href="https://github.com/ramanambonona" target="_blank" 
               className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-800 rounded-xl flex items-center justify-center hover:shadow-lg transition-all duration-300 transform hover:scale-110">
              <i className="fab fa-github text-white text-lg"></i>
            </a>
            <a href="https://linkedin.com/in/ambinintsoa-ramanambonona" target="_blank"
               className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-800 rounded-xl flex items-center justify-center hover:shadow-lg transition-all duration-300 transform hover:scale-110">
              <i className="fab fa-linkedin-in text-white text-lg"></i>
            </a>
            <a href="mailto:ambinintsoa.uat.ead2@gmail.com"
               className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-800 rounded-xl flex items-center justify-center hover:shadow-lg transition-all duration-300 transform hover:scale-110">
              <i className="fas fa-envelope text-white text-lg"></i>
            </a>
          </div>
        </div>
        
        <div className="border-t border-amber-700 mt-8 pt-8 text-center text-amber-300">
          <p>&copy; 2025 Forecasting Tools. Ramanambonona Ambinintsoa.</p>
        </div>
      </div>
    </footer>
  );
};


export default Footer;


