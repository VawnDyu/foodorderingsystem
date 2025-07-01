//React Hooks
import React from 'react';

//Custom Hooks
import { useTokenValidation } from '../hooks/useTokenValidation';
import { useDocumentTitle } from '../hooks/useDocumentTitle'


//Components
import CustomerNav from '../components/CustomerNav';
import CustomerOrderList from '../components/orderList';

const CustomerOrder = () => {

    useDocumentTitle('Order')
    useTokenValidation();

    return (
        <>
            <CustomerNav />
            <CustomerOrderList />
        </>
    );
};

export default CustomerOrder;