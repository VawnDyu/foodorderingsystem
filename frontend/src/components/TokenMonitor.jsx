import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

const getTokenExpiration = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000; // convert to milliseconds
  } catch {
    return null;
  }
};

const getTokenRemainingTime = (token) => {
  const exp = getTokenExpiration(token);
  return exp ? exp - Date.now() : 0;
};

const getTokenFromCookies = (key) => {
  return Cookies.get(key); // reads from cookies
};

const TokenMonitor = () => {
  const [accessTimeLeft, setAccessTimeLeft] = useState(null);
  const [refreshTimeLeft, setRefreshTimeLeft] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const accessToken = getTokenFromCookies('accessToken');
      const refreshToken = getTokenFromCookies('refreshToken');

      if (accessToken) {
        setAccessTimeLeft(getTokenRemainingTime(accessToken));
      } else {
        setAccessTimeLeft(null);
      }

      if (refreshToken) {
        setRefreshTimeLeft(getTokenRemainingTime(refreshToken));
      } else {
        setRefreshTimeLeft(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (ms) => {
    if (ms <= 0) return 'Expired';
    return `${Math.floor(ms / 1000)}s`;
  };

  return (
    <div style={{ padding: '1rem', background: '#222', color: '#0f0', borderRadius: '8px', fontFamily: 'monospace' }}>
      <p><strong>Access Token:</strong> {accessTimeLeft !== null ? formatTime(accessTimeLeft) : 'Not Found'}</p>
      <p><strong>Refresh Token:</strong> {refreshTimeLeft !== null ? formatTime(refreshTimeLeft) : 'Not Found'}</p>
    </div>
  );
};

export default TokenMonitor;
