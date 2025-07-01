import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPendingOrPaidOrders, updateOrderInList } from '../redux/ordersSlice';
import styles from './CashierOrders.module.css';
import OrderCard from './CashierOrderCard';

import socket from '../api/socket';

import { motion, AnimatePresence } from 'framer-motion';

import { FaThLarge, FaClock, FaFireAlt, FaCheckCircle, FaBan, FaMoneyBillWave, } from 'react-icons/fa';

import {useState} from 'react';

export default function CashierDashboard() {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  //Set Category
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { label: 'All', value: 'all', icon: <FaThLarge /> },
    { label: 'Pending', value: 'pending', icon: <FaClock /> },
    { label: 'Paid', value: 'paid', icon: <FaMoneyBillWave /> },
    { label: 'Preparing', value: 'preparing', icon: <FaFireAlt /> },
    { label: 'Completed', value: 'completed', icon: <FaCheckCircle /> },
    { label: 'Cancelled', value: 'cancelled', icon: <FaBan /> },
  ];

    const getCategoryCounts = (orders) => {
    const counts = {
      all: orders.length,
      pending: 0,
      paid: 0,
      preparing: 0,
      completed: 0,
      cancelled: 0,
    };

    orders.forEach((order) => {
      const status = order.orderStatus?.toLowerCase();
      if (counts[status] !== undefined) {
        counts[status]++;
      }
    });

    return counts;
  };

  const categoryCounts = getCategoryCounts(orders);

// Pagination States
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;

const indexOfLastOrder = currentPage * itemsPerPage;
const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;

// Category Filter
const filteredOrders = selectedCategory === 'all'
  ? orders
  : orders.filter(order => order.orderStatus.toLowerCase() === selectedCategory);

const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

// Get current orders for this page
const paginatedOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

// Page numbers (for pagination buttons)
const getPageNumbers = () => {
  const pages = [];
  const maxPagesToShow = 5;
  const startPage = Math.max(currentPage - 2, 1);
  const endPage = Math.min(currentPage + 2, totalPages);

  if (startPage > 1) {
    pages.push(1);
    if (startPage > 2) pages.push('...');
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) pages.push('...');
    pages.push(totalPages);
  }

  return pages;
};

  // Fetch orders when component mounts
    useEffect(() => {
      dispatch(fetchPendingOrPaidOrders());
    }, [dispatch]);

    // Set up socket listener for real-time updates
    useEffect(() => {
    const handleOrderUpdate = (updatedOrder) => {
      console.log('Received updated order:', updatedOrder);
      dispatch(updateOrderInList(updatedOrder));
    };

    socket.on('orderUpdate', handleOrderUpdate);

    // Clean up on unmount
    return () => {
      socket.off('orderUpdate', handleOrderUpdate);
    };
  }, [dispatch]);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.header}>
          <div className={styles.sectionTitle}>
            <h2>📥 Incoming Orders</h2>
          </div>

          <div className={styles.categoryButtons}>
            {categories.map(({ label, value, icon }) => (
              <button
                key={value}
                onClick={() => {
                  setSelectedCategory(value);
                  setCurrentPage(1);
                }}
                className={`${styles.categoryButton} ${
                  selectedCategory === value ? styles.active : ''
                }`}
              >
                <span className={styles.icon}>{icon}</span>
                {label} ({categoryCounts[value] || 0})
              </button>
            ))}
          </div>
        </div>

        {paginatedOrders.length === 0 ? (
          <p>No orders to display.</p>
        ) : (
          <AnimatePresence>
            {paginatedOrders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.3 }}
                layout
              >
                <OrderCard order={order} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </main>
      <div className={styles.pagination}>
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>Prev</button>
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            disabled={page === '...'}
            className={currentPage === page ? styles.activePage : ''}
            onClick={() => typeof page === 'number' && setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
        <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}>Next</button>
      </div>
    </div>
  );
}
