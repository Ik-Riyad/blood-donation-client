import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { FaUser, FaEnvelope, FaImage, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import loginLottie from '../../../assets/lotties/login.json'
import SocialLogin from '../SocialLogin/SocialLogin';
import Lottie from 'lottie-react';
import Navbar from '../../../components/Navbar/Navbar';
import BloodLoader from '../../loader/BloodLoader';
import useAuth from '../../../hooks/useAuth';
import Swal from 'sweetalert2';


const Login = () => {
    const { userLogIn } = useAuth();
    const [passToggle, setPassToggle] = useState(false);
    const { register, handleSubmit, formState: { errors }, } = useForm();
    const navigate = useNavigate();
    const from = location.state?.from || '/';

    const onSubmit = data => {
        console.log(data)
        userLogIn(data.email, data.password)
            .then(result => {
                console.log(result)
                navigate(from);
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "You Have Been Successfully Logged In.",
                    showConfirmButton: false,
                    timer: 1500
                });
            }).catch((error) => {
                console.log(error)
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: error,
                });
            })
    }
    return (
        <div>
            <Navbar></Navbar>
            <div className="w-full grid lg:grid-cols-2 justify-center items-center py-20 px-4 md:px-10 lg:px-50">

                {/* Left Section – Login Form */}
                <div className="hero-content flex-col lg:flex-row-reverse w-full">
                    <div className="card bg-white/80 w-full max-w-lg shrink-0 shadow-2xl">
                        <div className="card-body">
                            <h1 className="text-2xl sm:text-3xl font-bold text-center text-black">Please Login</h1>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                                {/* Email Field */}
                                <div className='space-y-1'>
                                    <label className="label text-black">Email</label>
                                    <div className="relative">
                                        <input
                                            {...register("email", { required: true })}
                                            type="email"
                                            className="input input-bordered w-full pl-10 text-black focus:outline-none focus:border-primary"
                                            placeholder="Your Email"
                                        />
                                        <FaEnvelope className="absolute left-3 top-[50%] -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
                                    </div>
                                    {errors.email?.type === 'required' && <p className="text-red-500 text-sm">Email is required</p>}
                                </div>

                                {/* Password Field */}
                                <div className='space-y-1'>
                                    <label className="label text-black">Password</label>
                                    <div className="relative">
                                        <input
                                            {...register("password", { required: true })}
                                            type={passToggle ? "text" : "password"}
                                            className="input input-bordered w-full px-10 text-black focus:outline-none focus:border-primary"
                                            placeholder="Password"
                                        />
                                        <FaLock className="absolute left-3 top-[50%] -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
                                        <button
                                            type="button"
                                            onClick={() => setPassToggle(!passToggle)}
                                            className="absolute right-3 top-[50%] -translate-y-1/2 text-gray-500 z-20 cursor-pointer"
                                        >
                                            {passToggle ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
                                        </button>
                                    </div>
                                    {errors.password?.type === 'required' && <p className="text-red-500 text-sm">Password is required</p>}
                                </div>

                                {/* Submit Button */}
                                <button className="btn btn-primary mt-3 w-full">Login</button>
                            </form>


                            {/* OR divider */}
                            <div className='grid grid-cols-3 items-center justify-center mt-6'>
                                <div className='border-b border-gray-400'></div>
                                <p className='text-sm font-medium text-gray-400 text-center'>or continue with</p>
                                <div className='border-b border-gray-400'></div>
                            </div>

                            {/* Google Button */}
                            {/* <SocialLogin /> */}

                            {/* Redirect to Register */}
                            <p className='pt-4 text-center text-sm text-gray-400'>
                                Don’t have an account?{' '}
                                <Link to='/register' className='text-primary underline'>Register</Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Section – Lottie Animation */}
                <div className="w-full flex justify-center items-center">
                    <Lottie style={{ width: "100%", maxWidth: "600px" }} animationData={loginLottie} loop={true} />
                </div>
            </div>
        </div>

    );
};

export default Login;