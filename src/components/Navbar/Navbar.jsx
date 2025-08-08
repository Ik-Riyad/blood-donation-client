import React from 'react';
import { Link, NavLink } from 'react-router';
import mainLogo from '../../assets/logo/mainLogo.png';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
    const { user, logOut } = useAuth();

    const handleLogOut = () => {
        logOut()
            .then(result => { console.log(result) })
            .catch(error => console.log(error))
    }
    const navItems = <>
        <li>
            <NavLink
                to="/" className="inline-block text-gray-500 transition-all ease-in-out hover:text-[#C6414C]  hover:scale-110">
                Home
            </NavLink>

        </li>
        <li>
            <NavLink
                to="/donation-req" className="inline-block text-gray-500 transition-all  ease-in-out hover:text-[#C6414C]  hover:scale-110">
                Donation Requests
            </NavLink>

        </li>
        <li>

            <NavLink to='/blogs' className="inline-block text-gray-500 transition-all  ease-in-out hover:text-[#C6414C]  hover:scale-110" >
                Blog
            </NavLink>
        </li>
        {
            user && <li>
                <NavLink to='/funding' className="inline-block text-gray-500 transition-all  ease-in-out hover:text-[#C6414C]  hover:scale-110" >
                    Funding
                </NavLink>
            </li>
        }

    </>

    return (
        <header className="bg-white shadow">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">

                    {/* Left: Logo */}
                    <Link to="/">
                        <img className="w-24" src={mainLogo} alt="Logo" />
                    </Link>

                    {/* Right: Mobile Menu (visible only on small screen) */}
                    <div className="dropdown dropdown-end md:hidden">
                        <div tabIndex={0} role="button" className="btn btn-ghost">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </div>

                        {/* Mobile Dropdown: navItems + Avatar */}
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[100] p-2 shadow bg-base-100 rounded-box w-52 space-y-1">
                            {/* Avatar Dropdown (inside mobile menu) */}
                            <li>
                                <details>
                                    <summary>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 rounded-full overflow-hidden">
                                                <img
                                                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2080&auto=format&fit=crop"
                                                    alt="User"
                                                />
                                            </div>
                                            <span>Profile</span>
                                        </div>
                                    </summary>
                                    {
                                        user ? <ul className="p-2">
                                            <li><Link to="/dashboard">Dashboard</Link></li>
                                            <li><button
                                                className="rounded-md bg-gradient-to-r from-red-500 to-red-400 px-5 py-2.5 text-sm font-medium text-white shadow hover:brightness-110 hover:scale-105 transition duration-300 cursor-pointer"
                                                onClick={handleLogOut}>Logout</button></li>
                                        </ul> : <Link to='/login'>Please Login</Link>
                                    }
                                </details>
                            </li>
                            <div className="divider my-1"></div>
                            {navItems}

                        </ul>
                    </div>

                    {/* Right: Desktop Nav + Auth + Avatar */}
                    <div className="hidden md:flex items-center gap-6">

                        {/* Nav Menu */}
                        <nav>
                            <ul className="flex items-center gap-6 text-sm">
                                {navItems}
                            </ul>
                        </nav>

                        {/* Auth Buttons */}
                        {
                            !user && <div className="hidden sm:flex items-center gap-4">
                                <Link
                                    to="/auth/login"
                                    className="rounded-md bg-gradient-to-r from-red-400 to-red-500 px-5 py-2.5 text-sm font-medium text-white shadow hover:brightness-110 hover:scale-105 transition duration-300"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/auth"
                                    className="rounded-md bg-gray-200 px-5 py-2.5 text-sm font-medium text-primary hover:bg-gray-300 hover:scale-105 transition duration-300"
                                >
                                    Register
                                </Link>
                            </div>
                        }

                        {/* Avatar Dropdown (Desktop only) */}
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                    {
                                        user ? <img
                                            alt="Tailwind CSS Navbar component"
                                            src={user.photoURL} /> : <img
                                            alt="User avatar"
                                            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2080&auto=format&fit=crop"
                                        />
                                    }
                                </div>
                            </div>
                            <ul
                                tabIndex={0}
                                className="mt-3 z-[100] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
                            >
                                {
                                    user ? <>
                                        <li><Link to="/dashboard">Dashboard</Link></li>
                                        <li><button
                                            className="rounded-md mt-3 bg-gradient-to-r from-red-500 to-red-400 px-5 py-2.5 text-white shadow hover:brightness-110 hover:scale-105 transition duration-300 cursor-pointer"
                                            onClick={handleLogOut}>Logout</button></li>
                                    </> : <Link to='/auth/login'>Please Login</Link>
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;