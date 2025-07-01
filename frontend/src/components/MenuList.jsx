import { useEffect, useState } from 'react';

//Redux
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMenu,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../redux/menuSlice';

//Stylesheets
import styles from './MenuList.module.css';

//Custom Component
import MenuFormModal from './MenuFormModal';

//React Icons
import { FaRegTrashAlt, FaSearch, FaSortUp, FaSortDown, FaSort, FaThLarge, FaUtensils, FaGlassWhiskey } from "react-icons/fa";
import { MdEditDocument } from "react-icons/md";
import { GiCupcake } from 'react-icons/gi';
import { FiPlus } from 'react-icons/fi';

//React Confirm Alert
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Required CSS

//Framer Motion
import { motion, AnimatePresence } from 'framer-motion';

const MenuList = () => {
  const dispatch = useDispatch();
  const { items: menu, status, error } = useSelector(state => state.menu);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  //Set Category
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { label: 'All', value: 'all', icon: <FaThLarge /> },
    { label: 'Meals', value: 'meals', icon: <FaUtensils /> },
    { label: 'Drinks', value: 'drinks', icon: <FaGlassWhiskey /> },
    { label: 'Desserts', value: 'desserts', icon: <GiCupcake /> },
  ];

  const getCategoryCounts = (menuItems) => {
    const counts = {
      all: menuItems.length,
      meals: 0,
      drinks: 0,
      desserts: 0,
    };

    menuItems.forEach((item) => {
      const category = item.category.toLowerCase();
      if (counts[category] !== undefined) {
        counts[category]++;
      }
    });

    return counts;
  };

  const categoryCounts = getCategoryCounts(menu);

    //Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;
    const currentMenu = menu.slice(indexOfFirstUser, indexOfLastUser);

    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');

    const filteredMenu = selectedCategory === 'all'
    ? menu
    : menu.filter(item => item.category.toLowerCase() === selectedCategory);

    const sortedMenu = [...filteredMenu].sort((a, b) => {
      if (!sortField) return 0;

      const aValue = a[sortField]?.toString().toLowerCase();
      const bValue = b[sortField]?.toString().toLowerCase();

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    const totalPages = Math.ceil(sortedMenu.length / itemsPerPage);

    const handleSort = (field) => {
      const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
      setSortField(field);
      setSortOrder(order);
    };

    const paginatedMenu = sortedMenu.slice(indexOfFirstUser, indexOfLastUser);

    // Fetch Menu on initial render or when searchTerm changes

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

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300); // Debounce delay

    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    dispatch(fetchMenu(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  const openEditModal = (item) => {
    setEditItem(item);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditItem(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditItem(null);
  };

  const handleFormSubmit = (formData) => {
    if (editItem) {
      dispatch(updateMenuItem({ id: editItem._id, formData }));
    } else {
      dispatch(addMenuItem(formData));
    }
    closeModal();
  };

  const handleDelete = (id) => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure you want to delete this item?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => dispatch(deleteMenuItem(id)),
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
      closeOnEscape: true,
      closeOnClickOutside: true,
    });
  };

  return (
    <div className={styles.menuPage}>
      <div className={styles.topBar}>

        <button className={styles.btnAdd} onClick={openAddModal}>
          <FiPlus size={18} />
          Add Item
        </button>

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

        <div className={styles.searchBar}>
          <FaSearch className={`${styles.searchIcon} ${searchTerm ? styles.active : ''}`} />
          <input
            type="text"
            placeholder="Search menu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          {searchTerm && (
            <button className={styles.clearButton} onClick={() => setSearchTerm('')}>
              &times;
            </button>
          )}
        </div>
      </div>

      {status === 'loading' ? (
        <div className={styles.spinnerContainer}>
              <div className={styles.spinner}></div>
            </div> // or a proper loader
      ) : status === 'failed' ? (
        <p>Error: {error}</p>
      ) : (
      <div className={styles.tableWrapper}>
        {menu.length > 0 ? (
          <motion.div
          key={selectedCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          >
        <table className={styles.menuTable}>
          <thead>
            <tr>
              <th>Image</th>

              <th onClick={() => handleSort('name')}>
                <span className={styles.sortHeader}>
                  Name
                  {sortField === 'name' ? (
                    sortOrder === 'asc' ? <FaSortUp size={18} /> : <FaSortDown size={18} />
                  ) : (
                    <FaSort size={18} />
                  )}
                </span>
              </th>
              <th>Price (₱)</th>
              <th>Category</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          <AnimatePresence>
            {paginatedMenu.map(item => (
                <motion.tr
                  key={item._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                <td>
                  <div className={styles.image}>
                    <img
                      src={item.imgUrl}
                      alt={item.name}
                      className={styles.tableImage}
                    />
                  </div>
                </td>
                <td>
                    <div className={styles.name}>
                      {item.name}
                    </div>
                  </td>
                <td>
                    <div className={styles.price}>
                      ₱ {item.price.toFixed(2)}
                    </div>
                </td>
                <td>
                  <div className={styles.category}>
                    {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                  </div>
                </td>
                <td>
                  <div className={styles.description}>
                    {item.description}
                  </div>
                </td>
                <td>
                  <div className={styles.actions}>
                    <div className={styles.tooltipWrapper}>
                      <button
                        className={styles.btnEdit}
                        onClick={() => openEditModal(item)}
                      >
                        <MdEditDocument size={20} />
                      </button>
                      <div className={styles.btnTooltip}>Update</div>
                    </div>
                    <div className={styles.tooltipWrapper}>
                    <button
                      className={styles.btnDelete}
                      onClick={() => handleDelete(item._id)}
                    >
                      <FaRegTrashAlt size={20} />
                    </button>
                    <div className={styles.btnTooltip}>Delete</div>
                    </div>
                  </div>
                </td>
              </motion.tr>
            ))}
            </AnimatePresence>
          </tbody>
        </table>
        </motion.div>
        ) : (
          <div className={styles.noResults}>No menu items found.</div>
        )}
      </div>
      )}
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

      <MenuFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        initialData={editItem}
        onSubmit={handleFormSubmit}
      />
    </div>
      )};

export default MenuList;
