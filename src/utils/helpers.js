export const generateForecastDates = (lastDate, periods) => {
  if (!lastDate) {
    return Array.from({ length: periods }, (_, i) => `Période ${i + 1}`);
  }

  try {
    const date = new Date(lastDate);
    const dates = [];
    
    for (let i = 1; i <= periods; i++) {
      const newDate = new Date(date);
      newDate.setMonth(date.getMonth() + i);
      dates.push(newDate.toISOString().split('T')[0]);
    }
    
    return dates;
  } catch (error) {
    return Array.from({ length: periods }, (_, i) => `Période ${i + 1}`);
  }
};

export const getNumericColumns = (data) => {
  if (!data || data.length === 0) return [];
  return Object.keys(data[0]).filter(key => 
    key !== 'Date' && typeof data[0][key] === 'number'
  );
};

export const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const exportToCSV = (data, filename = 'data') => {
  if (!data || data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};