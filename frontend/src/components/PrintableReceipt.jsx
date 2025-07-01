import React from 'react';

const PrintableReceipt = React.forwardRef(({ order, status }, ref) => {
  // Decide class for status badge
  const badgeClass =
    status.label === 'Paid'
      ? 'badge badge-paid'
      : status.label === 'Cancelled'
      ? 'badge badge-cancelled'
      : 'badge badge-unpaid';

  return (
    <div ref={ref}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <h3>Order #{order._id}</h3>
        <span className={badgeClass}>
          {status.emoji} {status.label}
        </span>
      </div>

      <p>
        {new Date(order.createdAt).toLocaleString([], {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })}
      </p>

      <ul style={{listStyle: 'none', paddingLeft: '0'}}>
        {order.items.map((item, idx) => (
          <li key={idx}>
            - {item.name} x {item.quantity} (₱ {(item.quantity * item.price).toFixed(2)})
          </li>
        ))}
      </ul>
    </div>
  );
});

export default PrintableReceipt;
