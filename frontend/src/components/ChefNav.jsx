import React, {useEffect} from "react";

import styles from './CashierNav.module.css';

import { useDispatch, useSelector } from 'react-redux'

import { FaSignOutAlt, FaUserCog, FaCashRegister } from 'react-icons/fa';

import socket from '../api/socket';

import { clearAuth } from '../redux/userSlice';

import axios from '../api/axios';

//React Router
import { useNavigate } from 'react-router-dom';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const ChefNav = () => {

  const chefId = useSelector((state) => state.user.user._id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!chefId) return;
    socket.emit('register-chef', chefId);
  }, [chefId]);

  const handleLogout = () => {
    confirmAlert({
      title: 'Confirm Logout',
      message: 'Are you sure you want to log out?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await axios.post('/auth/logout', {}, { withCredentials: true });
              dispatch(clearAuth());
              navigate('/login');
            } catch (error) {
              console.error('Logout failed:', error);
            }
          }
        },
        {
          label: 'No',
          onClick: () => {
            console.log('Logout canceled');
          }
        }
      ]
    });
  };

    // Determine current page
  const isOnAccount = location.pathname === '/chef/account';
  const headerTitle = isOnAccount ? 'Chef Account' : 'Chef Dashboard';
  const headerIcon = isOnAccount ? <FaUserCog /> : <FaCashRegister />;
  const navButtonLabel = isOnAccount ? 'Dashboard' : 'Account';
  const navButtonIcon = isOnAccount ? <FaCashRegister /> : <FaUserCog />;
  const navTarget = isOnAccount ? '/chef/dashboard' : '/chef/account';

  const handleNavigate = () => {
    navigate(navTarget);
  };

    return (
    <header className={styles.header}>
      <div className={styles.title}>
        {headerIcon} {headerTitle}
      </div>
      <div className={styles.navButtonContainer}>
        <button className={styles.navButton} onClick={handleNavigate}>
          {navButtonIcon} {navButtonLabel}
        </button>
        <button className={`${styles.navButton} ${styles.logout}`} onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </header>
    );
};

export default ChefNav;