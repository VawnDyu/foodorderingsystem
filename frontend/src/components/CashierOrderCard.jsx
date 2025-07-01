import styles from './CashierOrderCard.module.css';
import { FaClock, FaUser } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { markOrderAsPaid, cancelOrder } from '../redux/ordersSlice';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import React, { useRef } from 'react';

import PrintableReceipt from './PrintableReceipt';

export default function CashierOrderCard({ order }) {
  const dispatch = useDispatch();
  const printRef = useRef();

  const orderStatusMap = {
    Paid: { emoji: '🔵', label: 'Paid', className: styles.badgePaid },
    Preparing: { emoji: '🟠', label: 'Preparing', className: styles.badgePreparing },
    Cancelled: { emoji: '🔴', label: 'Cancelled', className: styles.badgeCancelled },
    Pending: { emoji: '🟡', label: 'Unpaid', className: styles.badgeUnpaid },
    Completed: { emoji: '🟢', label: 'Completed', className: styles.badgePaid },
  };

  const status = orderStatusMap[order.orderStatus] || {
    emoji: 'ℹ️',
    label: order.paymentStatus || 'Unknown',
    className: styles.badgeUnpaid,
  };

const handlePrint = () => {
  const printContent = printRef.current;

  if (!printContent) {
    console.error('❌ Nothing to print. printRef is null.');
    return;
  }

  // Create and configure the iframe
  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.top = '0';
  iframe.style.left = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow.document;

  // Write a basic HTML structure
  doc.open();
  doc.write(`<!DOCTYPE html><html><head></head><body></body></html>`);
  doc.close();

  // Add custom styles
  const style = doc.createElement('style');
  style.textContent = `
    body {
      font-family: Poppins, sans-serif;
      padding: 20px;
    }
    .receipt {
      border: 1px solid #ccc;
      padding: 10px;
      background: #fff;
    }
    .receipt h3 {
      text-align: center;
    }
  `;
  doc.head.appendChild(style);

  // Clone and insert the content
  const clonedContent = printContent.cloneNode(true);
  doc.body.appendChild(clonedContent);

  // Wait a bit for styles to apply, then print
  setTimeout(() => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    document.body.removeChild(iframe); // Clean up
  }, 250);
};

  const handleMarkAsPaid = () => dispatch(markOrderAsPaid(order._id));

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
      {/* ✅ Hidden PrintableReceipt (always rendered, just hidden) */}
      <div style={{ display: 'none' }}>
        <div ref={printRef} style={{ width: '500px', padding: '2rem', fontFamily: 'monospace', fontSize: '0.9rem', position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)'}}>
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0 }}>My Food Store</h2>
            <p style={{ margin: 0 }}>123 Tasty St., Foodville</p>
            <p style={{ margin: 0 }}>Tel: (123) 456-7890</p>
          </div>

          <hr style={{ borderTop: '1px dashed #000', margin: '0.5rem 0' }} />

          <PrintableReceipt order={order} status={status} />

          <hr style={{ borderTop: '1px dashed #000', margin: '0.5rem 0' }} />

          <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '1rem' }}>
            Total: ₱ {order.totalPrice.toFixed(2)}
          </div>

          <hr style={{ borderTop: '1px dashed #000', margin: '0.5rem 0' }} />

          <p style={{ textAlign: 'center', marginTop: '1rem' }}>
            Thank you for purchasing!
            <br />
            Please come again.
          </p>

          <p style={{ fontSize: '0.75rem', textAlign: 'center', marginTop: '1rem', color: '#555' }}>
            No refunds or exchanges after 24 hours.
          </p>
        </div>
      </div>


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
        {order.paymentStatus !== 'Cancelled' && order.paymentStatus !== 'Paid' && (
          <button onClick={handleMarkAsPaid} className={`${styles.btn} ${styles.btnMarkPaid}`}>
            Mark as Paid
          </button>
        )}
        {order.paymentStatus !== 'Pending' && (
          <button onClick={handlePrint} className={`${styles.btn} ${styles.btnPrint}`}>
            Print Receipt
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
