// ./tabs/ChangeAvatar.jsx
import React, {useState} from 'react';

import styles from './ChangePassword.module.css';

import axios from '../api/axios';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Icon imports
import { RxLockClosed } from 'react-icons/rx';

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false); // For toggling current password visibility
    const [showNewPassword, setShowNewPassword] = useState(false); // For toggling new password visibility
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // For toggling confirm password visibility

    const isStrongPassword = (password) =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);

  const handleChangePassword = async () => {
    // 🔍 Client-side validations
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all fields.');
      return;
    }

    // Check password strength
    if (!isStrongPassword(newPassword)) {
      toast.error('New password must be at least 8 characters long, include letters & numbers.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      const res = await axios.patch('/user/password', {
        currentPassword,
        newPassword,
      }, {
        withCredentials: true,
      }
    );

      toast.success('Your password has been changed successfully.');

      // Optionally reset fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Password change error:', err);
      const msg = err.response?.data?.message || 'Failed to change password. Please try again.';
      toast.error(msg);
    }
  };

  return (
    <div className={styles.container}>
        <div className={styles.form}>
          <div className={styles.header}>
              <h2>Change Password</h2>
          </div>

          <p>Current Password</p>
          <div className={styles.inputWrapper}>
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              placeholder="Enter here..."
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <span
              className={styles.eyeButton}
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
        </div>

        <div className={styles.validation}>
          <small>Please enter your current password.</small>
        </div>

        <p>New Password</p>
        <div className={styles.inputWrapper}>
          <input
            type={showNewPassword ? 'text' : 'password'}
            placeholder="Enter here..."
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <span
            className={styles.eyeButton}
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className={styles.validation}>
          <small>Must be at least 8 characters long, include letters & numbers.</small>
        </div>

        <p>Confirm New Password</p>
        <div className={styles.inputWrapper}>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Enter here..."
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <span
            className={styles.eyeButton}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className={styles.validation}>
          <small>New Password and Confirm New Password must be match</small>
        </div>

        <button onClick={handleChangePassword}>Save</button>
      </div>
    </div>
  );
};

export default ChangePassword;