//React Hooks
import React from 'react';

//Custom Hooks
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useTokenValidation } from '../hooks/useTokenValidation';

//Components
import CashierNav from '../components/CashierNav';
import CashierOrders from '../components/CashierOrders';

const Cashier = () => {

    useDocumentTitle('Cashier | Dashboard')
    useTokenValidation();

    return (
        <>
            <CashierNav />
            <CashierOrders/>
        </>
    );
};

export default Cashier;