import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '@/utils/cognitoAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = isAuthenticated();
        setIsAuthed(authenticated);
        
        if (!authenticated) {
          console.log('User not authenticated, redirecting to sign in...');
          navigate('/signin');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        navigate('/signin');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading...</h2>
          <p className="text-gray-600">Please wait while we verify your authentication.</p>
        </div>
      </div>
    );
  }

  if (!isAuthed) {
    return null; // Will redirect to sign in
  }

  return <>{children}</>;
};

export default ProtectedRoute; 