import React, { useState, useEffect } from "react";

//Redux
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, addUser, deleteUser } from '../redux/UsersSlice';

//Components
import { avatarMap } from '../components/AvatarImages';
import UserFormModal from "./UserFormModal";

// Stylesheets
import styles from './usersPage.module.css';

// React Icons
import { AiOutlineUserAdd } from "react-icons/ai";
import { FaRegTrashAlt, FaSearch, FaSortUp, FaSortDown, FaSort, FaUsers, FaUserShield, FaUser, FaCashRegister } from "react-icons/fa";
import { GiChefToque } from 'react-icons/gi';

//Framer Motion
import { motion, AnimatePresence } from 'framer-motion';

//React Confirm Alert
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Required CSS

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector(state => state.users);

  const [isModalOpen, setIsModalOpen] = useState(false);

  //Set Category Roles
  const [selectedRole, setSelectedRole] = useState('all');

  const roles = [
    { label: 'All', value: 'all', icon: <FaUsers /> },
    { label: 'Admin', value: 'admin', icon: <FaUserShield /> },
    { label: 'Customer', value: 'customer', icon: <FaUser /> },
    { label: 'Cashier', value: 'cashier', icon: <FaCashRegister /> },
    { label: 'Chef', value: 'chef', icon: <GiChefToque /> },
  ];

  const getRoleCounts = (roleCounts) => {
    const counts = {
      all: roleCounts.length,
      admin: 0,
      customer: 0,
      cashier: 0,
      chef: 0,
    };

    roleCounts.forEach((user) => {
      const role = user.role.toLowerCase();
      if (counts[role] !== undefined) {
        counts[role]++;
      }
    });
    return counts;
  };

  const categoryCounts = getRoleCounts(users);

  //Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  const filteredUser = selectedRole === 'all'
  ? users
  : users.filter(user => user.role.toLowerCase() === selectedRole);

  const sortedUsers = [...filteredUser].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField]?.toString().toLowerCase();
    const bValue = b[sortField]?.toString().toLowerCase();

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
  };

  const paginatedUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Fetch users on initial render or when searchTerm changes

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

  const openAddModal = () => {
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
  }

  const handleFormSubmit = (FormData) => {
    dispatch(addUser(FormData));
    closeModal();
  }

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      dispatch(fetchUsers(searchTerm));
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, dispatch]);

  const handleDelete = (id) => {
      confirmAlert({
        title: 'Confirm to delete',
        message: 'Are you sure you want to delete this item?',
        buttons: [
          {
            label: 'Yes',
            onClick: () => dispatch(deleteUser(id)),
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
    <div className={styles.container}>
      <div className={styles.topBar}>
        <button className={styles.addUsers} onClick={openAddModal}>
          <AiOutlineUserAdd size={18} /> Add Users
        </button>

        <div className={styles.categoryButtons}>
                  {roles.map(({ label, value, icon }) => (
                    <button
                      key={value}
                      onClick={() => {
                        setSelectedRole(value);
                        setCurrentPage(1);
                      }}
                      className={`${styles.categoryButton} ${
                        selectedRole === value ? styles.active : ''
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
            placeholder="Search users..."
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

      <div className={styles.tableContainer}>
        {loading ? (
            <div className={styles.spinnerContainer}>
              <div className={styles.spinner}></div>
            </div> // or a proper loader
        ) : error ? (
          <p className={styles.error}>Error: {error}</p>
        ) : (
          <motion.div
          key={selectedRole}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          >
          <table className={styles.userTable}>
            <thead>
              <tr>
                <th>Avatar</th>

                <th onClick={() => handleSort('nickname')}>
                  <span className={styles.sortHeader}>
                    Nickname
                    {sortField === 'nickname' ? (
                      sortOrder === 'asc' ? <FaSortUp size={18} /> : <FaSortDown size={18} />
                    ) : (
                      <FaSort size={18} />
                    )}
                  </span>
                </th>

                <th onClick={() => handleSort('username')} className={styles.sortableHeader}>
                  <span className={styles.sortHeader}>
                    Username
                    {sortField === 'username' ? (
                      sortOrder === 'asc' ? <FaSortUp size={18} /> : <FaSortDown size={18} />
                    ) : (
                      <FaSort size={18} />
                    )}
                  </span>
                </th>

                <th onClick={() => handleSort('email')} className={styles.sortableHeader}>
                  <span className={styles.sortHeader}>
                    Email
                    {sortField === 'email' ? (
                      sortOrder === 'asc' ? <FaSortUp size={18} /> : <FaSortDown size={18} />
                    ) : (
                      <FaSort size={18} />
                    )}
                  </span>
                </th>

                <th onClick={() => handleSort('role')} className={styles.sortableHeader}>
                  <span className={styles.sortHeader}>
                    Role
                    {sortField === 'role' ? (
                      sortOrder === 'asc' ? <FaSortUp size={18} /> : <FaSortDown size={18} />
                    ) : (
                      <FaSort size={18} />
                    )}
                  </span>
                </th>

                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
              {paginatedUsers.map(user => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                    >
                    <td>
                    <img
                        src={avatarMap[user.imgSrc] || avatarMap['avatar1.jpg']}
                        alt={user.imgSrc}
                        className={styles.image}
                    />
                    </td>
                    <td>{user.nickname}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                    <div className={styles.actions}>
                        <div className={styles.tooltipWrapper}>
                          <button className={styles.btnDelete}
                          onClick={() => handleDelete(user._id)}>
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
        )}
      </div>
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

          <UserFormModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handleFormSubmit}
          />

    </div>
  );
};

export default UsersPage;
