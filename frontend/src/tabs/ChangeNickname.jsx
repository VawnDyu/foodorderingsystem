// ./tabs/ChangeAvatar.jsx
import React, { useState } from 'react';

import styles from './ChangeNickname.module.css';

import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice'; // adjust path if needed

import axios from '../api/axios';

import { toast } from 'react-toastify';

import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Icon imports

const ChangeNickname = () => {
  const [nickname, setNickname] = useState(''); // State to hold the new nickname
  const [currentPassword, setCurrentPassword] = useState(''); // State to hold the current password
  const user = useSelector((state) => state.user.user);
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

      // Optionally reset fields
      setNickname('');
      setCurrentPassword('');
    } catch (err) {
      console.error('Nickname change error:', err);
      const msg = err.response?.data?.message || 'Failed to change nickname. Please try again.';
      toast.error(msg);
    }
  };

  return (
    <div className={styles.container}>

      <div className={styles.form}>
        <div className={styles.header}>
          <h2>Change Nickname</h2>
          <p className={styles.nickname}>Nickname: {user.nickname}</p>
        </div>
        <p>New Nickname</p>
        <div className={styles.inputWrapper}>
        <input
          type="text"
          placeholder="Enter here..."
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
      </div>
      <div className={styles.validation}>
        <small>Can only contain letters, spaces, apostrophes, and hyphens.</small>
      </div>
      <p>Confirm Password</p>
      <div className={styles.inputWrapper}>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter here..."
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
        <button onClick={handleChangeNickname}>Save</button>
      </div>
    </div>
  );
};

export default ChangeNickname;