import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
    const isAuthenticated = localStorage.getItem('token'); 

    if (!isAuthenticated) {

        return <Navigate to="/" />;
    }

    return element;
};

export default ProtectedRoute;
