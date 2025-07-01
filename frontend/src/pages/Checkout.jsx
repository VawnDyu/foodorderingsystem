//React Hooks
import React from 'react';

//Custom Hooks
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useTokenValidation } from '../hooks/useTokenValidation';

//Components
import CustomerNav from '../components/CustomerNav';
import CheckoutPage from '../components/CheckoutPage';

const Checkout = () => {

    useDocumentTitle('Checkout')
    useTokenValidation(); // Only runs once on mount, checks and refreshes if near expiry

    return (
        <>
            <CustomerNav />
            <CheckoutPage />
        </>
    );
};

export default Checkout;