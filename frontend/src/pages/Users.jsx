//React Hooks
import React from 'react';

//Custom Hooks
import { useTokenValidation } from '../hooks/useTokenValidation';
import { useDocumentTitle } from '../hooks/useDocumentTitle'

//Dashboard Components
import DashboardLayout from '../components/DashboardLayout';
import UsersPage from '../components/UsersPage';

const Users = () => {
    useDocumentTitle('Users')
    useTokenValidation(); // Only runs once on mount, checks and refreshes if near expiry

    return (
      <DashboardLayout>
        <UsersPage />
      </DashboardLayout>
    );
};

export default Users;