import React, { use, useEffect, useState } from 'react';
import { FaUser, FaEnvelope, FaImage, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Navbar from '../../../components/Navbar/Navbar';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import registerLottie from '../../../assets/lotties/register.json'
import Lottie from 'lottie-react';
import { Link, useNavigate } from 'react-router';
import useAuth from '../../../hooks/useAuth';
import axios from 'axios';
import useAxios from '../../../hooks/useAxios';

const Register = () => {
    const { createUser, updateUser, setUser } = useAuth();
    const axiosSecure = useAxios();
    const { register, handleSubmit, watch, formState: { errors }, } = useForm();
    const navigate = useNavigate();
    const from = location.state?.from || '/';
    const [passToggle, setPassToggle] = useState(false);
    const [confirmToggle, setConfirmToggle] = useState(false);
    const [districts, setDistricts] = useState([]);
    const [upazilas, setUpazilas] = useState([]);
    const [loading, setLoading] = useState(true);
    const password = watch("password"); // to watch password value
    const selectedDistrictId = watch("districtId");

    // useEffect(() => {
    //     axiosSecure.get("/districts").then((res) => setDistricts(res.data));
    //     axiosSecure.get("/upazilas").then((res) => setUpazilas(res.data));
    // }, [axiosSecure]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [districtRes, upazilaRes] = await Promise.all([
                    axiosSecure.get("/districts"),
                    axiosSecure.get("/upazilas"),
                ]);
                setDistricts(districtRes.data);
                setUpazilas(upazilaRes.data);
            } catch (error) {
                console.error("Failed to load districts or upazilas", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [axiosSecure]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-red-500"></span>
            </div>
        );
    }

    const filteredUpazilas = selectedDistrictId
        ? upazilas.filter(u => u.district_id === selectedDistrictId)
        : [];

    const onSubmit = (data) => {
        createUser(data.email, data.password)
            .then(result => {
                const user = result.user;
                updateUser({ displayName: data.name, photoURL: data.image })

                    .then(() => {
                        setUser({ ...user, displayName: data.name, photoURL: data.image })
                    }).catch(error => {
                        console.log(error)
                    })

                // Find selected district and upazila names
                const selectedDistrict = districts.find(d => d.id === data.districtId);
                const selectedUpazila = upazilas.find(u => u.id === data.upazilaId);

                // Prepare data to send
                const finalData = {
                    ...data,
                    district: selectedDistrict?.name || '',
                    upazila: selectedUpazila?.name || '',
                    role: "donor",     // make sure 'donor' and 'active' are defined
                    status: "active"
                };

                // Remove unnecessary fields
                delete finalData.districtId;
                delete finalData.upazilaId;
                delete finalData.password;
                delete finalData.confirmPassword;

                console.log("Submitted:", finalData);

                // Send to your server
                axiosSecure.post("/users", finalData)
                    .then(res => {
                        console.log("User Registered in DB:", res.data);

                        const data = res.data;
                        if (data.insertedId) {
                            console.log(data)
                            navigate(from);
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                title: "You Have Registered Successfully",
                                showConfirmButton: false,
                                timer: 1500
                            });
                        }

                    })
                    .catch(err => {
                        console.error("Registration error:", err);
                    });

            })
            .catch((error) => {
                console.log("Firebase Error:", error);
            });
    };


    return (
        <>
            <Navbar></Navbar>
            <div>
                <div className='w-full grid lg:grid-cols-2 justify-center items-center py-15 px-4 md:px-10 lg:px-20'>
                    {/* Left Section */}

                    <div className='w-full flex justify-center'>
                        <Lottie style={{ width: "100%", maxWidth: "500px" }} animationData={registerLottie} loop={true} />
                    </div>

                    {/* Right Section */}
                    <div className="hero-content flex-col lg:flex-row-reverse">
                        <div className="card bg-white/80 w-full max-w-lg shrink-0 shadow-2xl">
                            <div className="card-body">
                                <h1 className='text-2xl sm:text-3xl font-bold text-center text-black'>Please Register</h1>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                                    {/* Name Field */}
                                    <div className='space-y-1'>
                                        <label className="label text-black">Name</label>
                                        <div className="relative h-12">
                                            <input
                                                {...register("name", { required: true })}
                                                type="text"
                                                className="input input-bordered w-full pl-10 text-black focus:outline-none focus:border-primary"
                                                placeholder="Your Name"
                                            />
                                            <FaUser className="absolute left-3 top-[42%] -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
                                        </div>
                                        {errors.name?.type === 'required' && <p className="text-red-500 text-sm">Name is required</p>}
                                    </div>

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

                                    {/* Image Field */}
                                    <div className="space-y-1">
                                        <label className="label text-black">Image URL</label>
                                        <div className="relative">
                                            <input
                                                {...register("image", { required: true })}
                                                type="text"
                                                className="input input-bordered w-full pl-10 text-black focus:outline-none focus:border-primary"
                                                placeholder="Profile Image URL"
                                            />
                                            <FaImage className="absolute left-3 top-[50%] -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
                                        </div>
                                        {errors.image?.type === 'required' && <p className="text-red-500 text-sm">Image URL is required</p>}
                                    </div>

                                    {/* Blood Group Field */}
                                    <div className="space-y-1">
                                        <label className="label text-black">Blood Group</label>
                                        <select
                                            {...register("bloodGroup", { required: true })}
                                            className="select select-bordered w-full text-black focus:outline-none focus:border-primary"
                                        >
                                            <option value="">Select Blood Group</option>
                                            <option value="A+">A+</option>
                                            <option value="A-">A-</option>
                                            <option value="B+">B+</option>
                                            <option value="B-">B-</option>
                                            <option value="AB+">AB+</option>
                                            <option value="AB-">AB-</option>
                                            <option value="O+">O+</option>
                                            <option value="O-">O-</option>
                                        </select>
                                        {errors.bloodGroup?.type === 'required' && <p className="text-red-500 text-sm">Blood group is required</p>}
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-4">
                                        {/* District Dropdown */}
                                        <div className="w-full md:w-1/2">
                                            <label className="block mb-1 text-black">District</label>
                                            <select
                                                {...register("districtId", { required: true })}
                                                className="select select-bordered w-full text-black focus:outline-none focus:border-primary"
                                            >
                                                <option value="">Select a district</option>
                                                {districts.map((district) => (
                                                    <option key={district.id} value={district.id}>
                                                        {district.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.districtId && (
                                                <p className="text-red-500 text-sm">District is required</p>
                                            )}
                                        </div>

                                        {/* Upazila Dropdown */}
                                        <div className="w-full md:w-1/2">
                                            <label className="block mb-1 text-black">Upazila</label>
                                            <select
                                                {...register("upazilaId", { required: true })}
                                                className="select select-bordered w-full text-black focus:outline-none focus:border-primary"
                                            >
                                                <option value="">Select an upazila</option>
                                                {filteredUpazilas.map((upazila) => (
                                                    <option key={upazila.id} value={upazila.id}>
                                                        {upazila.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.upazilaId && (
                                                <p className="text-red-500 text-sm">Upazila is required</p>
                                            )}
                                        </div>
                                    </div>


                                    {/* Password Field */}
                                    <div className='space-y-1'>
                                        <label className="label text-black">Password</label>
                                        <div className="relative">
                                            <input
                                                {...register("password", { required: true, pattern: { value: /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/ } })}
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
                                        {errors.password?.type === 'pattern' && <p className="text-red-500 text-sm">Must contain uppercase, lowercase, and at least 6 characters</p>}
                                    </div>

                                    {/* Confirm Password Field */}
                                    <div className='space-y-1'>
                                        <label className="label text-black">Confirm Password</label>
                                        <div className="relative">
                                            <input
                                                {...register("confirmPassword", {
                                                    required: true,
                                                    validate: (value) =>
                                                        value === password || "Passwords do not match",
                                                })}
                                                type={confirmToggle ? "text" : "password"}
                                                className="input input-bordered w-full px-10 text-black focus:outline-none focus:border-primary"
                                                placeholder="Confirm Password"
                                            />
                                            <FaLock className="absolute left-3 top-[50%] -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
                                            <button
                                                type="button"
                                                onClick={() => setConfirmToggle(!confirmToggle)}
                                                className="absolute right-3 top-[50%] -translate-y-1/2 text-gray-500 z-20 cursor-pointer"
                                            >
                                                {confirmToggle ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
                                            </button>
                                        </div>
                                        {errors.confirmPassword?.type === "required" && (
                                            <p className="text-red-500 text-sm">Confirm Password is required</p>
                                        )}
                                        {errors.confirmPassword?.type === "validate" && (
                                            <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                                        )}
                                    </div>


                                    {/* Terms & Conditions */}
                                    <div className="flex items-center gap-2 mt-3">
                                        <input type="checkbox" {...register("terms", { required: true })} className="checkbox checkbox-primary" />
                                        <span className="text-gray-800">Accept Terms & Conditions</span>
                                    </div>
                                    {errors.terms?.type === 'required' && <p className="text-red-500 text-sm">You must accept the terms</p>}

                                    {/* Submit Button */}
                                    <button className="btn btn-primary mt-3 w-full">Register</button>
                                </form>



                                {/* OR divider */}
                                <div className='grid grid-cols-3 items-center justify-center mt-6'>
                                    <div className='border-b border-gray-400'></div>
                                    <p className='text-sm font-medium text-gray-400 text-center'>or go to Login Page</p>
                                    <div className='border-b border-gray-400'></div>
                                </div>

                                {/* Google Button */}
                                {/* <SocialLogin></SocialLogin> */}

                                {/* Login Link */}
                                <p className='pt-4 text-center text-sm text-gray-400'>
                                    Already have an account?{' '}
                                    <Link to='/auth/login' className='text-primary underline'>Login</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;