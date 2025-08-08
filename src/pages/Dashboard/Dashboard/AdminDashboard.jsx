import React, { useEffect, useState } from 'react';
import { FaUsers, FaDonate, FaClipboardList } from "react-icons/fa";
import useAxios from '../../../hooks/useAxios';
import useAuth from '../../../hooks/useAuth';

const AdminDashboard = () => {
    const axiosSecure = useAxios();
    const { user: firebaseUser } = useAuth(); // get Firebase user
    const [donorData, setDonorData] = useState([]);
    const [userData, setUserData] = useState(null); // to store name from DB

    // Fetch all users (for count)
    useEffect(() => {
        axiosSecure.get('/users')
            .then(res => {
                setDonorData(res.data);
            })
            .catch(err => {
                console.error("Failed to fetch users:", err);
            });
    }, [axiosSecure]);

    // Fetch current user data
    useEffect(() => {
        if (firebaseUser?.email) {
            axiosSecure.get(`/usersMatchByEmail?email=${firebaseUser.email}`)
                .then(res => {
                    setUserData(res.data);
                })
                .catch(err => {
                    console.error("Failed to fetch user data:", err);
                });
        }
    }, [firebaseUser, axiosSecure]);

    return (
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 min-h-screen">
            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    Welcome back, <span className="text-red-600">{userData?.name || "Admin"}</span> 👋
                </h1>
                <p className="text-gray-500 mt-1">Here’s what’s happening in your dashboard today.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Total Donors */}
                <div className="bg-white rounded-lg shadow p-6 flex items-center space-x-4">
                    <div className="p-4 rounded-full bg-red-100 text-red-600">
                        <FaUsers className="text-3xl" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase">Total Donors</p>
                        <p className="text-3xl font-bold text-gray-900">{donorData.length}</p>
                    </div>
                </div>

                {/* Total Funding */}
                <div className="bg-white rounded-lg shadow p-6 flex items-center space-x-4">
                    <div className="p-4 rounded-full bg-red-100 text-red-600">
                        <FaDonate className="text-3xl" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase">Total Funding (USD)</p>
                        <p className="text-3xl font-bold text-gray-900">$8,450</p>
                    </div>
                </div>

                {/* Total Blood Donation Requests */}
                <div className="bg-white rounded-lg shadow p-6 flex items-center space-x-4">
                    <div className="p-4 rounded-full bg-red-100 text-red-600">
                        <FaClipboardList className="text-3xl" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase">Total Blood Donation Requests</p>
                        <p className="text-3xl font-bold text-gray-900">23</p>
                    </div>
                </div>
            </div>

            {/* Donation Requests Table (empty structure for now) */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Blood Donation Requests</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requester</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Group</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>
        </main>
    );
};

export default AdminDashboard;
