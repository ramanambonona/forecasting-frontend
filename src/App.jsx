import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Upload from './components/Upload'
import Visualization from './components/Visualization'
import Forecasting from './components/Forecasting'
import { DataProvider } from './context/DataContext'
import { ForecastProvider } from './context/ForecastContext'

function App() {
  const [activeTab, setActiveTab] = useState('upload')
  const [backendStatus, setBackendStatus] = useState('checking')

  useEffect(() => {
    checkBackendStatus()
  }, [])

const checkBackendStatus = async () => {
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
  const healthUrl = `${apiBaseUrl}/health`
  
  try {
    const response = await fetch(healthUrl)
    if (response.ok) {
      setBackendStatus('connected')
    } else {
      setBackendStatus('error')
    }
  } catch (error) {
    setBackendStatus('error')
  }
}

  const renderContent = () => {
    switch (activeTab) {
      case 'upload':
        return <Upload />
      case 'visualization':
        return <Visualization />
      case 'forecasting':
        return <Forecasting />
      default:
        return <Upload />
    }
  }

  return (
    <DataProvider>
      <ForecastProvider>
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 font-palatino">
          <Navbar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            backendStatus={backendStatus}
          />
          
          <main className="container mx-auto px-4 py-8 min-h-screen">
            {renderContent()}
          </main>
          
          <Footer />
        </div>
      </ForecastProvider>
    </DataProvider>
  )
}


export default App
