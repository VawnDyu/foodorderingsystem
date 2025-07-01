//React Router
import { useParams } from 'react-router-dom';

//React Hooks
import { useEffect, useState } from 'react';

//API
import axios from '../api/axios';

//Context
import { useCart } from '../contexts/CartContext'; // 👈

//Stylesheets
import styles from './OrderDetails.module.css';

//Components
import CustomerNav from './CustomerNav';

//Custom Hooks
import { useTokenValidation } from '../hooks/useTokenValidation';
import { useDocumentTitle } from '../hooks/useDocumentTitle'

// Toast notifications
import { toast } from 'react-toastify';

// React Confirm Alert
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import the default style
import '../styles/customConfirmAlert.css';

const OrderDetails = () => {
    const { id } = useParams();
    const [menuItem, setMenuItem] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const { addToCart, cartItems } = useCart(); //Get cart items

    useDocumentTitle(`Order - ${menuItem ? menuItem.name : 'Loading...'}`);
    useTokenValidation(); // Only runs once on mount, checks and refreshes if near expiry

    useEffect(() => {
        const fetchOrderItem = async () => {
            try {
              const response = await axios.get(`/order/${id}`);
              setMenuItem(response.data);
            } catch (err) {
              console.log('Failed to load order item.', err);
            }
        };
        fetchOrderItem();
    }, [id]);

    const handleAddToCart = () => {
      if (menuItem && quantity > 0) {
        const status = addToCart({ ...menuItem, quantity: parseInt(quantity, 10) });

        if (status.type === 'maxReached') {
          const remaining = status.remaining;

          if (remaining > 0) {
            // Ask user nicely
            confirmAlert({
              title: 'Limit Reached',
              message: `You can only add ${remaining} more ${menuItem.name}(s). Would you like to add them?`,
              buttons: [
                {
                  label: 'Yes',
                  onClick: () => {
                    addToCart({ ...menuItem, quantity: remaining });
                    toast.success(`${remaining} ${menuItem.name}(s) added to cart!`, {autoClose: 2000});
                  }
                },
                {
                  label: 'No',
                  onClick: () => {
                    toast.info('No items were added.', {autoClose: 2000});
                  }
                }
              ]
            });
          } else {
            toast.error(`You already have the maximum 10 ${menuItem.name}(s)!`, {autoClose: 1000, toastId: 'custom-toast-id-error'});
          }

        } else if (status.type === 'added') {
          toast.success(`${menuItem.name} added to cart!`, {autoClose: 1000, toastId: 'custom-toast-id-add'});
        }
      }
    };

    const handleIncrement = () => {
        if (quantity < 10) {
            setQuantity(quantity + 1); // Increment the quantity by 1
        }
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1); // Decrement the quantity by 1
        }
    };

    if (!menuItem) return <div>Loading...</div>;

    return (
      <>
        <CustomerNav />

        <div className={styles.orderDetailsContainer}>
            <div className={styles.orderDetailsImgContainer}>
              <img src={menuItem.imgUrl} alt={menuItem.name} className={styles.orderDetailsImg}/>
            </div>

            <div className={styles.orderDetailsContentContainer}>
              <div className={styles.itemHeader}>
                <h1 className={styles.orderDetailsName}>{menuItem.name}</h1>
                <p><em>{menuItem.category.charAt(0).toUpperCase() + menuItem.category.slice(1)}</em></p>
              </div>
              <p className={styles.orderDetailsPrice}>₱{menuItem.price.toFixed(2)}</p>
              <p className={styles.orderDescription}>{menuItem.description}{menuItem.description}</p>
            </div>

            <div className={styles.controls}>

              <div className={styles.quantityBtn}>
                <button className={styles.circularBtn} onClick={handleDecrement} >
                  -
                </button>

                <span className={styles.quantityLabel}>{quantity}</span>

                <button className={styles.circularBtn} onClick={handleIncrement} >
                  +
                </button>
              </div>

                <div className={styles.button}>
                  <button className={styles.addToCartBtn} onClick={handleAddToCart} >Add to Cart</button>
                </div>
            </div>
        </div>
        </>
    );
};

export default OrderDetails;
