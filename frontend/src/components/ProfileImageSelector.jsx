import avatar1 from '../assets/profile-images/avatar1.png';
import avatar2 from '../assets/profile-images/avatar2.png';
import avatar3 from '../assets/profile-images/avatar3.png';
import avatar4 from '../assets/profile-images/avatar4.png';
import avatar5 from '../assets/profile-images/avatar5.png';
import avatar6 from '../assets/profile-images/avatar6.png';
import avatar7 from '../assets/profile-images/avatar7.png';
import avatar8 from '../assets/profile-images/avatar8.png';
import avatar9 from '../assets/profile-images/avatar9.png';
import avatar10 from '../assets/profile-images/avatar10.png';
import styles from './ProfileImageSelector.module.css';

const avatars = [
  { id: 'avatar1', src: avatar1 },
  { id: 'avatar2', src: avatar2 },
  { id: 'avatar3', src: avatar3 },
  { id: 'avatar4', src: avatar4 },
  { id: 'avatar5', src: avatar5 },
  { id: 'avatar6', src: avatar6 },
  { id: 'avatar7', src: avatar7 },
  { id: 'avatar8', src: avatar8 },
  { id: 'avatar9', src: avatar9 },
  { id: 'avatar10', src: avatar10 },
];

export default function ProfileImageSelector({ onSelectImage }) {
  return (
    <div className={styles.selectorGrid}>
      {avatars.map((avatar) => (
        <button
          key={avatar.id}
          onClick={() => onSelectImage(avatar.id)}
          className={styles.avatarButton}
        >
          <img src={avatar.src} alt={avatar.id} className={styles.avatarImage} />
        </button>
      ))}
    </div>
  );
}
