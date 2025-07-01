//React Hooks
import React, { useEffect, useState, useRef } from 'react';

//React Router
import { useParams } from 'react-router-dom';

//API
import axios from '../api/axios';

//Stylesheet
import styles from './OrderReceipt.module.css';

//Custom Hooks
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useTokenValidation } from '../hooks/useTokenValidation';

//Components
import CustomerNav from '../components/CustomerNav';

const OrderReceipt = () => {
  useDocumentTitle('Order Receipt')
  useTokenValidation(); // Only runs once on mount, checks and refreshes if near expiry

  const { id } = useParams();
  const [orders, setOrders] = useState(null);
  const printRef = useRef();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`/orders/${id}`);
        setOrders(response.data);
      } catch (err) {
        console.log('Failed to load order item.', err);
      }
    };
    fetchOrders();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (!orders) return <div>Loading...</div>;

  const { _id, createdAt, orderStatus, paymentStatus, items, totalPrice } = orders;

  return (
    <>
      <CustomerNav />
      <div className={styles.receiptContainer} ref={printRef}>
        <h2 className={styles.receiptTitle}>Order Receipt</h2>

        <div className={styles.receiptInfo}>
          <p><strong>Order ID:</strong> {_id}</p>
          <p><strong>Date: </strong>
            {new Date(createdAt).toLocaleString('en-US', {
              month: 'short',  // 'Jan'
              day: 'numeric',  // '1'
              year: 'numeric', // '2025'
              hour: '2-digit', // '4'
              minute: '2-digit', // '24'
              second: '2-digit', // '02'
              hour12: true,     // 'PM'
            })}
          </p>
          <p><strong>Status:</strong> {orderStatus}</p>
          <p><strong>Payment:</strong> {paymentStatus}</p>
        </div>

        <div className={styles.receiptItems}>
          {items.map((item) => (
            <div className={styles.receiptItem} key={item._id}>
              <span>{item.name} × {item.quantity}</span>
              <span>₱ {(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <p className={styles.totalPrice}>Total: ₱{totalPrice.toFixed(2)}</p>

        {orderStatus === 'Completed' && paymentStatus === 'Completed' && (
          <button className={styles.printButton} onClick={handlePrint}>
            Print Receipt
          </button>
        )}
      </div>
    </>
  );
};

export default OrderReceipt;
