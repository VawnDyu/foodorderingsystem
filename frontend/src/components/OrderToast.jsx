import React from 'react';
import styles from './OrderToast.module.css'; // 👈 import your CSS file
import { useSelector } from 'react-redux';
import { setLatestOrderUpdate } from '../redux/orderSlice';

const OrderToast = () => {
  const latestUpdate = useSelector((state) => state.order.latestUpdate);

  const status = latestUpdate?.status;

  const statusStyles = {
    Pending: { emoji: '🕐', message: 'We’ve received your order! Hang tight.' },
    Paid: { emoji: '💰', message: 'Payment confirmed — thank you!' },
    Preparing: { emoji: '🍳', message: 'We’re now preparing your order!' },
    Completed: { emoji: '✅', message: 'Your order is ready! Come grab it.' },
    Cancelled: { emoji: '❌', message: 'Your order has been cancelled.' },
  };

  const { emoji, message } = statusStyles[status] || {
    emoji: 'ℹ️',
    message: `Your order status is now "${status}".`,
  };

  return (
    <div className={styles.orderToast}>
      <div className={styles.orderToastMessage}>
        {emoji} {message}
      </div>
      <div className={styles.orderToastDismiss}>Click to dismiss</div>
    </div>
  );
};

export default OrderToast;
