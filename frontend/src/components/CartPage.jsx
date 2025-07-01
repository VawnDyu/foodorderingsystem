//React Hooks
import React from 'react';

//Cart Contexts
import { useCart } from '../contexts/CartContext';

//Stylesheets
import styles from './CartPage.module.css';

//Toast Notification
import { toast } from 'react-toastify';

//React Icons
import { FaTrashCan } from "react-icons/fa6";

//React Count
import CountUp from 'react-countup';

//React Route
import { useNavigate } from 'react-router-dom';

// React Confirm Alert
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import the default style
import '../styles/customConfirmAlert.css';

const CartPage = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    cartTotal, 
    incrementQuantity, 
    decrementQuantity 
  } = useCart();  // Access cartItems via useCart

  if (cartItems.length === 0) {
    return <div className={styles.emptyPage}>
              <div className={styles.emptyPageContent}>
                  <span>🛒</span>
                  <p>Your cart is empty. Time to add something tasty!</p>
              </div>
          </div>;
  }

  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleIncrement = (id, currentQty, name) => {
    if (currentQty >= 10) {
      toast.error("Maximum quantity is 10", {autoClose: 1500});
      return;
    }
    incrementQuantity(id);
    toast.success(`Added 1 ${name}`, {autoClose: 500});
  };
  
  const handleDecrement = (id, currentQty, name) => {
    if (currentQty <= 1) {
      toast.error("Minimum quantity is 1", {autoClose: 1500});
      return;
    }
    decrementQuantity(id);
    toast.info(`Removed 1 ${name}`, {autoClose: 500});
  };

  const handleRemoveAllCart = () => {
    confirmAlert({
      title: 'Confirm Action',
      message: 'Are you sure you want to clear your entire cart? This action cannot be undone.',
      buttons: [
        {
          label: 'Yes, Clear Cart',
          onClick: () => {
            clearCart(); // Make sure you have this function
            toast.success('All items have been removed from your cart.', { autoClose: 2000 });
          }
        },
        {
          label: 'Cancel'
        }
      ]
    });
  };

  const handleRemoveItem = (_id, name) => {
    removeFromCart(_id);
    toast.success(`${name} removed from cart.`, { autoClose: 2000 });
  };
  

  const getItemTotal = (_id) => {
    const item = cartItems.find(item => item._id === _id);
    if (!item) return 0;
    return item.price * item.quantity;
  };

  return (
    <div className={styles.cartPageContainer}>
      <h1>Your Cart</h1>
      {cartItems.map((item, index) => (
        <div key={item.id || index} className={styles.cartItems}>
          <div className={styles.itemImageContainer}>
            <img src={item.imgUrl} alt={item.name}/>
          </div>
          <div className={styles.itemNameContainer}>
            <p>{item.name}</p>
            <p className={styles.itemDetails}>₱ {item.price.toFixed(2)} x {item.quantity} = <CountUp end ={getItemTotal(item._id)} prefix="₱ " duration={0.5} separator="," decimals={2} /></p>
          </div>
          <div className={styles.itemQuantityContainer}>
            <button 
              onClick={() => handleDecrement(item._id, item.quantity, item.name)}
              disabled={item.quantity <= 1}
            >
              -
            </button>
            <p>{item.quantity}</p>
            <button 
              onClick={() => handleIncrement(item._id, item.quantity, item.name)}
              disabled={item.quantity >= 10}
            >
              +
            </button>
          </div>
          <div className={styles.itemControlsContainer}>
            <button onClick={() => handleRemoveItem(item._id, item.name)}><FaTrashCan /></button>
          </div>
        </div>
      ))}
      <div className={styles.itemSubtotalContainer}>
        <h3>Subtotal: 
          <span>
            ₱<CountUp end={cartTotal} duration={0.5} separator="," decimals={2} />
          </span>
        </h3>
        
          <div className={styles.itemOptionsContainer}>
            <button onClick={handleCheckout}>Checkout</button>
            <button onClick={handleRemoveAllCart}>Clear Cart</button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
