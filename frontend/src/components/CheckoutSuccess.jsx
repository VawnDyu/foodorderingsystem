import React from 'react';

//React Router
import { useNavigate, useLocation, Navigate } from 'react-router-dom';

//Custom Hooks
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useTokenValidation } from '../hooks/useTokenValidation';

//Components
import CustomerNav from './CustomerNav';

//Stylesheets
import styles from './CheckoutSuccess.module.css';

const CheckoutSuccess = () => {
    useDocumentTitle('Success')
    useTokenValidation(); // Only runs once on mount, checks and refreshes if near expiry
    
    const navigate = useNavigate(); // ✅ use this for programmatic navigation
    const location = useLocation();

    if (!location.state?.fromCheckout) {
        // If not from checkout, redirect away
        return <Navigate to="/menu" />;
      }

    const handleNavigate = () => {
      navigate('/account');
    }

  return (
    <>
        <CustomerNav />
            <div className={styles.successContainer}>
              <div className={styles.successContent}>
                  <h1>Order Placed!</h1>
                  <p>Kindly pay at the counter to begin preparing your order. Thank you!</p>
                  <button onClick={handleNavigate}>Go to My Orders</button>
                </div>
            </div>
    </>
  );
};

export default CheckoutSuccess;