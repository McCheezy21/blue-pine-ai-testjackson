import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handlePointClickCareCallback } from '@/utils/pointClickCareAuth';
import { toast } from 'sonner';

const PointClickCareCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processCallback = async () => {
      console.log('🏥 Processing PointClickCare OAuth callback...');
      
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        const isDemo = searchParams.get('demo') === 'true';
        
        // Handle OAuth errors
        if (error) {
          const errorDescription = searchParams.get('error_description');
          console.error('❌ PointClickCare OAuth Error:', error, errorDescription);
          toast.error('Authentication Failed', {
            description: errorDescription || error,
          });
          navigate('/signin?error=oauth_error');
          return;
        }
        
        // Process the callback
        const result = await handlePointClickCareCallback(code || undefined, state || undefined, isDemo);
        
        if (result.success) {
          console.log('✅ PointClickCare authentication successful');
          
          toast.success('Authentication Successful!', {
            description: 'Welcome to your facility dashboard',
          });
          
          // Get tenant mapping for redirect
          const tenantMappingString = localStorage.getItem('pcc_tenant_mapping');
          if (tenantMappingString) {
            try {
              const tenantMapping = JSON.parse(tenantMappingString);
              const redirectUrl = `/tenant/${tenantMapping.tenantId}/dashboard`;
              
              console.log('🏥 Redirecting to tenant dashboard:', redirectUrl);
              console.log('🏥 Facility:', tenantMapping.facilityName);
              console.log('🏥 Access Level:', tenantMapping.accessLevel);
              
              navigate(redirectUrl, { replace: true });
            } catch (parseError) {
              console.error('Error parsing tenant mapping:', parseError);
              navigate('/select-tenant');
            }
          } else {
            console.log('🔍 No tenant mapping found, redirecting to tenant selection');
            navigate('/select-tenant');
          }
        } else {
          console.error('❌ PointClickCare authentication failed:', result.error);
          toast.error('Authentication Failed', {
            description: result.error || 'Please try again',
          });
          navigate('/signin?error=auth_failed');
        }
      } catch (error) {
        console.error('❌ Callback processing error:', error);
        toast.error('Authentication Error', {
          description: 'An unexpected error occurred during authentication',
        });
        navigate('/signin?error=callback_error');
      } finally {
        setIsProcessing(false);
      }
    };

    processCallback();
  }, [navigate, searchParams]);

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Completing Authentication...</h2>
          <p className="text-gray-600 mb-2">Processing your PointClickCare credentials</p>
          <p className="text-sm text-gray-500">This may take a few seconds</p>
        </div>
      </div>
    );
  }

  return null;
};

export default PointClickCareCallback; 