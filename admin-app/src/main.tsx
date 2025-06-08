import React from 'react'
import ReactDOM from 'react-dom/client'
import { Admin } from '../../src/pages/Admin'
import './index.css'

// Simple admin-only app
const AdminApp = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/408a9d6d-f5ef-4982-8932-336aecfb2915.png" 
                alt="Blue Pine AI Logo" 
                className="h-8 w-8 mr-3"
              />
              <h1 className="text-xl font-semibold text-gray-900">
                Blue Pine AI Admin Panel
              </h1>
            </div>
            <a 
              href="https://bluepineai.com" 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              ← Back to Main Site
            </a>
          </div>
        </div>
      </div>
      <Admin />
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AdminApp />
  </React.StrictMode>,
) 