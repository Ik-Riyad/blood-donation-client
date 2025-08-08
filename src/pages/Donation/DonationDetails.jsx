import React, { use, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { FaRegEnvelope } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import useAxios from '../../hooks/useAxios';

const DonationDetails = () => {
    const { user } = useAuth()
    const { id } = useParams();
    const axiosInstanceIntercept = useAxios()
    const [requestDetails, setRequestDetails] = useState([])
    const [modalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate()
    useEffect(() => {
        axiosInstanceIntercept.get(`/donation-request-details/${id}`).then(res => {
            setRequestDetails(res.data);
        });
    }, [id]);
    // console.log(requestDetails)
    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        // console.log("Form Submitted:", data);

        axiosInstanceIntercept.put(`/update-forDonation-status/${id}`, data).then((res) => {
            if (res.data.insertedId) {
                setModalOpen(false)
            }
        }).catch(err => console.log(err.data))

    };
    return (
        <>
            <div
                className="relative bg-cover bg-center flex items-center min-h-[450px] mt-[-98px] md:mt-[-149px] lg:mt-[-100px]"
                style={{ backgroundImage: "url('/assets/banner.webp')" }}
            >
                {/* Overlay */}
                <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>

                {/* Content */}
                <div className="z-10 mt-20 md:mt-0 md:text-left w-9/12 mx-auto space-y-3">
                    <h1 className="text-3xl md:text-6xl text-center font-bold coiny-regular text-white">
                        Your Blood Can Be Someone’s Hope.
                    </h1>
                </div>
            </div>

            <div className='w-11/12 md:w-9/12 mx-auto p-6 bg-white shadow-2xl shadow-red-400 mt-10 mb-10 rounded-xl'>
                <div>
                    <div className="max-w-6xl mx-auto px-4 py-10">
                        {/* Profile Header */}
                        <h2 className="text-2xl font-semibold mb-4 text-red-600">Requester Information</h2>
                        <div className="bg-linear-to-r from-red-400 to-red-200 shadow-md p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6 ">
                            <img src={requestDetails ? requestDetails?.requesterPhotoUrl : "https://i.pravatar.cc/150?img=3"} alt="avatar" className="rounded-full w-32 h-32 border-4 border-red-500 object-cover" />
                            <div className="flex-1 text-white space-y-1">
                                <h2 className="text-2xl font-bold">{requestDetails?.requesterName}</h2>
                                <p className=" opacity-80 flex items-center gap-2 text-white"><FaRegEnvelope />{requestDetails?.requesterEmail}</p>
                            </div>

                            <button onClick={() => navigate(-1)} className={`py-2 px-4 transition rounded-md font-semibold text-red-600 border border-red-600 cursor-pointer hover:shadow-[0_0_0_1px_#f00,0_5px_0_0_#f01]`}>
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>

                <div className='mt-3'>
                    <div className="bg-white rounded-xl shadow-md p-6 max-w-4xl mx-auto">
                        <h2 className="text-2xl font-semibold mb-4 text-red-600">Donation Request Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex gap-2">
                                <span className="font-semibold w-32">Recipient Name:</span>
                                <span>{requestDetails?.recipientName}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="font-semibold w-32">Hospital:</span>
                                <span>{requestDetails?.hospitalName}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="font-semibold w-32">District:</span>
                                <span>{requestDetails?.recipientDistrict}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="font-semibold w-32">Upazila:</span>
                                <span>{requestDetails?.recipientUpazila}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="font-semibold w-32">Address Detail:</span>
                                <span>{requestDetails?.fullAddress}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="font-semibold w-32">Blood Group:</span>
                                <span>{requestDetails?.bloodGroup}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="font-semibold w-32">Donation Date:</span>
                                <span>{new Date(requestDetails?.donationDate).toDateString()}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="font-semibold w-32">Donation Time:</span>
                                <span>{requestDetails?.donationTime}</span>
                            </div>
                        </div>
                        <div className='flex justify-between items-center'>
                            <div className="mt-6">
                                <p className="font-semibold mb-1">Request Message:</p>
                                <p className="text-gray-700">{requestDetails?.requestMessage}</p>
                            </div>
                            <button onClick={() => setModalOpen(true)} className={`py-1 px-3 transition rounded-sm font-semibold text-red-600 border border-red-600 cursor-pointer hover:shadow-[0_0_0_1px_#f00,0_5px_0_0_#f01]`}>
                               I Can Donate
                            </button>

                            <dialog open={modalOpen} className="modal">
                                <div className="min-w-xl mx-auto p-6 bg-white shadow-lg rounded-xl">
                                    <div className='flex justify-between'>
                                        <div></div>
                                        <button onClick={() => setModalOpen(false)} className="btn btn-sm btn-circle btn-error">✕</button>
                                    </div>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Title & Thumbnail - 1 row 2 column */}
                                        <div className="">
                                            <div>
                                                <label className="block font-medium mb-1">Full Name</label>
                                                <input type="text" name='donorName'
                                                    value={user?.displayName}
                                                    readOnly
                                                    className="w-full input input-bordered mb-2"
                                                />
                                            </div>
                                            <div>
                                                <label className="block font-medium mb-1">EmailL</label>
                                                <input type="text" name='donoremail'
                                                    value={user?.email}
                                                    readOnly
                                                    className="w-full input input-bordered"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        {/* Submit Button */}
                                        <div className="text-center">
                                            <button type='submit' className={`py-2 px-4 transition rounded-md font-semibold text-red-600 border border-red-600 cursor-pointer hover:shadow-[0_0_0_1px_#f00,0_5px_0_0_#f01]`}>
                                                Confirm For Donate
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </dialog>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DonationDetails;