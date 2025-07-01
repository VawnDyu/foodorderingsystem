// ./tabs/ChangeAvatar.jsx
import React, { useState } from 'react';
import styles from './ChangeAvatar.module.css';

import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';

import Modal from '../components/Modal';
import ProfileImageSelector from '../components/ProfileImageSelector';

import axios from '../api/axios';
import { toast } from 'react-toastify';

import {FaEnvelope, FaPhone} from 'react-icons/fa'

const ChangeAvatar = () => {
  const basePath = "/src/assets/profile-images/";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  const imageSrc = user?.imgSrc ? `${basePath}${user.imgSrc}` : `${basePath}avatar1.png`;

  const handleImageSelect = async (imageId) => {
    const newImgSrc = `${imageId}.png`;

    try {
      const res = await axios.patch('/user/avatar', { imgSrc: newImgSrc }, { withCredentials: true });
      dispatch(setUser({ ...user, imgSrc: newImgSrc }));
      toast.success('Your profile picture has been updated.');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Avatar update failed:', error);
      toast.error('Failed to update your profile picture. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <div className={styles.imageWrapper} onClick={() => setIsModalOpen(true)}>
          <img src={imageSrc} alt="Profile" className={styles.profileImage} />
          <p className={styles.imgText}>Change Avatar</p>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoRow}>
            <p className={styles.nickname}>{user.nickname}</p>
          </div>
          <div className={styles.infoRow}>
            <p className={styles.username}>{user.username}</p>
          </div>
          <div className={styles.infoRow}>
            <p className={styles.email}><FaEnvelope size={16}/>{user.email}</p>
          </div>
          <div className={styles.infoRow}>
            <p className={styles.contact}><FaPhone size={16}/>63+ 912 345 678</p>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h4>Select Avatar</h4>
        <ProfileImageSelector onSelectImage={handleImageSelect} />
      </Modal>
    </div>
  );
};

export default ChangeAvatar;
