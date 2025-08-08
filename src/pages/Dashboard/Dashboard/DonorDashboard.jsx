import React from 'react';
import RecentDonations from './RecentDonations';
import useAuth from '../../../hooks/useAuth';

const DonorDashboard = () => {
    const {user} = useAuth();
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-red-600 mb-6">Welcome to Donor Dashboard '{user.displayName}'</h2>

            {/* Dashboard cards grid here */}

            {/* Recent Donations Section */}
            <RecentDonations />
        </div>
    );
};

export default DonorDashboard;