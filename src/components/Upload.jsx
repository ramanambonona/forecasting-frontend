import React, { useState, useContext } from 'react';
import { DataContext } from '../context/DataContext';
import { uploadData, validateData } from '../api/api';
import FilePreview from './FilePreview';
import DataAnalysis from './DataAnalysis';

const Upload = () => {
  const { setData, setAnalysis } = useContext(DataContext);
  const [file, setFile] = useState(null);
  const [orientation, setOrientation] = useState('dates_in_rows');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const allowedTypes = ['text/csv', 'application/vnd.ms-excel', 
                           'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Type de fichier non supporté. Utilisez CSV, XLS ou XLSX.');
        return;
      }
      
      setFile(selectedFile);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Veuillez sélectionner un fichier');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('orientation', orientation);

      const response = await uploadData(formData);
      
      if (response.success) {
        setData(response.data);
        setAnalysis(response.analysis);
        
        const validation = validateData(response.data);
        if (!validation.is_valid) {
          setError('Données invalides: ' + validation.errors.join(', '));
        }
      } else {
        setError(response.message || 'Erreur lors du téléchargement');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <h1 className="text-3xl font-bold text-amber-900 mb-2">
          <i className="fas fa-upload mr-3"></i>Upload des Données
        </h1>
        <p className="text-amber-700 mb-6">
          Uploadez vos données pour analyse et prévision
        </p>
        
        {/* Zone de dépôt de fichier */}
        <div className="border-2 border-dashed border-amber-300 rounded-2xl p-8 text-center mb-6 bg-amber-50 transition-all duration-300 hover:border-amber-400">
          <input
            type="file"
            onChange={handleFileChange}
            accept=".csv,.xls,.xlsx"
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer block"
          >
            <div className="text-6xl mb-4 text-amber-500">
              <i className="fas fa-cloud-upload-alt"></i>
            </div>
            <p className="text-amber-700 mb-2 text-xl font-semibold">
              {file ? file.name : 'Cliquez pour sélectionner un fichier'}
            </p>
            <p className="text-amber-600 text-sm">
              Formats supportés: CSV, XLS, XLSX (Max 10MB)
            </p>
          </label>
        </div>

        {/* Options d'orientation */}
        <div className="mb-6">
          <label className="block text-amber-800 font-semibold mb-3 text-lg">
            <i className="fas fa-table mr-2"></i>Orientation des données:
          </label>
          <div className="flex space-x-4 mobile-stack">
            <button
              onClick={() => setOrientation('dates_in_rows')}
              className={`flex-1 py-3 px-4 rounded-xl transition-all duration-300 mobile-full ${
                orientation === 'dates_in_rows'
                  ? 'bg-amber-600 text-white shadow-lg'
                  : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
              }`}
            >
              <i className="fas fa-grip-lines mr-2"></i>Dates en lignes
            </button>
            <button
              onClick={() => setOrientation('dates_in_columns')}
              className={`flex-1 py-3 px-4 rounded-xl transition-all duration-300 mobile-full ${
                orientation === 'dates_in_columns'
                  ? 'bg-amber-600 text-white shadow-lg'
                  : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
              }`}
            >
              <i className="fas fa-columns mr-2"></i>Dates en colonnes
            </button>
          </div>
        </div>

        {/* Bouton d'upload */}
        <button
          onClick={handleUpload}
          disabled={loading || !file}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
            loading || !file
              ? 'bg-amber-400 cursor-not-allowed'
              : 'bg-amber-600 hover:bg-amber-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="loading-spinner mr-3"></div>
              Traitement en cours...
            </div>
          ) : (
            '📤 Upload et Analyser les Données'
          )}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-xl text-red-700">
            <i className="fas fa-exclamation-triangle mr-2"></i>
            {error}
          </div>
        )}
      </div>

      {/* Aperçu et analyse */}
      <FilePreview />
      <DataAnalysis />
    </div>
  );
};


export default Upload;
