import React from 'react';
import { Navigate, useLocation } from 'react-router';
import useAuth from '../hooks/useAuth';
import BloodLoader from '../pages/loader/BloodLoader';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();


    if (loading) {
        return <BloodLoader></BloodLoader>
    }

    if (!user) {
        return <Navigate state={{ from: location.pathname }} to="/auth/login"></Navigate>
    }

    return children;
};

export default PrivateRoute;