//React Hooks
import React, { useState, useEffect } from 'react';

//Stylesheet
import styles from './CustomerNav.module.css'

//Contexts
import { useCart } from '../contexts/CartContext'; // Import the custom hook

//React Router
import { Link } from 'react-router-dom';

//React Icon
import { BsCart4 } from "react-icons/bs";

//Redux
import { useDispatch, useSelector } from 'react-redux';
import { clearAuth } from '../redux/userSlice';
import { setLatestOrderUpdate } from '../redux/orderSlice';
import { updateOrderInList } from '../redux/ordersSlice';

import socket from '../api/socket';

//Custom Toast Component
import OrderToast from './OrderToast';
import { toast } from 'react-toastify';

//API
import axios from '../api/axios';

const CustomerNav = () => {
  const [isMobile, setIsMobile] = useState(false); // State to toggle menu for mobile
  const [isBurgerClicked, setIsBurgerClicked] = useState(false); // State for burger click animation
  const { cartItems } = useCart(); // Get the cartItems from context
  const customerId = useSelector((state) => state.user.user._id);
  const dispatch = useDispatch(); // Redux dispatch function

  useEffect(() => {
    if (!customerId) return;
    console.log('Emitting register with customerId:', customerId);
    socket.emit('register-customer', customerId);

    socket.on('orderUpdate', (updatedOrder) => {
      dispatch(updateOrderInList(updatedOrder));
      dispatch(setLatestOrderUpdate({
        id: updatedOrder._id,
        status: updatedOrder.orderStatus,
      }));

      toast(<OrderToast />, {
        toastId: 'order-update-toast',
        position: 'top-center',
        autoClose: false,
        closeOnClick: true,
        icon: false,
        draggable: true,
        pauseOnHover: true,
        className: 'customToast',
      });
    });
    return () => {
      socket.off('orderUpdate');
    };
  }, [customerId, dispatch]);

  const toggleMenu = () => {
    setIsMobile(!isMobile); // Toggle the mobile menu visibility
    setIsBurgerClicked(!isBurgerClicked); // Trigger the hamburger animation
  };

  const RemoveTokens = async () => {
    try {
      await axios.post('/auth/logout', {}, { withCredentials: true });

      // Remove data from localStorage and sessionStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('cartItems');
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('cartItems');

      dispatch(clearAuth());
    } catch (error) {
      console.error('Logout failed:', error);
    }

  };

  return (
    <header className={styles.navbar}>
      <div className={styles.navbarContainer}>
      <div
        className={`${styles.hamburger} ${isBurgerClicked ? styles.active : ''}`}
        onClick={toggleMenu}
      >
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
      </div>


      <div className={styles.navbarLogo}>
        <Link to="/cart" className={styles.cartLink}>
          <BsCart4 className={styles.cartIcon} /> Cart ({cartItems.length})
        </Link>
      </div>

        <nav className={`${styles.navbarLinks} ${isMobile ? styles.mobileActive : ''}`}>
          <ul>
            <li><a href="/">Home</a></li>
            <li><Link to="/order">Order</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/account">Account</Link></li>
            <li><Link to="/login" onClick={RemoveTokens}>Logout</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default CustomerNav;
