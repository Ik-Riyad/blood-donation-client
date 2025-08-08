import React from 'react';
import error404 from '../../assets/banner/banner5.jpg';
import { Link } from 'react-router';
import { FaHouse } from 'react-icons/fa6';

const Error = () => {
    return (
        <div className='relative h-screen bg-no-repeat bg-center bg-cover bg-green-400 flex items-center justify-center' style={{ backgroundImage: `url(${error404})` }}>
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className='text-center w-6/12 text-white z-10'>
                <h1 className='text-9xl lg:text-[200px] font-bold '>404</h1>
                <h1 className='text-6xl font-bold py-5'>P&nbsp;A&nbsp;G&nbsp;E&nbsp;&nbsp; N&nbsp;O&nbsp;T&nbsp;&nbsp; F&nbsp;O&nbsp;U&nbsp;N&nbsp;D</h1>
                <p className='text-xl font-light'>We're sorry, but we can't find the page you were looking for. It's probably
                    some thing we've done wrong but now we know about it and we'll try to fix it.
                    In the meantime, try one of these options:</p>

                <div className='flex justify-center items-center gap-10 mt-5'>
                    <Link to='/' className='btn bg-white text-primary px-10 py-6'><FaHouse size={15} />Go Home</Link>
                </div>
            </div>

        </div>
    );
};

export default Error;