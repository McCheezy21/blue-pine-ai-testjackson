import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

interface SSOCallbackProps {
  onAuthSuccess: (token: string, user: any) => void;
}

const SSOCallback: React.FC<SSOCallbackProps> = ({ onAuthSuccess }) => {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Extract authorization code and state from URL parameters
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');

        if (error) {
          throw new Error(errorDescription || `SSO Error: ${error}`);
        }

        if (!code || !state) {
          throw new Error('Missing authorization code or state parameter');
        }

        // Exchange code for tokens
        const response = await fetch('/api/auth/sso/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code,
            state,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'SSO authentication failed');
        }

        const authResult = await response.json();

        if (authResult.success && authResult.access_token) {
          setStatus('success');
          
          // Store token
          localStorage.setItem('auth_token', authResult.access_token);
          
          // Call success handler
          onAuthSuccess(authResult.access_token, authResult.user);
          
          // Redirect to dashboard after a brief delay
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
        } else {
          throw new Error('Invalid response from SSO callback');
        }

      } catch (error) {
        console.error('SSO callback error:', error);
        setStatus('error');
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
      }
    };

    handleCallback();
  }, [location.search, navigate, onAuthSuccess]);

  const renderProcessing = () => (
    <div className="flex flex-col items-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Completing sign-in...</h3>
        <p className="text-gray-600">
          We're securely authenticating you with your organization's SSO provider.
        </p>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="flex flex-col items-center space-y-4">
      <CheckCircle className="h-8 w-8 text-green-600" />
      <div className="text-center">
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Sign-in successful!
        </h3>
        <p className="text-gray-600">
          You've been successfully authenticated. Redirecting to your dashboard...
        </p>
      </div>
    </div>
  );

  const renderError = () => (
    <div className="flex flex-col items-center space-y-4">
      <XCircle className="h-8 w-8 text-red-600" />
      <div className="text-center">
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          Sign-in failed
        </h3>
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4 space-y-2">
          <button
            onClick={() => navigate('/signin')}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try again
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Back to home
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {status === 'processing' && 'Authenticating...'}
            {status === 'success' && 'Welcome back!'}
            {status === 'error' && 'Authentication Error'}
          </CardTitle>
        </CardHeader>
        <CardContent className="py-6">
          {status === 'processing' && renderProcessing()}
          {status === 'success' && renderSuccess()}
          {status === 'error' && renderError()}
        </CardContent>
      </Card>
    </div>
  );
};

export default SSOCallback; 