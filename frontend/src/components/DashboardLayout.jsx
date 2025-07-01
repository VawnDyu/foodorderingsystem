//React Hooks
import React, { useState, useEffect } from 'react';

//React Router
import { Link } from 'react-router-dom';

//Stylesheet
import styles from './DashboardLayout.module.css';

//Redux
import { useSelector, useDispatch } from 'react-redux';
import { clearAuth } from '../redux/userSlice';

//React Icons
import { IoFastFood, IoSettingsSharp, IoLogOutSharp } from "react-icons/io5";
import { HiOutlineSquares2X2, HiMiniUsers } from "react-icons/hi2";
import { FaClipboardList } from "react-icons/fa";

//API
import axios from '../api/axios';

//Socket.io
import socket from '../api/socket';


const DashboardLayout = ({ children }) => {

    const user = useSelector(state => state.user.user);
    const adminId = useSelector((state) => state.user.user._id);
    const dispatch = useDispatch(); // Initialize dispatch

    useEffect(() => {
      if (!adminId) return;
      socket.emit('register-admin', adminId);
    }, [adminId]);

    const RemoveTokens = async () => {
        // Remove items from localStorage
        localStorage.removeItem('cartItems');
        sessionStorage.removeItem('cartItems');

        await axios.post('/auth/logout', {}, {
          withCredentials: true,
        });

        dispatch(clearAuth());
    };

    return (
      <div className={styles.dashboardContainer}>
        <aside className={styles.sidebar}>
          <h2>🍔 Food Admin</h2>
          <nav>
            <Link to="/dashboard">
              <HiOutlineSquares2X2 size={24} /> Dashboard
            </Link>
            <Link to="/dashboard">
              <FaClipboardList size={24} /> Orders
            </Link>
            <Link to="/menu">
              <IoFastFood size={24} /> Menu
            </Link>
            <Link to="/users">
              <HiMiniUsers size={24} /> Users
            </Link>
            <Link to="/dashboard">
              <IoSettingsSharp size={24} /> Settings
            </Link>
            <Link to="/login" onClick={RemoveTokens}>
              <IoLogOutSharp size={24} /> Logout
            </Link>
          </nav>
        </aside>

        <main className={styles.mainContent}>
          <header className={styles.topbar}>
            <h1>{user && `🍔 Welcome Back, ${user?.nickname} 🍔`}</h1>
          </header>
          {children}
        </main>
      </div>
    );
};

export default DashboardLayout;
