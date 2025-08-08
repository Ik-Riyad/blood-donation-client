import React from 'react';
import { createBrowserRouter } from "react-router";
import MainLayouts from '../layouts/MainLayouts';
import Home from '../pages/home/Home/Home';
import AuthLayouts from '../layouts/AuthLayouts';
import Register from '../pages/authentication/Register/Register';
import Error from '../pages/Error/Error';
import Login from '../pages/authentication/Login/Login';
import PrivateRoute from '../routes/PrivateRoute';
import DashboardLayout from '../layouts/DashboardLayout';
import Profile from '../pages/Dashboard/Profile/Profile';
import MyDonation from '../pages/Dashboard/MyDonation/MyDonation';
import Dashboard from '../pages/Dashboard/Dashboard/Dashboard';
import CreateDonation from '../pages/Dashboard/CreateDonation/CreateDonation';
import AllUsers from '../pages/Dashboard/AllUsers/AllUsers';
import AllBloodDonation from '../pages/Dashboard/AllBloodDonation/AllBloodDonation';
import ContentManagement from '../pages/Dashboard/ContentManagement/ContentManagement';
import UpdateDonorDashboard from '../pages/Dashboard/Dashboard/UpdateDonorDashboard';
import AddBlog from '../pages/Dashboard/ContentManagement/AddBlog';
import EditBlog from '../pages/Dashboard/ContentManagement/EditBlog';
import Blogs from '../pages/Blogs/Blogs';
import SearchDonor from '../pages/home/Home/SearchDonor';
import DonationReq from '../pages/Donation/DonationReq';
import Funding from '../pages/Dashboard/Funding/Funding';
import DonationDetails from '../pages/Donation/DonationDetails';

export const Routes = createBrowserRouter([
    {
        path: "/",
        element: <MainLayouts />,
        children: [
            {
                index: true,
                Component: Home
            },
            {
                path: '/donation-req',
                Component: DonationReq
            },
            {
                path: 'donation-details/:id',
                element: <PrivateRoute>
                    <DonationDetails/>
                </PrivateRoute>
            },
            {
                path: '/blogs',
                Component: Blogs
            },
            {
                path: '/funding',
                element: <PrivateRoute>
                    <Funding/>
                </PrivateRoute>
            },
            {
                path: '/search-page',
                Component: SearchDonor
            }
        ]
    },
    {
        path: "/auth",
        element: <AuthLayouts />,
        children: [
            {
                index: true,
                Component: Register
            },
            {
                path: '/auth/login',
                Component: Login
            }
        ]
    },
    {
        path: '/dashboard',
        element: <PrivateRoute>
            <DashboardLayout></DashboardLayout>
        </PrivateRoute>,
        children: [
            {
                index: true,
                Component: Dashboard
            },
            {
                path: '/dashboard/profile',
                Component: Profile
            },
            {
                path: '/dashboard/my-donations',
                Component: MyDonation
            },
            {
                path: '/dashboard/create-donation',
                Component: CreateDonation
            },
            {
                path: '/dashboard/all-users',
                Component: AllUsers
            },
            {
                path: '/dashboard/all-donations',
                Component: AllBloodDonation
            },
            {
                path: '/dashboard/content-management',
                Component: ContentManagement
            },
            {
                path: '/dashboard/content-management/add-blog',
                Component: AddBlog
            },
            {
                path: '/dashboard/content-management/edit/:id',
                Component: EditBlog
            },
            {
                path: '/dashboard/update-donation/:id',
                Component: UpdateDonorDashboard
            }
        ]
    },
    {
        path: "/*",
        Component: Error
    }
]);