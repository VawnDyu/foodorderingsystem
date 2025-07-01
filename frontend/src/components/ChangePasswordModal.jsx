import { useState } from 'react';
import styles from './ChangePasswordModal.module.css';
import axios from '../api/axios';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Icon imports
import { RxLockClosed } from 'react-icons/rx';

const ChangePasswordModal = ({ isOpen, onClose }) => {
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
      // ✅ Close modal on success
      onClose();
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

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Change Password</h3>
        <div className={styles.inputWrapper}>
          <RxLockClosed className={styles.inputIcon} />
          <input
            type={showCurrentPassword ? 'text' : 'password'}
            placeholder="Current Password"
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

        <div className={styles.inputWrapper}>
          <RxLockClosed className={styles.inputIcon} />
          <input
            type={showNewPassword ? 'text' : 'password'}
            placeholder="New Password"
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

        <div className={styles.inputWrapper}>
          <RxLockClosed className={styles.inputIcon} />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm New Password"
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

        <div className={styles.actions}>
          <button onClick={handleChangePassword}>Save</button>
          <button onClick={onClose} className={styles.cancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
