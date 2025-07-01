//React Hooks
import React from 'react';

//Custom Hooks
import { useTokenValidation } from '../hooks/useTokenValidation';
import { useDocumentTitle } from '../hooks/useDocumentTitle'

//Dashboard Components
import DashboardLayout from '../components/DashboardLayout';
import MenuList from '../components/MenuList';

const Dashboard = () => {
    useDocumentTitle('Menu')
    useTokenValidation(); // Only runs once on mount, checks and refreshes if near expiry

    return (
      <DashboardLayout>
        <MenuList />
      </DashboardLayout>
    );
};

export default Dashboard;