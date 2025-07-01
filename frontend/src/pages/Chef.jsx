//React Hooks
import React from 'react';

//Custom Hooks
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useTokenValidation } from '../hooks/useTokenValidation';

//Components
import ChefNav from '../components/ChefNav';
import ChefOrders from '../components/ChefOrders';

const Chef = () => {

    useDocumentTitle('Chef | Dashboard')
    useTokenValidation();

    return (
        <>
            <ChefNav />
            <ChefOrders />
        </>
    );
};

export default Chef;