import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';

const MainLayouts = () => {
    return (
        <>
            <section className='sticky top-0'>
                <Navbar />
            </section>
            <Outlet />
            <Footer />
        </>
    );
};

export default MainLayouts;