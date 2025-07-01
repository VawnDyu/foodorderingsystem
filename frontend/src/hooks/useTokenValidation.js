import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useDispatch } from 'react-redux';
import { setUser, clearAuth } from '../redux/userSlice';

export const useTokenValidation = () => {
  const [isChecking, setIsChecking] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState(null); // ✅ Track last successful refresh
  const dispatch = useDispatch();

  useEffect(() => {
    const validateToken = async () => {
      try {
        console.log('🔄 Validating token...');

        const res = await axios.post('/auth/refresh-token', {}, {
          withCredentials: true,
        });

        dispatch(setUser(res.data.user));

        console.log('✅ Token refreshed at:', new Date().toLocaleTimeString());
        setIsValid(true);
        setLastRefreshedAt(new Date()); // ✅ Set refresh timestamp
      } catch (err) {
        console.error('❌ Token refresh failed:', err);
        dispatch(clearAuth());
        setIsValid(false);
      } finally {
        setIsChecking(false);
      }
    };

    validateToken();
  }, [dispatch]);

  return { isChecking, isValid, lastRefreshedAt }; // ✅ Expose timestamp
};
