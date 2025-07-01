import { useState } from 'react';
import styles from './ChangeNicknameModal.module.css'; // You can rename this later
import axios from '../api/axios';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { RxLockClosed, RxEnvelopeClosed } from 'react-icons/rx'; // Envelope icon for email

const ChangeEmailModal = ({ isOpen, onClose }) => {
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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

      toast.success('Your email has been changed successfully.');
      onClose();
      setNewEmail('');
      setCurrentPassword('');
    } catch (err) {
      console.error('Email change error:', err);
      const msg = err.response?.data?.message || 'Failed to change email. Please try again.';
      toast.error(msg);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Change Email</h3>

        {/* Email Input */}
        <div className={styles.inputWrapper}>
          <RxEnvelopeClosed className={styles.inputIcon} />
          <input
            type="email"
            placeholder="New Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
        </div>

        {/* Current Password Input */}
        <div className={styles.inputWrapper}>
          <RxLockClosed className={styles.inputIcon} />
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

        <div className={styles.actions}>
          <button onClick={handleChangeEmail}>Save</button>
          <button onClick={onClose} className={styles.cancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ChangeEmailModal;
