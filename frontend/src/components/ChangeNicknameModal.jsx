import { useState } from 'react';
import styles from './ChangeNicknameModal.module.css';
import axios from '../api/axios';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Icon imports
import { RxLockClosed, RxPerson } from 'react-icons/rx'; // Icons for password and nickname
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice'; // adjust path if needed

const ChangeNicknameModal = ({ isOpen, onClose }) => {
  const user = useSelector((state) => state.user.user);
  const [nickname, setNickname] = useState(''); // State to hold the new nickname
  const [currentPassword, setCurrentPassword] = useState(''); // State to hold the current password
  const [showPassword, setShowPassword] = useState(false); // For toggling current password visibility
  const dispatch = useDispatch();

  // Nickname validation using regex: allows letters, spaces, apostrophes, and hyphens
  const isValidNickname = (nickname) => /^[A-Za-z\s'-]+$/.test(nickname);

  const handleChangeNickname = async () => {
    
    // 🔍 Client-side validations
    if (!currentPassword || !nickname) {
      toast.error('Please enter both your current password and a new nickname.');
      return;
    }

    if (!isValidNickname(nickname)) {
      toast.error('Nickname can only contain letters, spaces, apostrophes, and hyphens.');
      return;
    }

    try {
      const res = await axios.patch('/user/nickname', {
        nickname,
        currentPassword,
      }, {
        withCredentials: true,
      });

      // ✅ Update Redux
      dispatch(setUser({ ...user, nickname: nickname }));
      toast.success('Your nickname has been changed successfully.');
      // ✅ Close modal on success
      onClose();
      // Optionally reset fields
      setNickname('');
      setCurrentPassword('');
    } catch (err) {
      console.error('Nickname change error:', err);
      const msg = err.response?.data?.message || 'Failed to change nickname. Please try again.';
      toast.error(msg);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Change Nickname</h3>

        {/* Nickname Input */}
        <div className={styles.inputWrapper}>
          <RxPerson className={styles.inputIcon} />
          <input
            type="text"
            placeholder="New Nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
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
          <button onClick={handleChangeNickname}>Save</button>
          <button onClick={onClose} className={styles.cancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ChangeNicknameModal;
