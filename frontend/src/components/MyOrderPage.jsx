import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import styles from './MyOrderPage.module.css';
import { Link } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { FiBox } from 'react-icons/fi';

import { useDispatch } from 'react-redux';
import { fetchAllCustomerOrders } from '../redux/ordersSlice'; // or your actual thunk

const MyOrderPage = () => {
  const orderItems = useSelector((state) => state.orders.orders);

  const customerId = useSelector((state) => state.user.user._id);
  const latestUpdate = useSelector((state) => state.order?.latestUpdate); // 👈 from redux

  const dispatch = useDispatch();

  useEffect(() => {
    if (customerId) {
      dispatch(fetchAllCustomerOrders(customerId)); // Fetch all orders for the customer
    }
  }, [customerId, dispatch]);

  const displayStatus = (order) => {
    // 🔁 If there's a recent update and it matches this order ID, show it
    if (latestUpdate && latestUpdate.id === order._id) {
      return latestUpdate.status;
    }
    return order.orderStatus;
  };

  return (
    <div className={styles.orderContainer}>
      <div className={styles.orderItems}>
        {orderItems.length === 0 ? (
          <div className={styles.noOrdersContainer}>
            <span><FiBox size={24} /></span>
            <p>You do not have any orders yet.</p>
          </div>
        ) : (
          orderItems.map((order) => (
            <Link
              to={`/orders/${order._id}`}
              key={order._id}
              className={styles.orderCard}
            >
              <div className={styles.orderDetailsContainer}>
                <div>
                  <p>Order# {order._id}</p>
                  <p>₱ {order.totalPrice.toFixed(2)}</p>
                </div>
                <div>
                  <p>
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                  <p>{order.orderStatus}</p>
                </div>
              </div>
              <p>View Receipt</p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrderPage;
