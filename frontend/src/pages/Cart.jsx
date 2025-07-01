//React Hooks
import React from 'react';

//Custom Hooks
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useTokenValidation } from '../hooks/useTokenValidation';

//Components
import CustomerNav from '../components/CustomerNav';
import CartPage from '../components/CartPage';

const Cart = () => {

    useDocumentTitle('Cart')
    useTokenValidation(); // Only runs once on mount, checks and refreshes if near expiry

    return (
        <>
            <CustomerNav />
            <CartPage />
        </>
    );
};

export default Cart;