import React from 'react';
import { Settings, ExternalLink } from 'lucide-react';

const AdminAccess = () => {
  const handleAdminAccess = () => {
    // Use localhost for development, subdomain for production
    const adminUrl = process.env.NODE_ENV === 'production' 
      ? 'https://admin.bluepineai.com'
      : 'http://localhost:3000';
    
    window.open(adminUrl, '_blank');
  };

  return (
    <button
      onClick={handleAdminAccess}
      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm font-medium"
      title="Access Admin Panel"
    >
      <Settings className="w-4 h-4" />
      Admin Panel
      <ExternalLink className="w-3 h-3" />
    </button>
  );
};

export default AdminAccess; 