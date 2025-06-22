#!/usr/bin/env python3
"""
PointClickCare Authentication Service (Python)
==================================================

This Python service handles PointClickCare OAuth authentication,
replacing the Node.js implementation with a more robust Python solution.

Features:
- OAuth 2.0 flow with PointClickCare
- Token exchange and refresh
- User profile and facility data retrieval
- Tenant mapping and access control
- JWT token generation for Blue Pine API
- Demo mode for testing

Author: Blue Pine AI
Version: 1.0.0
"""

import os
import json
import time
import uuid
import base64
import hashlib
import hmac
import requests
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Union, Any
from dataclasses import dataclass, asdict
from flask import Flask, request, jsonify, session
from flask_cors import CORS
import jwt
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
@dataclass
class PCCConfig:
    client_id: str = os.getenv('POINTCLICKCARE_CLIENT_ID', 'your_pcc_client_id')
    client_secret: str = os.getenv('POINTCLICKCARE_CLIENT_SECRET', 'your_pcc_client_secret')
    base_url: str = 'https://api.pointclickcare.com'
    auth_url: str = 'https://auth.pointclickcare.com/oauth2/authorize'
    token_url: str = 'https://auth.pointclickcare.com/oauth2/token'
    scope: str = 'read write'
    demo_mode: bool = os.getenv('POINTCLICKCARE_DEMO_MODE', 'true').lower() == 'true'
    jwt_secret: str = os.getenv('JWT_SECRET', 'your-secret-key-change-in-production')
    jwt_expiry_hours: int = 24

@dataclass
class PCCUser:
    id: str
    username: str
    email: str
    first_name: str
    last_name: str
    facilities: List[Dict] = None
    
    def __post_init__(self):
        if self.facilities is None:
            self.facilities = []

@dataclass
class TenantMapping:
    tenant_id: str
    facility_name: str
    facility_id: str
    access_level: str  # 'full', 'read', 'limited'

