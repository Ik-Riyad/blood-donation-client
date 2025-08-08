import React, { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router';
import useAuth from '../hooks/useAuth';
import { FaHome, FaUsers, FaPlus, FaClipboardList, FaEdit, FaCoins } from "react-icons/fa";
import logo from '../assets/logo/mainLogo.png';
import toast from 'react-hot-toast';
import { IoIosHome } from 'react-icons/io';
import useAxios from '../hooks/useAxios';
import useRole from '../hooks/useRole';

const DashboardLayout = () => {
    const { user, logOut } = useAuth();
    const { role } = useRole()
    // console.log(role)
    const authSecure = useAxios();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    // console.log('Your data is', userData)
    const handleLogOut = () => {
        logOut()
            .then(result => { console.log(result) })
            .catch(error => console.log(error))
    }
    useEffect(() => {
        authSecure.get(`/usersMatchByEmail?email=${user.email}`).then(res => {
            setUserData(res.data)
            setLoading(false)
        })
    }, [user])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-red-500"></span>
            </div>
        );
    }

    const adminLinks = <>
        <li>
            <NavLink
                to="/dashboard"
                className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-red-100 transition"
            >
                <FaHome />
                <span>Dashboard</span>
            </NavLink>
        </li>
        <li>
            <NavLink
                to="/dashboard/my-donations"
                className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-red-100 transition"
            >
                <FaClipboardList />
                <span>My Donation Requests</span>
            </NavLink>
        </li>
        <li>
            <NavLink
                to="/dashboard/create-donation"
                className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-red-100 transition"
            >
                <FaPlus />
                <span>Create Donation Request</span>
            </NavLink>
        </li>
        <li>
            <NavLink
                to="/dashboard/all-users"
                className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-red-100 transition"
            >
                <FaUsers />
                <span>All Users</span>
            </NavLink>
        </li>
        <li>
            <NavLink
                to="/dashboard/all-donations"
                className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-red-100 transition"
            >
                <FaClipboardList />
                <span>All Blood Donation Requests</span>
            </NavLink>
        </li>
        <li>
            <NavLink
                to="/dashboard/content-management"
                className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-red-100 transition"
            >
                <FaEdit />
                <span>Content Management</span>
            </NavLink>
        </li>
        <li>
            <NavLink
                to="/"
                className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-red-100 transition"
            >
                <FaHome />
                <span>Back to Home</span>
            </NavLink>
        </li>
    </>

    const volunteerLinks = <>
        <li>
            <NavLink
                to="/dashboard"
                className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-red-100 transition"
            >
                <FaHome />
                <span>Dashboard</span>
            </NavLink>
        </li>
        <li>
            <NavLink
                to="/dashboard/my-donations"
                className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-red-100 transition"
            >
                <FaClipboardList />
                <span>My Donation Requests</span>
            </NavLink>
        </li>
        <li>
            <NavLink
                to="/dashboard/create-donation"
                className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-red-100 transition"
            >
                <FaPlus />
                <span>Create Donation Request</span>
            </NavLink>
        </li>
        <li>
            <NavLink
                to="/dashboard/all-donations"
                className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-red-100 transition"
            >
                <FaClipboardList />
                <span>All Blood Donation Requests</span>
            </NavLink>
        </li>
        <li>
            <NavLink
                to="/dashboard/content-management"
                className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-red-100 transition"
            >
                <FaEdit />
                <span>Content Management</span>
            </NavLink>
        </li>
        <li>
            <NavLink
                to="/"
                className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-red-100 transition"
            >
                <FaHome />
                <span>Back to Home</span>
            </NavLink>
        </li>
    </>

    const donorLinks = <>
        <li>
            <NavLink
                to="/dashboard"
                className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-red-100 transition"
            >
                <FaHome />
                <span>Dashboard</span>
            </NavLink>
        </li>
        <li>
            <NavLink
                to="/dashboard/my-donations"
                className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-red-100 transition"
            >
                <FaClipboardList />
                <span>My Donation Requests</span>
            </NavLink>
        </li>
        <li>
            <NavLink
                to="/dashboard/create-donation"
                className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-red-100 transition"
            >
                <FaPlus />
                <span>Create Donation Request</span>
            </NavLink>
        </li>
        <li>
            <NavLink
                to="/"
                className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-red-100 transition"
            >
                <FaHome />
                <span>Back to Home</span>
            </NavLink>
        </li>
    </>
    return (

        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

            {/* Main content area */}
            <div className="drawer-content flex flex-col min-h-screen bg-white text-black z-10 relative">
                {/* Top navbar */}
                <div className="w-full flex justify-between items-center px-6 py-4 border-b border-gray-200 shadow-sm bg-white z-20">
                    {/* Mobile sidebar toggle */}
                    <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost lg:hidden">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="inline-block h-6 w-6 stroke-current"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            ></path>
                        </svg>
                    </label>

                    {/* Title */}
                    <h2 className="text-2xl font-bold">Your Role is {user && <span className=''>{userData.role}</span>}</h2>

                    {/* Right side: Notification + Avatar */}
                    <div className="flex items-center gap-4">
                        {/* Notification Icon */}
                        <div className="relative">
                            <button className="btn btn-ghost btn-circle">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                    />
                                </svg>
                                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
                            </button>
                        </div>

                        {/* Avatar Dropdown */}
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                    {
                                        user ? (
                                            <img src={user.photoURL} alt="User Avatar" />
                                        ) : (
                                            <img
                                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                                alt="User Avatar"
                                            />
                                        )
                                    }
                                </div>
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content mt-3 z-50 p-2 shadow bg-base-100 rounded-box w-52"
                            >
                                <li>
                                    <a href="/dashboard/profile">Profile</a>
                                </li>
                                <li>
                                    <button onClick={handleLogOut}>Logout</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <div className="p-6">
                    <Outlet />
                </div>
            </div>

            {/* Sidebar Drawer */}
            <div className="drawer-side z-50">
                <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
                <div className="menu w-72 bg-white text-black min-h-full p-4 border-r border-gray-200 space-y-4">
                    {/* Logo and Name */}
                    <Link to='/' className="flex items-center space-x-3 px-2 justify-center border-b border-red-200">
                        <img src={logo} alt="Company Logo" className="w-15 h-15" />
                        <span className="text-xl font-bold text-black">RedLife</span>
                    </Link>

                    {/* Light Primary Divider */}

                    {/* Navigation Links */}
                    <ul className="space-y-2 text-base">

                        {role === 'admin' ? (
                            adminLinks
                        ) : role === 'volunteer' ? (
                            volunteerLinks
                        ) : role === 'donor' ? (
                            donorLinks
                        ) : (
                            <p className="text-sm text-gray-400">No role Assigned</p>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
