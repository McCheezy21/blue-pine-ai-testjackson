import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Shield, Building, Mail, ArrowRight, CheckCircle } from 'lucide-react';

interface SSOLoginProps {
  onSSOSuccess: (token: string, user: any) => void;
  onGoogleLogin: () => void;
  onFallbackAuth: () => void;
}

interface SSODiscoveryResult {
  hasSSO: boolean;
  provider?: string;
  organization?: {
    id: string;
    name: string;
    subdomain: string;
  };
  config?: {
    id: string;
    provider: string;
  };
}

const SSOLogin: React.FC<SSOLoginProps> = ({ onSSOSuccess, onGoogleLogin, onFallbackAuth }) => {
  const [email, setEmail] = useState('');
  const [authMode, setAuthMode] = useState<'auto' | 'consumer' | 'enterprise'>('auto');
  const [ssoDiscovery, setSSODiscovery] = useState<SSODiscoveryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingSSO, setIsCheckingSSO] = useState(false);

  // Auto-detect SSO when email is entered
  useEffect(() => {
    const checkSSO = async () => {
      if (!email || !email.includes('@') || email.split('@')[1].length < 3) {
        setSSODiscovery(null);
        return;
      }

      setIsCheckingSSO(true);
      try {
        const response = await fetch('/api/auth/sso/discover', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });

        if (response.ok) {
          const ssoInfo = await response.json();
          setSSODiscovery(ssoInfo);
          if (ssoInfo.hasSSO && authMode === 'auto') {
            setAuthMode('enterprise');
          }
        } else {
          setSSODiscovery({ hasSSO: false });
          if (authMode === 'auto') {
            setAuthMode('consumer');
          }
        }
      } catch (error) {
        console.error('SSO discovery failed:', error);
        setSSODiscovery({ hasSSO: false });
        if (authMode === 'auto') {
          setAuthMode('consumer');
        }
      } finally {
        setIsCheckingSSO(false);
      }
    };

    const debounce = setTimeout(checkSSO, 500);
    return () => clearTimeout(debounce);
  }, [email, authMode]);

  const handleSSOLogin = async () => {
    if (!ssoDiscovery?.hasSSO || !email) return;

    setIsLoading(true);
    setError(null);

    try {
      // Initiate SSO
      const response = await fetch('/api/auth/sso/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        throw new Error('Failed to initiate SSO');
      }

      const { redirect_url } = await response.json();
      
      // Redirect to SSO provider
      window.location.href = redirect_url;
      
    } catch (error) {
      console.error('SSO initiation failed:', error);
      setError('Failed to start SSO login. Please try again.');
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    onGoogleLogin();
  };

  const handleFallbackAuth = () => {
    setIsLoading(true);
    onFallbackAuth();
  };

  const renderAuthModeSelector = () => (
    <div className="flex mb-6 bg-gray-50 p-1 rounded-lg">
      <button
        onClick={() => setAuthMode('consumer')}
        className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
          authMode === 'consumer' 
            ? 'bg-white shadow-sm text-gray-900' 
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Individual Account
      </button>
      <button
        onClick={() => setAuthMode('enterprise')}
        className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
          authMode === 'enterprise' 
            ? 'bg-white shadow-sm text-gray-900' 
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        Enterprise SSO
      </button>
    </div>
  );

  const renderSSODetectedBanner = () => {
    if (!ssoDiscovery?.hasSSO || authMode !== 'enterprise') return null;

    return (
      <Alert className="mb-4 border-blue-200 bg-blue-50">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <strong>SSO detected</strong> for {ssoDiscovery.organization?.name}
              <br />
              <span className="text-sm">Continue with your organization's single sign-on</span>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {ssoDiscovery.provider?.replace('-', ' ').toUpperCase()}
            </Badge>
          </div>
        </AlertDescription>
      </Alert>
    );
  };

  const renderConsumerAuth = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
        {isCheckingSSO && (
          <p className="text-sm text-gray-500">Checking for SSO configuration...</p>
        )}
      </div>

      <Button 
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>

      <Button 
        onClick={handleFallbackAuth}
        variant="outline"
        disabled={isLoading}
        className="w-full"
      >
        Email & Password
      </Button>
    </div>
  );

  const renderEnterpriseAuth = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="enterprise-email">Work email address</Label>
        <Input
          id="enterprise-email"
          type="email"
          placeholder="Enter your work email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
        {isCheckingSSO && (
          <p className="text-sm text-gray-500">Checking SSO configuration...</p>
        )}
      </div>

      {renderSSODetectedBanner()}

      {ssoDiscovery?.hasSSO ? (
        <Button 
          onClick={handleSSOLogin}
          disabled={isLoading || !email}
          className="w-full flex items-center justify-center gap-2"
        >
          <Building className="w-4 h-4" />
          Continue with {ssoDiscovery.organization?.name}
          <ArrowRight className="w-4 h-4" />
        </Button>
      ) : (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500 mb-3">
            {email && !isCheckingSSO 
              ? 'No SSO configuration found for this domain' 
              : 'Enter your work email to check for SSO'
            }
          </p>
          <Button 
            onClick={() => setAuthMode('consumer')}
            variant="outline"
            size="sm"
          >
            Use personal account instead
          </Button>
        </div>
      )}

      {!ssoDiscovery?.hasSSO && email && !isCheckingSSO && (
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-2">
            Don't have SSO set up yet?
          </p>
          <Button 
            onClick={handleGoogleLogin}
            variant="ghost"
            size="sm"
            className="text-xs"
          >
            Continue with Google instead
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Sign in to Blue Pine AI</CardTitle>
        <CardDescription className="text-center">
          Welcome back! Choose how you'd like to sign in.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert className="mb-4" variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {authMode === 'auto' && renderAuthModeSelector()}
        {authMode !== 'auto' && renderAuthModeSelector()}

        {authMode === 'consumer' && renderConsumerAuth()}
        {authMode === 'enterprise' && renderEnterpriseAuth()}

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SSOLogin; 