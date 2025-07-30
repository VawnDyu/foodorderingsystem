//React Hooks
import { useEffect, useState } from 'react';

//React Redux
import { useDispatch, useSelector } from 'react-redux';

//React Async Thunk
import { fetchOrderCount } from '../redux/ordersSlice';

//Custom Hooks
import styles from './DashboardCards.module.css';

//Framer Motion
import { motion, AnimatePresence } from 'framer-motion';

//React Icons
import { FaSpinner } from 'react-icons/fa';

//Socket.io
import socket from '../api/socket';

const DashboardCards = () => {
  const ranges = ['today', 'week', 'month', 'year'];
  const labels = {
    today: 'Orders Today',
    week: 'Orders this Week',
    month: 'Orders this Month',
    year: 'Orders this Year',
  };
  const [currentRangeIndex, setCurrentRangeIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const currentRange = ranges[currentRangeIndex];
  const dispatch = useDispatch();
  const { orderCounts, completedOrders, loading } = useSelector((state) => state.orders);
  const orders = completedOrders[currentRange] || [];

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const paginatedOrders = orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    ranges.forEach((range) => {
      dispatch(fetchOrderCount(range));
    });
  }, [dispatch]);

  useEffect(() => {
    const handleOrderUpdate = (updatedOrder) => {
      console.log('Received updated order:', updatedOrder);
      ranges.forEach((range) => {
        dispatch(fetchOrderCount(range));
      });
    };

    socket.on('orderUpdate', handleOrderUpdate);
    return () => {
      socket.off('orderUpdate', handleOrderUpdate);
    };
  }, [dispatch]);

  const handleCardClick = () => {
    setCurrentRangeIndex((prev) => (prev + 1) % ranges.length);
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  const currentData = orderCounts?.[currentRange] || {};
  const count = currentData.count ?? 0;
  const sales = currentData.totalSales ?? 0;
  const topDish = currentData.topDish || 'N/A';
  const topDishEmoji = currentData.topDishEmoji || '';

  return (
    <>
      <div className={styles.cards}>
        {/* Orders Count Card */}
        <div className={styles.card} onClick={handleCardClick} title="Click to cycle range">
          <AnimatePresence mode="wait">
            <motion.div
              key={loading ? 'loading' : currentRange}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {loading ? (
                <FaSpinner className={styles.spinner} />
              ) : (
                `${labels[currentRange]}: ${count}`
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Total Sales Card */}
        <div className={styles.card} onClick={handleCardClick} title="Click to cycle range">
          <AnimatePresence mode="wait">
            <motion.div
              key={loading ? 'loading' : currentRange}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {loading ? (
                <FaSpinner className={styles.spinner} />
              ) : (
                `Total Sales: ₱${sales.toFixed(2)}`
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Top Dish Card */}
        <div className={styles.card} onClick={handleCardClick} title="Click to cycle range">
          <AnimatePresence mode="wait">
            <motion.div
              key={loading ? 'loading' : currentRange}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {loading ? (
                <FaSpinner className={styles.spinner} />
              ) : (
                `Top Dish: ${topDishEmoji} ${topDish}`
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Static Cards */}
        <div className={styles.card}>Users: 12</div>
      </div>
      <div className={styles.tableCard}>
      <div className={styles.tableWrapper}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Items</th>
              <th>Status</th>
            </tr>
          </thead>
          <AnimatePresence mode="wait">
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5">Loading...</td>
                </tr>
              ) : paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan="5">No completed orders found</td>
                </tr>
              ) : (
                paginatedOrders.map((order) => (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td>{order._id}</td>
                    <td>{order.customerId?.nickname || 'N/A'}</td>
                    <td>
                      {order.items.map((item, index) => (
                        <div key={index}>
                          {item.name} x {item.quantity}
                        </div>
                      ))}
                    </td>
                    <td>{order.orderStatus}</td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </AnimatePresence>
        </table>
      </div>

      <div className={styles.pagination}>
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>Prev</button>
        {getPageNumbers().map((page) => (
          <button
            key={page}
            className={currentPage === page ? styles.activePage : ''}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
        <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}>Next</button>
      </div>
      </div>
    </>
  );
};

export default DashboardCards;
