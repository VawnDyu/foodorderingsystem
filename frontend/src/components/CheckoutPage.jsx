//React Hooks
import React from 'react';

//Cart Context
import { useCart } from '../contexts/CartContext';

//React Router
import { useNavigate } from 'react-router-dom';

//Stylesheet
import styles from './CheckoutPage.module.css';

//Redux
import { useDispatch } from 'react-redux';
import { addOrder } from '../redux/orderActions'; // ✅ Adjust the path as needed


const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCheckout = async () => {
    const token = localStorage.getItem('accessToken');
    console.log(token);
    try {
      // Send the order data to the backend
      const items = cartItems.map(item => ({
        itemId: item._id,
        quantity: item.quantity,
      }));

      const response = await dispatch(addOrder({items})); // Make sure `addOrder` returns a response

      console.log(`Response: `,response);
      console.log(`Items: `, items)

      // Check if order was successfully placed
      if (response) {
        clearCart(); // clear in context
        localStorage.removeItem('cartItems'); // clear in localStorage

        // Navigate to the checkout success page
        navigate('/success', {
          state: {fromCheckout: true},
        });
      }
    } catch (error) {
      // Handle any errors
      console.error('Error during checkout:', error.response?.data?.error || error.message);
    }
  };

  if (cartItems.length === 0) {
    return <div className={styles.emptyMessage}>Your cart is empty.</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Checkout</h1>

      {cartItems.map((item) => (
        <div key={item._id} className={styles.item}>
          <div>
            <h2 className={styles.itemName}>{item.name}</h2>
            <p className={styles.itemDetails}>₱ {item.price.toFixed(2)} x {item.quantity}</p>
          </div>
          <p className={styles.itemDetails}>₱ {(item.price * item.quantity).toFixed(2)}</p>
        </div>
      ))}

      <div className={styles.totalContainer}>
      <h2 className={styles.totalText}>
        Total: ₱ {cartTotal.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </h2>
        <button onClick={handleCheckout} className={styles.checkoutButton}>
          Confirm Order
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
