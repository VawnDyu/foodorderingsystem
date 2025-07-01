import { Tab } from '@headlessui/react';
import { Fragment } from 'react';
import { FiBox, FiUser, FiClock } from 'react-icons/fi';
import styles from './Account.module.css';
import Orders from './MyOrder';
import Profile from '../components/Profile';
import ActivityLog from '../components/ActivityLog';

//Components
import CustomerNav from '../components/CustomerNav';

//Custom Hooks
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useTokenValidation } from '../hooks/useTokenValidation';


const tabs = [
  { name: 'Orders', icon: <FiBox size={18} /> },
  { name: 'Profile', icon: <FiUser size={18} /> },
  { name: 'Activity Log', icon: <FiClock size={18} /> },
];

const Account = () => {
 
    useTokenValidation(); // Only runs once on mount, checks and refreshes if near expiry
    useDocumentTitle('Account')

  return (
    <>
    <CustomerNav />
    <div className={styles.accountContainer}>
    <h1>Account Settings</h1>
      <Tab.Group>
        <Tab.List className={styles.tabList}>
          {tabs.map(({ name, icon }) => (
            <Tab as={Fragment} key={name}>
              {({ selected }) => (
                <button
                  className={`${styles.tabButton} ${
                    selected ? styles.tabButtonSelected : ''
                  }`}
                >
                  <div className={styles.icon}>{icon}</div>
                  <div>{name}</div>
                </button>
              )}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel className={styles.panel}>
            <Orders />
          </Tab.Panel>
          <Tab.Panel className={styles.panel}>
            <Profile />
          </Tab.Panel>
          <Tab.Panel className={styles.panel}>
            <ActivityLog />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
    </>
  );
}

export default Account;