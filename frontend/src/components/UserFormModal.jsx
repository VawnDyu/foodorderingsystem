// src/components/UserFormModal.jsx

import { useState, useEffect } from 'react';
import styles from './UserFormModal.module.css';
import InputWithIcon from './InputWithIcon';
import { FaUserAlt, FaUserTag, FaEnvelope, FaKey, FaIdBadge } from 'react-icons/fa';

const UserFormModal = ({ isOpen, onClose, initialData, onSubmit }) => {
  const [formData, setFormData] = useState({
    nickname: '',
    username: '',
    password: '',
    email: '',
    role: ''
  });

  const generateRandomPassword = () => {
    return Math.random().toString(36).slice(-8); // simple random 8-char password
  };

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        nickname: '',
        username: '',
        password: generateRandomPassword(),
        email: '',
        role: ''
      });
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <h2>Add User</h2>

          <InputWithIcon
            type="text"
            icon={FaUserAlt}
            name="nickname"
            placeholder="Nickname"
            value={formData.nickname}
            onChange={handleChange}
            required
          />

          <InputWithIcon
            type="text"
            icon={FaUserTag}
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <InputWithIcon
            type="text"
            icon={FaKey}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            readOnly={initialData ? false : true} // make read-only on new user creation
          />

          <InputWithIcon
            type="email"
            icon={FaEnvelope}
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div className={styles.inputContainer}>
            <FaIdBadge className={styles.icon} />
            <select
              className={styles.selectField}
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="Customer">Customer</option>
              <option value="Cashier">Cashier</option>
              <option value="Chef">Chef</option>
            </select>
          </div>

          <div className={styles.modalButtons}>
            <button className={styles.saveBtn} type="submit">Save</button>
            <button className={styles.cancelBtn} type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
