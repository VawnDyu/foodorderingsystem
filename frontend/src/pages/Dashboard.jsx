//React Hooks
import React from 'react';

//Custom Hooks
import { useTokenValidation } from '../hooks/useTokenValidation';
import { useDocumentTitle } from '../hooks/useDocumentTitle'

//Dashboard Components
import DashboardLayout from '../components/DashboardLayout';
import DashboardCards from '../components/DashboardCards';

const Dashboard = () => {

    useDocumentTitle('Dashboard')
    useTokenValidation(); // Only runs once on mount, checks and refreshes if near expiry

    return (
      <DashboardLayout>
        <DashboardCards />
      </DashboardLayout>
    );
};

export default Dashboard;