class PointClickCareAuth:
    """Main PointClickCare Authentication Service"""
    
    def __init__(self, config: PCCConfig = None):
        self.config = config or PCCConfig()
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'BluePineAI-PCCAuth/1.0.0',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        })
        
        logger.info("🏥 PointClickCare Authentication Service initialized")
        logger.info(f"🔧 Demo mode: {self.config.demo_mode}")
        logger.info(f"🔧 Client ID: {self.config.client_id[:10]}..." if len(self.config.client_id) > 10 else "Not configured")
    
    def generate_auth_url(self, redirect_uri: str, state: str = None) -> str:
        """Generate OAuth authorization URL"""
        if not state:
            state = str(uuid.uuid4())
        
        params = {
            'response_type': 'code',
            'client_id': self.config.client_id,
            'redirect_uri': redirect_uri,
            'scope': self.config.scope,
            'state': state
        }
        
        url = f"{self.config.auth_url}?" + "&".join([f"{k}={v}" for k, v in params.items()])
        logger.info(f"🔗 Generated auth URL: {url}")
        return url
    
    def exchange_code_for_tokens(self, code: str, redirect_uri: str) -> Dict[str, Any]:
        """Exchange authorization code for access tokens"""
        if self.config.demo_mode:
            return self._demo_token_exchange()
        
        data = {
            'grant_type': 'authorization_code',
            'client_id': self.config.client_id,
            'client_secret': self.config.client_secret,
            'code': code,
            'redirect_uri': redirect_uri
        }
        
        try:
            response = self.session.post(
                self.config.token_url,
                data=data,
                headers={'Content-Type': 'application/x-www-form-urlencoded'}
            )
            response.raise_for_status()
            
            tokens = response.json()
            logger.info("✅ Successfully exchanged code for tokens")
            return tokens
            
        except requests.RequestException as e:
            logger.error(f"❌ Token exchange failed: {e}")
            raise Exception(f"Token exchange failed: {str(e)}")
    
    def get_user_profile(self, access_token: str) -> PCCUser:
        """Get user profile from PointClickCare API"""
        if self.config.demo_mode:
            return self._demo_user_profile()
        
        try:
            headers = {'Authorization': f'Bearer {access_token}'}
            
            # Get user info
            user_response = self.session.get(
                f"{self.config.base_url}/v1/user/me",
                headers=headers
            )
            user_response.raise_for_status()
            user_data = user_response.json()
            
            # Get facilities
            facilities = []
            try:
                facilities_response = self.session.get(
                    f"{self.config.base_url}/v1/facilities",
                    headers=headers
                )
                if facilities_response.status_code == 200:
                    facilities = facilities_response.json()
                    logger.info(f"✅ Retrieved {len(facilities)} facilities")
            except Exception as e:
                logger.warning(f"⚠️ Failed to retrieve facilities: {e}")
            
            user = PCCUser(
                id=str(user_data.get('id', user_data.get('userId', 'unknown'))),
                username=user_data.get('username', ''),
                email=user_data.get('email', f"{user_data.get('username', 'user')}@pointclickcare.com"),
                first_name=user_data.get('firstName', user_data.get('first_name', '')),
                last_name=user_data.get('lastName', user_data.get('last_name', '')),
                facilities=facilities
            )
            
            logger.info(f"✅ Retrieved user profile for: {user.email}")
            return user
            
        except requests.RequestException as e:
            logger.error(f"❌ Failed to get user profile: {e}")
            raise Exception(f"Failed to get user profile: {str(e)}")
    
    def map_user_to_tenant(self, user: PCCUser) -> TenantMapping:
        """Map PointClickCare user to Blue Pine tenant"""
        if self.config.demo_mode:
            return TenantMapping(
                tenant_id='pcc-demo-skilled-nursing-facility',
                facility_name='Demo Skilled Nursing Facility',
                facility_id='demo-facility-123',
                access_level='full'
            )
        
        # Real tenant mapping logic
        if not user.facilities:
            # Default mapping for users without facilities
            return TenantMapping(
                tenant_id=f'pcc-user-{user.id}',
                facility_name='PointClickCare User',
                facility_id=user.id,
                access_level='read'
            )
        
        # Use first facility for mapping (can be enhanced)
        primary_facility = user.facilities[0]
        facility_id = str(primary_facility.get('id', primary_facility.get('facilityId', 'unknown')))
        facility_name = primary_facility.get('name', primary_facility.get('facilityName', 'Unknown Facility'))
        
        # Generate tenant ID based on facility
        tenant_id = f"pcc-facility-{facility_id}"
        
        # Determine access level based on user role in facility
        access_level = 'read'  # Default
        user_role = primary_facility.get('userRole', '').lower()
        if user_role in ['admin', 'administrator', 'manager', 'director']:
            access_level = 'full'
        elif user_role in ['nurse', 'supervisor', 'coordinator']:
            access_level = 'write'
        
        mapping = TenantMapping(
            tenant_id=tenant_id,
            facility_name=facility_name,
            facility_id=facility_id,
            access_level=access_level
        )
        
        logger.info(f"✅ Mapped user to tenant: {mapping.tenant_id} ({mapping.facility_name})")
        return mapping
    
    def generate_blue_pine_jwt(self, user: PCCUser, tenant_mapping: TenantMapping) -> str:
        """Generate JWT token for Blue Pine API authentication"""
        now = datetime.utcnow()
        exp = now + timedelta(hours=self.config.jwt_expiry_hours)
        
        payload = {
            'sub': f'pcc-{user.id}',
            'email': user.email,
            'given_name': user.first_name,
            'family_name': user.last_name,
            'name': f"{user.first_name} {user.last_name}".strip(),
            'cognito:username': f'pcc-{user.id}',
            'provider': 'pointclickcare',
            'tenant_id': tenant_mapping.tenant_id,
            'facility_id': tenant_mapping.facility_id,
            'access_level': tenant_mapping.access_level,
            'iss': 'blue-pine-api',
            'aud': 'blue-pine-frontend',
            'iat': int(now.timestamp()),
            'exp': int(exp.timestamp()),
            'auth_time': int(now.timestamp()),
            'token_use': 'id'
        }
        
        token = jwt.encode(payload, self.config.jwt_secret, algorithm='HS256')
        logger.info(f"✅ Generated JWT token for user: {payload['sub']}")
        return token
    
    def verify_jwt_token(self, token: str) -> Dict[str, Any]:
        """Verify and decode JWT token"""
        try:
            payload = jwt.decode(token, self.config.jwt_secret, algorithms=['HS256'])
            logger.info(f"✅ JWT token verified for user: {payload.get('sub')}")
            return payload
        except jwt.ExpiredSignatureError:
            logger.error("❌ JWT token has expired")
            raise Exception("Token has expired")
        except jwt.InvalidTokenError as e:
            logger.error(f"❌ Invalid JWT token: {e}")
            raise Exception("Invalid token")
    
    def refresh_access_token(self, refresh_token: str) -> Dict[str, Any]:
        """Refresh access token using refresh token"""
        if self.config.demo_mode:
            return self._demo_token_exchange()
        
        data = {
            'grant_type': 'refresh_token',
            'client_id': self.config.client_id,
            'client_secret': self.config.client_secret,
            'refresh_token': refresh_token
        }
        
        try:
            response = self.session.post(
                self.config.token_url,
                data=data,
                headers={'Content-Type': 'application/x-www-form-urlencoded'}
            )
            response.raise_for_status()
            
            tokens = response.json()
            logger.info("✅ Successfully refreshed access token")
            return tokens
            
        except requests.RequestException as e:
            logger.error(f"❌ Token refresh failed: {e}")
            raise Exception(f"Token refresh failed: {str(e)}")
    
    def _demo_token_exchange(self) -> Dict[str, Any]:
        """Demo mode token exchange"""
        return {
            'access_token': f'demo-access-token-{int(time.time())}',
            'refresh_token': f'demo-refresh-token-{int(time.time())}',
            'id_token': f'demo-id-token-{int(time.time())}',
            'token_type': 'Bearer',
            'expires_in': 3600
        }
    
    def _demo_user_profile(self) -> PCCUser:
        """Demo mode user profile"""
        return PCCUser(
            id='550e8400-e29b-41d4-a716-446655440000',
            username='john.smith',
            email='john.smith@demofacility.com',
            first_name='John',
            last_name='Smith',
            facilities=[
                {
                    'id': 'demo-facility-123',
                    'name': 'Demo Skilled Nursing Facility',
                    'userRole': 'administrator',
                    'status': 'active'
                }
            ]
        )

