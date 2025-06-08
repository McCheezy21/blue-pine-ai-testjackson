import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { initiateGoogleLogin } from '../utils/cognitoAuth';

interface InvitationData {
  tenant_id: string;
  company_name: string;
  plan: string;
  role: string;
  email: string;
}

export const Invite: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError('Invalid invitation link');
      setLoading(false);
      return;
    }

    // Verify invitation token
    fetch(`http://localhost:3001/api/invitations/${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.valid) {
          setInvitation(data.invitation);
        } else {
          setError(data.error || 'Invalid or expired invitation');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error verifying invitation:', err);
        setError('Failed to verify invitation');
        setLoading(false);
      });
  }, [token]);

  const handleAcceptInvitation = async () => {
    if (!token || !invitation) return;
    
    setAccepting(true);
    setError(null);

    try {
      // First, sign in with Google
      await initiateGoogleLogin();
      
      // Get the authenticated user's email to validate domain
      const userEmail = localStorage.getItem('userEmail');
      
      // Validate email domain before accepting invitation
      if (userEmail && !userEmail.toLowerCase().endsWith('@bluepineai.com')) {
        setError('Access denied. Only @bluepineai.com email addresses are allowed for this tenant.');
        setAccepting(false);
        return;
      }
      
      // After successful auth, accept the invitation
      const response = await fetch(`http://localhost:3001/api/invitations/${token}/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        // Redirect to tenant dashboard
        navigate(`/tenant/${invitation.tenant_id}/dashboard`);
      } else {
        setError(result.error || 'Failed to accept invitation');
      }
    } catch (err) {
      console.error('Error accepting invitation:', err);
      setError('Failed to accept invitation. Please try again.');
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying invitation...</p>
        </div>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="text-red-500 text-6xl">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900">Invalid Invitation</h1>
          <p className="text-gray-600">
            {error || 'This invitation link is invalid or has expired.'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <div className="text-blue-600 text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-gray-900">You're Invited!</h1>
          <p className="mt-2 text-gray-600">
            Welcome to Blue Pine AI
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {invitation.company_name}
          </h2>
          <p className="text-gray-600 mb-4">
            You've been invited to join {invitation.company_name}'s workspace 
            on Blue Pine AI's SNF Revenue Cycle automation platform.
          </p>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Plan:</span>
              <span className="font-medium capitalize">{invitation.plan}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Role:</span>
              <span className="font-medium capitalize">{invitation.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email:</span>
              <span className="font-medium">{invitation.email}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={handleAcceptInvitation}
          disabled={accepting}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {accepting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Accepting Invitation...</span>
            </>
          ) : (
            <>
              <span>Accept Invitation & Sign In</span>
              <span>→</span>
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          By accepting this invitation, you'll be signed in with Google and 
          granted access to your organization's workspace.
        </p>
      </div>
    </div>
  );
}; 