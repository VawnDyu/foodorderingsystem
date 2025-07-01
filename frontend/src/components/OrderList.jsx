import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../api/axios';
import styles from './OrderList.module.css';

//Framer Motion
import { motion } from 'framer-motion';

const OrderList = () => {
  const [menuItem, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const filteredItems = selectedCategory === 'all'
  ? menuItem
  : menuItem.filter(item => item.category === selectedCategory);

  const categories = ['all', 'meals', 'drinks', 'desserts'];

  useEffect(() => {
    const fetchMenuItems = async () => {
        try {
          const response = await axios.get('/menu');
          setMenuItems(response.data);
        } catch (err) {
          console.log('Failed to load menu items.');
        } finally {
          setLoading(false);
        }
      };
      fetchMenuItems();
  }, []);

  useEffect(() => {
    setCurrentPage(1); // reset to first page when category changes
  }, [selectedCategory]);

  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className={styles.menuContainer}>
      <h1>Menu</h1>

      <div className={styles.categoryButtons}>
        {categories.map(category => (
          <button
            key={category}
            className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
        <motion.div
          key={`${selectedCategory}-${currentPage}`} // ensures re-animation on category/page change
          className={styles.menuItems}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
        {loading ? (
          <div className={styles.spinnerContainer}>
              <div className={styles.spinner}></div>
          </div>
        ) : paginatedItems.length === 0 ? (
          <div className={styles.noItemsContainer}>
              <p>No items found in this category.</p>
          </div>
        ) : (
          paginatedItems.map(menuItem => (
                <Link
                to={`/order/${menuItem._id}`}
                key={menuItem._id}
                className={styles.menuItem}
              >
                <div className={styles.menuImgContainer}>
                    <img src={menuItem.imgUrl} alt={menuItem.name} className={styles.menuImage}/>
                </div>
                <div className={styles.menuNameContainer}>
                    <h2 className={styles.menuName}>{menuItem.name}</h2>
                </div>
                <div className={styles.menuDescContainer}>
                    <p className={styles.menuDescription}>{menuItem.description}</p>
                </div>
                <div className={styles.menuPriceContainer}>
                    <p className={styles.menuPrice}>₱ {menuItem.price.toFixed(2)}</p>
                </div>
              </Link>
            ))
        )}
        </motion.div>
      <div className={styles.pagination}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span>{currentPage} / {totalPages}</span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
    </div>
  );
}

export default OrderList;
