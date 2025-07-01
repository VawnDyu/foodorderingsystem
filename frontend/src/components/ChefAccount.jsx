import React from 'react';
import { Tab } from '@headlessui/react';
import styles from './CashierAccount.module.css';

import ChefNav from './ChefNav';

import ChangeAvatar from '../tabs/ChangeAvatar';
import ChangeNickname from '../tabs/ChangeNickname';
import ChangePassword from '../tabs/ChangePassword';
import ChangeEmail from '../tabs/ChangeEmail';

//Custom Hooks
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useTokenValidation } from '../hooks/useTokenValidation';

import { FaUserCircle, FaUserEdit, FaLock, FaEnvelope } from 'react-icons/fa';

const tabs = [
  { label: 'Change Avatar', icon: <FaUserCircle /> },
  { label: 'Change Nickname', icon: <FaUserEdit /> },
  { label: 'Change Password', icon: <FaLock /> },
  { label: 'Change Email', icon: <FaEnvelope /> },
];

const ChefAccount = () => {
      useDocumentTitle('Chef | Account')
      useTokenValidation();
  return (
    <>
      <ChefNav />
      <div className={styles.container}>
        <Tab.Group vertical>
          <div className={styles.wrapper}>
            {/* Sidebar */}
            <Tab.List className={styles.sidebar}>
              {tabs.map((tab, index) => (
                <Tab key={index}>
                  {({ selected }) => (
                    <div
                      className={`${styles.tabButton} ${selected ? styles.tabSelected : ''}`}
                    >
                      <span className={styles.tabIcon}>{tab.icon}</span>
                      <span>{tab.label}</span>
                    </div>
                  )}
                </Tab>
              ))}
            </Tab.List>

            {/* Panels */}
            <Tab.Panels className={styles.content}>
              <Tab.Panel><ChangeAvatar /></Tab.Panel>
              <Tab.Panel><ChangeNickname /></Tab.Panel>
              <Tab.Panel><ChangePassword /></Tab.Panel>
              <Tab.Panel><ChangeEmail /></Tab.Panel>
            </Tab.Panels>
          </div>
        </Tab.Group>
      </div>
    </>
  );
};

export default ChefAccount;
