import React, { useEffect, useState } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { Link } from 'react-router';
import Pagination from '../../components/Pagination/Pagination';
import useAxios from '../../hooks/useAxios';
import useAuth from '../../hooks/useAuth';

const DonationReq = () => {
    const { loading } = useAuth()
    const axiosInstanceIntercept = useAxios();

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [donationRequests, setDonationRequests] = useState([]);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        const fetchPaginatedData = async () => {
            try {
                const res = await axiosInstanceIntercept.get(`/paginated-donation-reqByPending?startIndex=${startIndex}&endIndex=${endIndex}`);
                setDonationRequests(res.data.data); // server response: { data, total, ... }
                setTotalPages(Math.ceil(res.data.total / itemsPerPage));
            } catch (error) {
                console.error("Error fetching paginated data:", error);
            }
        };

        fetchPaginatedData();
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }
    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">
            <span className="loading loading-spinner loading-lg text-red-500"></span>
        </div>
    }
    return (
        <>
            <div
                className="relative bg-cover bg-center flex items-center min-h-[450px] mt-[-98px] md:mt-[-149px] lg:mt-[-100px] -z-10"
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

            <div className='w-full md:w-9/12 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4 mt-6'>
                {
                    donationRequests.map(request =>
                        <div className="flex mb-8 md:mb-0 p-5 shadow-md rounded-xl bg-white hover:shadow-2xl hover:shadow-red-400 transition">
                            <div className="w-full text-left">
                                <div className='flex justify-start items-center gap-3'>
                                    <p className="text-lg text-gray-800 leading-normal mb-5 font-semibold">{'Recipent Name :'}</p>
                                    <p className="text-lg text-gray-800 leading-normal mb-5 font-normal">{request?.recipientName}</p>
                                </div>
                                <div className='flex justify-start items-center gap-3'>
                                    <p className="text-md text-gray-800 leading-normal mb-1 font-semibold">{'Recipent Address :'}</p>
                                    <p className="text-sm text-gray-800 leading-normal mb-1 font-normal">{request?.recipientUpazila}, {request?.districtName}, {request?.fullAddress}</p>
                                </div>
                                <div className='flex justify-start items-center gap-3'>
                                    <p className="text-md text-gray-800 leading-normal mb-1 font-semibold">{'Hospital Name :'}</p>
                                    <p className="text-sm text-gray-800 leading-normal mb-1 font-normal">{request?.hospitalName}</p>
                                </div>
                                <div className='flex justify-start items-center gap-3'>
                                    <p className="text-md text-gray-800 leading-normal mb-1 font-semibold">{'Blood Group Need :'}</p>
                                    <p className="text-md text-gray-800 leading-normal mb-1 font-normal">{request?.bloodGroup}</p>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <img
                                            src={request ? request.requesterPhotoUrl : 'https://static.vecteezy.com/system/resources/previews/048/216/761/non_2x/modern-male-avatar-with-black-hair-and-hoodie-illustration-free-png.png'}
                                            alt={'Requester Photo'}
                                            className="rounded-md mr-3 h-10 w-10 object-cover"
                                        />
                                        <div>
                                            <p className="text-sm text-gray-600">{request.requesterName}</p>
                                            <p className="text-sm text-gray-400">{request.requesterEmail}</p>
                                        </div>
                                    </div>
                                    <Link to={`/donation-Details/${request._id}`}>
                                        <button className={`py-1 px-3 transition rounded-sm font-semibold text-red-600 border border-red-600 cursor-pointer hover:shadow-[0_0_0_1px_#f00,0_5px_0_0_#f01]`}>
                                            Details
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
            <div>
                <Pagination totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
        </>
    );
};

export default DonationReq;