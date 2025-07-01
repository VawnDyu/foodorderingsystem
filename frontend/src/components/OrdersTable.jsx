import React from 'react';

const OrdersTable = () => {
  // Dummy data
  const orders = [
    { id: 101, name: "John Doe", items: "Burger x2", status: "Preparing" },
    { id: 102, name: "Jane Smith", items: "Pizza x1", status: "Delivered" },
    { id: 103, name: "John Doe", items: "Burger x2", status: "Preparing" },
    { id: 104, name: "Jane Smith", items: "Pizza x1", status: "Delivered" },
    { id: 105, name: "John Doe", items: "Burger x2", status: "Preparing" },
    { id: 106, name: "Jane Smith", items: "Pizza x1", status: "Delivered" },
    { id: 107, name: "John Doe", items: "Burger x2", status: "Preparing" },
    { id: 108, name: "Jane Smith", items: "Pizza x1", status: "Delivered" },
    { id: 109, name: "John Doe", items: "Burger x2", status: "Preparing" },
    { id: 110, name: "Jane Smith", items: "Pizza x1", status: "Delivered" },
    { id: 111, name: "John Doe", items: "Burger x2", status: "Preparing" },
  ];

  return (
    <table style={{ width: '100%', background: 'white', padding: '1rem', borderRadius: '8px' }}>
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Customer</th>
          <th>Items</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {orders.map(order => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{order.name}</td>
            <td>{order.items}</td>
            <td>{order.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrdersTable;
