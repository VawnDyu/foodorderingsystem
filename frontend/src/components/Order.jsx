import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addOrder } from '../redux/orderActions';  // Assuming you have action creators
import axios from '../api/axios';
import styles from './Order.module.css'

const Order = () => {
  const [items, setItems] = useState([]);
  const [quantity, setQuantity] = useState({});
  const [menuItems, setMenuItems] = useState([]);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);  // Get the logged-in user from Redux state

  // Fetch menu items when the component mounts
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get('/menu');
        setMenuItems(response.data);
      } catch (error) {
        setError('Failed to load menu items.');
      }
    };
    fetchMenuItems();
  }, []);

  const handleQuantityChange = (itemId, value) => {
    setQuantity(prevQuantity => ({
      ...prevQuantity,
      [itemId]: value,
    }));
  };

  const handleSubmit = async () => {
    // Prepare the order items
    const orderItems = menuItems
      .filter(item => quantity[item._id] > 0)  // Only include items with a quantity greater than 0
      .map(item => ({
        itemId: item._id,
        quantity: quantity[item._id],
      }));

    if (orderItems.length === 0) {
      setError('Please select at least one item.');
      return;
    }

    // Prepare the order data
    const orderData = {
      items: orderItems,
    };

    try {
      // Make the API call to create the order
      await dispatch(addOrder(orderData)); // If you're using Redux, dispatch an action
      alert('Order placed successfully!');
    } catch (err) {
      setError('Failed to place the order. Please try again.');
    }
  };

  return (
    <div className={styles.orderContainer}>
      <h2>Place Your Order</h2>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.menuItems}>
        {menuItems.length === 0 ? (
          <p>Loading menu items...</p>
        ) : (
          menuItems.map(item => (
            <div key={item._id} className={styles.menuItem}>
              <img src={item.imgUrl} alt={item.name} className={styles.menuItemImage} />
              <h4>{item.name}</h4>
              <p>{item.description}</p>
              <p>Price: ₱{item.price}</p>

              <div className={styles.quantityControls}>
              <button className={styles.circularBtn}
                onClick={() =>
                  handleQuantityChange(item._id, Math.max((quantity[item._id] || 0) - 1, 0))
                }
              >
                –
              </button>
              <span>{quantity[item._id] || 0}</span>
              <button className={styles.circularBtn}
                onClick={() =>
                  handleQuantityChange(item._id, Math.min((quantity[item._id] || 0) + 1, 10)
                  )
                }
              >
                +
              </button>
              </div>
            </div>
          ))
        )}
      </div>

      <button className={styles.placeOrderButton} onClick={handleSubmit}>
        Place Order
      </button>
    </div>
  );
};

export default Order;
