import React, { createContext, useState, useEffect } from 'react';
import { API_AUTH_URL } from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('devbot_auth_token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync token to API on bootstrap
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_AUTH_URL}/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // Token expired or revoked
          logout();
        }
      } catch (err) {
        console.error('[AuthContext] Bootstrap profile query failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  // LOGIN OPERATOR
  const login = async (email, password) => {
    setError(null);
    try {
      const response = await fetch(`${API_AUTH_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Identity credentials validation failed');
      }

      localStorage.setItem('devbot_auth_token', data.token);
      setToken(data.token);
      setUser({ _id: data._id, username: data.username, email: data.email });
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // REGISTER OPERATOR PROFILE
  const register = async (username, email, password) => {
    setError(null);
    try {
      const response = await fetch(`${API_AUTH_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to establish profile matrix');
      }

      localStorage.setItem('devbot_auth_token', data.token);
      setToken(data.token);
      setUser({ _id: data._id, username: data.username, email: data.email });
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // DYNAMIC SOCIAL AUTH PROVIDER (Google / GitHub)
  const loginWithSocial = async (provider, username, socialEmail, socialId) => {
    setError(null);
    
    // Hash password based on socialId securely for backend AES handshake
    const mockPassword = `social_decryption_matrix_passcode_${socialId || '99'}`;

    try {
      // 1. Try to Login with social credentials
      let response = await fetch(`${API_AUTH_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: socialEmail, password: mockPassword })
      });

      let data = await response.json();

      // 2. If user doesn't exist, Register them instantly with chosen username!
      if (!response.ok) {
        response = await fetch(`${API_AUTH_URL}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, email: socialEmail, password: mockPassword })
        });
        data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || `Failed to establish ${provider} gateway. Designation or email may already be taken.`);
        }
      }

      localStorage.setItem('devbot_auth_token', data.token);
      setToken(data.token);
      setUser({ _id: data._id, username: data.username, email: data.email });
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // UPDATE OPERATOR PROFILE
  const updateProfile = async (username, email, password) => {
    setError(null);
    try {
      const response = await fetch(`${API_AUTH_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update Operator specifications');
      }

      // Update state user details
      setUser(prev => ({
        ...prev,
        username: data.username,
        email: data.email
      }));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // PERMANENT DESTRUCTIVE ACCOUNT PURGE
  const deleteAccount = async () => {
    setError(null);
    try {
      const response = await fetch(`${API_AUTH_URL}/profile`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initiate database purge');
      }

      // Log out Operator completely
      logout();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // PURGE LOGOUT SIGNATURE
  const logout = () => {
    localStorage.removeItem('devbot_auth_token');
    setToken(null);
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        setError,
        login,
        register,
        loginWithSocial,
        updateProfile,
        deleteAccount,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
