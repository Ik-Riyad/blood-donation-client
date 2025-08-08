import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import useAxios from '../../../hooks/useAxios';
import useAuth from '../../../hooks/useAuth';
import BloodLoader from '../../loader/BloodLoader';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, setUser, updateUser } = useAuth();
    const axiosSecure = useAxios();

    const [editable, setEditable] = useState(false);
    const [districts, setDistricts] = useState([]);
    const [upazilas, setUpazilas] = useState([]);
    const [filteredUpazilas, setFilteredUpazilas] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { register, handleSubmit, reset, watch } = useForm();
    const selectedDistrictId = watch("district");
    const notify = () => toast.success('Profile updated successfully.');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [districtRes, upazilaRes] = await Promise.all([
                    axiosSecure.get("/districts"),
                    axiosSecure.get("/upazilas")
                ]);
                setDistricts(districtRes.data);
                setUpazilas(upazilaRes.data);
                setDataLoaded(true);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setIsLoading(false);
            }
        };
        fetchData();
    }, [axiosSecure]);

    useEffect(() => {
        if (selectedDistrictId) {
            const filtered = upazilas.filter(u => u.district_id === selectedDistrictId);
            setFilteredUpazilas(filtered);
        } else {
            setFilteredUpazilas([]);
        }
    }, [selectedDistrictId, upazilas]);

    useEffect(() => {
        if (user?.email && dataLoaded) {
            axiosSecure.get(`/user?email=${user.email}`)
                .then(res => {
                    const userData = res.data;
                    const selectedDistrict = districts.find(d => d.name === userData.district);
                    const selectedUpazila = upazilas.find(u => u.name === userData.upazila);

                    if (selectedDistrict) {
                        const filtered = upazilas.filter(u => u.district_id === selectedDistrict.id);
                        setFilteredUpazilas(filtered);
                    }

                    reset({
                        name: userData.name || '',
                        email: userData.email || '',
                        image: userData.image || '',
                        district: selectedDistrict?.id || '',
                        upazila: selectedUpazila?.name || '',
                        bloodGroup: userData.bloodGroup || ''
                    });
                });
        }
    }, [user?.email, dataLoaded, districts, upazilas, axiosSecure, reset]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-red-500"></span>
            </div>
        );
    }

    const onSubmit = data => {
        const selectedDistrict = districts.find(d => d.id === data.district);
        const selectedUpazila = upazilas.find(u => u.name === data.upazila);

        updateUser({ displayName: data.name, photoURL: data.image })
            .then(() => {
                setUser({ ...user, displayName: data.name, photoURL: data.image })
            }).catch(error => {
                console.log(error)
            })

        const finalData = {
            ...data,
            district: selectedDistrict?.name || '',
            upazila: selectedUpazila?.name || '',
        };

        axiosSecure.put(`/user?email=${data.email}`, finalData)
            .then(() => {
                notify();
                setEditable(false);
            });
    };

    return (
        <div className="w-full flex justify-center p-6 lg:mt-20">
            <div className="w-full max-w-5xl bg-white rounded-2xl p-10 border border-gray-200 shadow-2xl shadow-red-400 relative">

                {/* Avatar top-left corner */}
                <div className="absolute -top-10 left-6">
                    <div className="avatar">
                        <div className="w-24 h-24 rounded-full ring ring-red-400 ring-offset-base-100 ring-offset-2 shadow-md overflow-hidden">
                            <img
                                src={user?.photoURL || "/default-avatar.png"}
                                alt="User Avatar"
                                className="object-cover w-full h-full"
                            />
                        </div>
                    </div>
                </div>

                {/* Top right edit/update/cancel buttons */}
                <div className="flex justify-end mb-6 mt-6">
                    {!editable ? (
                        <button onClick={() => setEditable(true)} className="btn btn-primary">Edit</button>
                    ) : (
                        <div className="flex gap-3">
                            <button onClick={handleSubmit(onSubmit)} className="btn btn-success">Update</button>
                            <button onClick={() => setEditable(false)} className="btn btn-outline">Cancel</button>
                        </div>
                    )}
                </div>

                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="label font-semibold">Name</label>
                        <input
                            {...register("name")}
                            disabled={!editable}
                            className="input input-bordered w-full pl-10 text-black focus:outline-none focus:border-primary"
                        />
                    </div>
                    <div>
                        <label className="label font-semibold">Email</label>
                        <input
                            {...register("email")}
                            disabled
                            className="input input-bordered w-full pl-10 text-black focus:outline-none focus:border-primary"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="label font-semibold">Avatar URL</label>
                        <input
                            {...register("image")}
                            disabled={!editable}
                            className="input input-bordered w-full pl-10 text-black focus:outline-none focus:border-primary"
                        />
                    </div>
                    <div>
                        <label className="label font-semibold">District</label>
                        <select
                            {...register("district")}
                            disabled={!editable}
                            className="select select-bordered w-full text-black focus:outline-none focus:border-primary"
                        >
                            <option value="">Select district</option>
                            {districts.map(d => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="label font-semibold">Upazila</label>
                        <select
                            {...register("upazila")}
                            disabled={!editable}
                            className="select select-bordered w-full text-black focus:outline-none focus:border-primary"
                        >
                            <option value="">Select upazila</option>
                            {filteredUpazilas.map(u => (
                                <option key={u.id} value={u.name}>{u.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="label font-semibold">Blood Group</label>
                        <select
                            {...register("bloodGroup")}
                            disabled={!editable}
                            className="select select-bordered w-full text-black focus:outline-none focus:border-primary"
                        >
                            <option value="">Select blood group</option>
                            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(group => (
                                <option key={group} value={group}>{group}</option>
                            ))}
                        </select>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
