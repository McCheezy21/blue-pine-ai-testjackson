import React from 'react';
import BluePineLogo from './ui/BluePineLogo';

const LogoTest: React.FC = () => {
  return (
    <div className="p-8 bg-white">
      <h1 className="text-2xl font-bold mb-4">Logo Test</h1>
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Small Logo:</h2>
          <BluePineLogo size="sm" />
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Medium Logo:</h2>
          <BluePineLogo size="md" />
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Large Logo:</h2>
          <BluePineLogo size="lg" />
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Extra Large Logo:</h2>
          <BluePineLogo size="xl" />
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Extra Extra Large Logo:</h2>
          <BluePineLogo size="xxl" />
        </div>
      </div>
    </div>
  );
};

export default LogoTest; 