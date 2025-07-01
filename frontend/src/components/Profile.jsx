//React Hooks
import { useState } from 'react';

//Components
import ChangePasswordModal from './ChangePasswordModal';
import ChangeNicknameModal from './ChangeNicknameModal';
import ChangeEmailModal from './ChangeEmailModal';
import Modal from './Modal';
import ProfileImageSelector from './ProfileImageSelector';

//Stylesheet
import styles from './Profile.module.css'; // optional for styling

//API
import axios from '../api/axios';

//Redux
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice'; // adjust path if needed

//React Icon
import { FaUserEdit, FaKey, FaEnvelope } from 'react-icons/fa';

//React Toastify
import { toast } from 'react-toastify';


const Profile = () => {
  const basePath = "/src/assets/profile-images/"; // base path for avatars

  const user = useSelector((state) => state.user.user);
  const imageSrc = user?.imgSrc ? `${basePath}${user.imgSrc}` : `${basePath}avatar1.png`; // Default to avatar1.png if imgSrc is missing
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const nickname = user.nickname; // can come from backend
  const dispatch = useDispatch();

  const handleImageSelect = async (imageId) => {
    const newImgSrc = `${imageId}.png`;

    try {
      const res = await axios.patch('/user/avatar', 
        { imgSrc: newImgSrc },
        {
          withCredentials: true,
        }
      );
  
      // ✅ Update Redux
      dispatch(setUser({ ...user, imgSrc: newImgSrc }));
  
      toast.success('Your profile picture has been updated.');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Avatar update failed:', error);
      toast.error('Failed to update your profile picture. Please try again.');
      // Show error to user if needed
    }
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.imageWrapper} onClick={() => setIsModalOpen(true)}>
        <img
          src={imageSrc}
          alt="Profile"
          className={styles.profileImage}
        />
      </div>

      <p className={styles.nickname}>{nickname}</p>

      <div className={styles.updateBtnsContainer}>
        <p className={styles.updateTitle}>⚙ Update Info</p>
        <div className={styles.updateBtns}>
          <button onClick={() => setIsNicknameModalOpen(true)}><FaUserEdit/>Nickname</button>
          <button onClick={() => setIsPasswordModalOpen(true)}><FaKey/>Password</button>
          <button onClick={() => setIsEmailModalOpen(true)}><FaEnvelope/>Email</button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h4>Select Avatar</h4>
        <ProfileImageSelector onSelectImage={handleImageSelect} />
      </Modal>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />

      <ChangeNicknameModal
        isOpen={isNicknameModalOpen}
        onClose={() => setIsNicknameModalOpen(false)}
      />

      <ChangeEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
      />

    </div>
  );
}

export default Profile;