// ./tabs/ChangeAvatar.jsx
import React, { useState } from 'react';
import styles from './ChangeEmail.module.css'; // You can rename this later
import axios from '../api/axios';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice'; // adjust path if needed

const ChangeEmail = () => {
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChangeEmail = async () => {
    if (!newEmail || !currentPassword) {
      toast.error('Please fill in both email and password.');
      return;
    }

    if (!isValidEmail(newEmail)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    try {
      const res = await axios.patch('/user/email', {
        newEmail,
        currentPassword,
      }, {
        withCredentials: true,
      });

      // ✅ Update Redux
      dispatch(setUser({ ...user, email: newEmail }));
      toast.success('Your email has been changed successfully.');

      setNewEmail('');
      setCurrentPassword('');
    } catch (err) {
      console.error('Email change error:', err);
      const msg = err.response?.data?.message || 'Failed to change email. Please try again.';
      toast.error(msg);
    }
  };

  return (
      <div className={styles.container}>
        <div className={styles.form}>
            <div className={styles.header}>
                <h2>Change Email</h2>
                <p>Email: {user.email}</p>
            </div>

            <p>New Email</p>
            <div className={styles.inputWrapper}>
              <input
                type="email"
                placeholder="Enter here..."
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>

            <div className={styles.validation}>
              <small>Please enter a valid email address.</small>
            </div>

            <p>Current Password</p>
            <div className={styles.inputWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <span
                className={styles.eyeButton}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className={styles.validation}>
              <small>Please enter your current password.</small>
            </div>

            <button onClick={handleChangeEmail}>Save</button>
        </div>
      </div>
  );
};

export default ChangeEmail;