# Flask application for HTTP endpoints
app = Flask(__name__)
app.secret_key = os.getenv('FLASK_SECRET_KEY', 'blue-pine-flask-secret-2024')
CORS(app, origins=['http://localhost:8084', 'http://localhost:3000'])

# Initialize PCC Auth service
pcc_auth = PointClickCareAuth()

@app.route('/api/auth/pointclickcare/authorize', methods=['POST'])
def initiate_oauth():
    """Initiate PointClickCare OAuth flow"""
    try:
        data = request.get_json()
        redirect_uri = data.get('redirect_uri')
        
        if not redirect_uri:
            return jsonify({'error': 'redirect_uri is required'}), 400
        
        # Check if we're in demo mode or don't have real credentials
        if pcc_auth.config.demo_mode or pcc_auth.config.client_id == 'your_pcc_client_id':
            logger.info("🧪 Demo mode: Redirecting to demo callback")
            # In demo mode, return a special demo URL that triggers the demo flow
            demo_callback_url = f"{redirect_uri}?demo=true&code=demo-auth-code"
            return jsonify({
                'auth_url': demo_callback_url,
                'state': 'demo-state'
            })
        
        # Real OAuth flow
        state = str(uuid.uuid4())
        session['oauth_state'] = state
        
        auth_url = pcc_auth.generate_auth_url(redirect_uri, state)
        
        return jsonify({
            'auth_url': auth_url,
            'state': state
        })
        
    except Exception as e:
        logger.error(f"❌ OAuth initiation failed: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/pointclickcare/token', methods=['POST'])
def exchange_token():
    """Exchange authorization code for tokens"""
    try:
        data = request.get_json()
        code = data.get('code')
        redirect_uri = data.get('redirect_uri')
        state = data.get('state')
        
        if not code:
            return jsonify({'error': 'Authorization code is required'}), 400
        
        # Verify state parameter
        stored_state = session.get('oauth_state')
        if state and stored_state and state != stored_state:
            return jsonify({'error': 'Invalid state parameter'}), 400
        
        # Exchange code for tokens
        tokens = pcc_auth.exchange_code_for_tokens(code, redirect_uri)
        
        # Get user profile
        user = pcc_auth.get_user_profile(tokens['access_token'])
        
        # Map to tenant
        tenant_mapping = pcc_auth.map_user_to_tenant(user)
        
        # Generate Blue Pine JWT
        blue_pine_jwt = pcc_auth.generate_blue_pine_jwt(user, tenant_mapping)
        
        # Clean up session
        session.pop('oauth_state', None)
        
        return jsonify({
            'access_token': tokens['access_token'],
            'refresh_token': tokens.get('refresh_token'),
            'id_token': tokens.get('id_token'),
            'blue_pine_jwt': blue_pine_jwt,
            'userInfo': asdict(user),
            'tenantMapping': asdict(tenant_mapping)
        })
        
    except Exception as e:
        logger.error(f"❌ Token exchange failed: {e}")
        return jsonify({
            'error': 'PointClickCare authentication failed',
            'message': str(e)
        }), 500

@app.route('/api/auth/pointclickcare/profile', methods=['GET'])
def get_profile():
    """Get user profile using access token"""
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Bearer token required'}), 401
        
        access_token = auth_header.replace('Bearer ', '')
        user = pcc_auth.get_user_profile(access_token)
        
        return jsonify({
            'user': asdict(user),
            'facilities': user.facilities
        })
        
    except Exception as e:
        logger.error(f"❌ Profile retrieval failed: {e}")
        return jsonify({
            'error': 'Failed to retrieve profile',
            'message': str(e)
        }), 500

@app.route('/api/auth/pointclickcare/refresh', methods=['POST'])
def refresh_token():
    """Refresh access token"""
    try:
        data = request.get_json()
        refresh_token = data.get('refresh_token')
        
        if not refresh_token:
            return jsonify({'error': 'Refresh token is required'}), 400
        
        tokens = pcc_auth.refresh_access_token(refresh_token)
        
        return jsonify(tokens)
        
    except Exception as e:
        logger.error(f"❌ Token refresh failed: {e}")
        return jsonify({
            'error': 'Token refresh failed',
            'message': str(e)
        }), 500

@app.route('/api/auth/pointclickcare/verify', methods=['POST'])
def verify_token():
    """Verify JWT token"""
    try:
        data = request.get_json()
        token = data.get('token')
        
        if not token:
            return jsonify({'error': 'Token is required'}), 400
        
        payload = pcc_auth.verify_jwt_token(token)
        
        return jsonify({
            'valid': True,
            'payload': payload
        })
        
    except Exception as e:
        logger.error(f"❌ Token verification failed: {e}")
        return jsonify({
            'valid': False,
            'error': str(e)
        }), 401

@app.route('/api/auth/pointclickcare/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'PointClickCare Auth Service (Python)',
        'version': '1.0.0',
        'demo_mode': pcc_auth.config.demo_mode,
        'timestamp': datetime.utcnow().isoformat()
    })

if __name__ == '__main__':
    port = int(os.getenv('PCC_AUTH_PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'false').lower() == 'true'
    
    logger.info(f"🚀 Starting PointClickCare Auth Service on port {port}")
    logger.info(f"🔧 Debug mode: {debug}")
    logger.info(f"🔧 Demo mode: {pcc_auth.config.demo_mode}")
    
    app.run(host='0.0.0.0', port=port, debug=debug) 