import styles from './ChefOrderCard.module.css';
import { FaClock, FaUser } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { markOrderAsCompleted, markOrderAsPreparing, cancelOrder } from '../redux/ordersSlice';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export default function ChefOrderCard({ order }) {
  const dispatch = useDispatch();

  const orderStatusMap = {
    Paid: { emoji: '🔵', label: 'Paid', className: styles.badgePaid },
    Preparing: { emoji: '🟠', label: 'Preparing', className: styles.badgePreparing },
    Cancelled: { emoji: '🔴', label: 'Cancelled', className: styles.badgeCancelled },
    Completed: { emoji: '🟢', label: 'Completed', className: styles.badgePaid },
  };

  const status = orderStatusMap[order.orderStatus] || {
    emoji: 'ℹ️',
    label: order.paymentStatus || 'Unknown',
    className: styles.badgeUnpaid,
  };

  const handlePreparing = () => dispatch(markOrderAsPreparing(order._id));
  const handleCompleted = () => dispatch(markOrderAsCompleted(order._id));

  const handleCancelOrder = () => {
    confirmAlert({
      title: 'Confirm to cancel',
      message: 'Are you sure you want to cancel this order?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => dispatch(cancelOrder(order._id)),
        },
        {
          label: 'No',
        },
      ],
    });
  };
  console.log(order);

  return (
    <div className={styles.card}>
      {/* 🔴 Visible Order Card */}
      <div>
        <div className={styles.cardHeader}>
          <h3>Order #{order._id}</h3>
          <span className={status.className}>
            {status.emoji} {status.label}
          </span>
        </div>
        <p className={styles.timestamp}>
          <span>
            <FaUser />{' '}
            {order.customerId.nickname}
          </span>
          <FaClock />{' '}
          {new Date(order.createdAt).toLocaleString([], {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })}
        </p>
        <ul className={styles.itemList}>
          {order.items.map((item, idx) => (
            <li key={idx}>
              - {item.name} x {item.quantity} (₱ {(item.quantity * item.price).toFixed(2)})
            </li>
          ))}
        </ul>
      </div>

      {/* 🟡 Buttons */}
      <div className={styles.actions}>
        {order.orderStatus == 'Paid' && (
          <button onClick={handlePreparing} className={`${styles.btn} ${styles.btnPrepare}`}>
              Prepare Order
          </button>
        )}

        {order.orderStatus === 'Preparing' && (
            <button onClick={handleCompleted} className={`${styles.btn} ${styles.btnComplete}`}>
                Complete Order
            </button>
        )}

        {order.paymentStatus !== 'Cancelled' && order.orderStatus !== 'Completed' && (
          <button onClick={handleCancelOrder} className={`${styles.btn} ${styles.btnCancel}`}>
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
}
