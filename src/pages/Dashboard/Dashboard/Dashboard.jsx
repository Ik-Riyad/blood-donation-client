import React, { useEffect, useState } from 'react';
import useAxios from '../../../hooks/useAxios';
import useAuth from '../../../hooks/useAuth';
import AdminDashboard from './AdminDashboard';
import DonorDashboard from './DonorDashboard';

const Dashboard = () => {
    const axiosSecure = useAxios();
    const { user } = useAuth();
    // const [donorData, setDonorData] = useState([]);
    const [userData, setUserData] = useState();
    const [dataLoding, setDataLoading] = useState(true);
    console.log(userData)
    // useEffect(() => {
    //     axiosSecure.get('/users')
    //         .then(res => {
    //             setDonorData(res.data);
    //             setDataLoading(false);
    //         })
    //         .catch(err => {
    //             console.error("Failed to load user data:", err);
    //             setDataLoading(false); // stop loading even if error
    //         });
    // }, [axiosSecure]);

    // useEffect(() => {
    //     if (donorData.length && user?.email) {
    //         const userAuth = donorData.find(e => e.email === user.email);
    //         setUserData(userAuth?.role)
    //         console.log(userAuth?.role);
    //     }
    // }, [donorData, user]);

    useEffect(() => {
        if (user?.email) {
            axiosSecure.get(`/usersMatchByEmail?email=${user.email}`)
                .then(res => {
                    setUserData(res.data.role);
                    console.log(res.data.role)
                    setDataLoading(false);
                })
                .catch(err => {
                    console.error("Failed to load user data:", err);
                    setDataLoading(false);
                });
        }
    }, [user, axiosSecure]);

    if (dataLoding) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-red-500"></span>
            </div>
        );
    }

    return (
        <div>
            {
                (userData === 'admin' || userData === 'volunteer') ? <AdminDashboard /> :
                    userData === 'donor' ? <DonorDashboard /> :
                        <p>No role assigned</p>
            }
        </div>
    );
};

export default Dashboard;
