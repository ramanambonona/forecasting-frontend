import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';

const FilePreview = () => {
  const { data } = useContext(DataContext);

  if (!data || data.length === 0) {
    return null;
  }

  const columns = Object.keys(data[0]);
  const previewData = data.slice(0, 10);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
      <h2 className="text-2xl font-bold text-amber-900 mb-6">
        <i className="fas fa-eye mr-2"></i>Aperçu des Données
      </h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-amber-200 rounded-lg overflow-hidden">
          <thead className="bg-amber-100">
            <tr>
              {columns.map(column => (
                <th key={column} className="py-3 px-4 text-left font-semibold text-amber-800">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-200">
            {previewData.map((row, index) => (
              <tr key={index}>
                {columns.map(column => (
                  <td key={column} className="py-2 px-4 border-t border-amber-200">
                    {typeof row[column] === 'number' 
                      ? row[column].toLocaleString('fr-FR', { maximumFractionDigits: 2 })
                      : row[column] || '-'
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-sm text-amber-600">
        Affichage des 10 premières lignes sur {data.length} au total. {columns.length} colonnes détectées.
      </div>
    </div>
  );
};

export default FilePreview;