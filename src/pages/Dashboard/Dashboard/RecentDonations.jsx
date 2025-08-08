import React, { useEffect, useState } from "react";
import useAxios from "../../../hooks/useAxios";
import useAuth from "../../../hooks/useAuth";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const RecentDonations = () => {
    const axiosSecure = useAxios();
    const { user } = useAuth();
    const [donations, setDonations] = useState([]);
    const [userRole, setUserRole] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();

    // Fetch user info & role
    useEffect(() => {
        if (user?.email) {
            axiosSecure.get(`/user?email=${user.email}`)
                .then((res) => {
                    setUserInfo(res.data);
                    setUserRole(res.data?.role);
                })
                .catch(err => {
                    console.error("Failed to fetch user info:", err);
                });
        }
    }, [user, axiosSecure]);

    // Fetch donations
    const fetchDonations = async () => {
        if (user?.email) {
            try {
                const res = await axiosSecure.get(`/donations?email=${user.email}`);
                const latestDonations = res.data.slice(-3).reverse();
                setDonations(latestDonations);
            } catch (err) {
                console.error("Failed to fetch donations:", err);
            }
        }
    };

    useEffect(() => {
        fetchDonations();
    }, [user, axiosSecure]);

    const getStatusColorClass = (status) => {
        switch (status) {
            case "pending": return "bg-yellow-200 text-yellow-800";
            case "inprogress": return "bg-blue-200 text-blue-800";
            case "done": return "bg-green-200 text-green-800";
            case "canceled": return "bg-red-200 text-red-800";
            default: return "bg-gray-200 text-gray-800";
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const res = await axiosSecure.patch(`/donation-status/${id}`, { status: newStatus });
            if (res.data.modifiedCount > 0) {
                toast.success("Status updated successfully!");
                fetchDonations();
            } else {
                toast.error("No changes made.");
            }
        } catch {
            toast.error("Failed to update status.");
        }
    };

    const handleEditClick = (donationId) => {
        navigate(`/dashboard/update-donation/${donationId}`);
    };

    const handleViewClick = (donationId) => {
        navigate(`/dashboard/donation-details/${donationId}`);
    };

    const handleDeleteClick = (donationId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this deletion!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosSecure.delete(`/donation-delete/${donationId}`);
                    if (res.data.deletedCount > 0) {
                        toast.success("Donation request deleted successfully!");
                        fetchDonations();
                    } else {
                        toast.error("Failed to delete the donation request.");
                    }
                } catch {
                    toast.error("Error deleting the donation request.");
                }
            }
        });
    };

    if (donations.length === 0) return <p className="text-center mt-10">No recent donation requests found.</p>;

    return (
        <div className="mt-10">
            {/* Welcome Section */}
            {userInfo && (
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Welcome, <span className="text-primary">{userInfo.name}</span> 👋
                    </h2>
                    <p className="text-gray-500">Here are your 3 most recent donation requests.</p>
                </div>
            )}

            <h3 className="text-xl font-bold mb-4 text-primary">Your Recent Donation Requests</h3>
            <div className="overflow-x-auto rounded-lg shadow-md">
                <table className="table table-zebra w-full">
                    <thead className="bg-red-100 text-primary">
                        <tr>
                            <th>#</th>
                            <th>Recipient</th>
                            <th>Hospital</th>
                            <th>Blood Group</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {donations.map((donation, index) => {
                            const status = donation.status;
                            const colorClass = getStatusColorClass(status);

                            const renderStatusDropdown = () => {
                                if (userRole === "admin") {
                                    return (
                                        <select
                                            value={status}
                                            onChange={(e) =>
                                                handleStatusChange(donation._id, e.target.value)
                                            }
                                            className={`select select-xs select-bordered w-28 font-semibold ${colorClass} focus:outline-none`}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="inprogress">In Progress</option>
                                            <option value="done">Done</option>
                                            <option value="canceled">Canceled</option>
                                        </select>
                                    );
                                }

                                if (userRole === "donor") {
                                    if (status === "inprogress") {
                                        return (
                                            <select
                                                value={status}
                                                onChange={(e) =>
                                                    handleStatusChange(donation._id, e.target.value)
                                                }
                                                className={`select select-xs select-bordered w-28 font-semibold ${colorClass} focus:outline-none`}
                                            >
                                                <option value="inprogress">In Progress</option>
                                                <option value="done">Done</option>
                                                <option value="canceled">Canceled</option>
                                            </select>
                                        );
                                    } else {
                                        return (
                                            <span
                                                className={`select select-xs select-bordered w-28 font-semibold ${colorClass} cursor-not-allowed inline-block text-center py-1 rounded`}
                                                style={{ userSelect: "none" }}
                                            >
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </span>
                                        );
                                    }
                                }

                                return (
                                    <span
                                        className={`select select-xs select-bordered w-28 font-semibold ${colorClass} cursor-not-allowed inline-block text-center py-1 rounded`}
                                        style={{ userSelect: "none" }}
                                    >
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </span>
                                );
                            };

                            return (
                                <tr key={donation._id}>
                                    <td>{index + 1}</td>
                                    <td>{donation.recipientName}</td>
                                    <td>{donation.hospitalName}</td>
                                    <td>{donation.bloodGroup}</td>
                                    <td>{donation.donationDate}</td>
                                    <td>{renderStatusDropdown()}</td>
                                    <td className="flex justify-center gap-2">
                                        <button
                                            title="View"
                                            onClick={() => handleViewClick(donation._id)}
                                            className="btn btn-xs btn-outline text-info border-info hover:bg-info hover:text-white"
                                        >
                                            View
                                        </button>
                                        <button
                                            title="Edit"
                                            onClick={() => handleEditClick(donation._id)}
                                            className="btn btn-xs btn-outline text-primary border-primary hover:bg-primary hover:text-white"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            title="Delete"
                                            onClick={() => handleDeleteClick(donation._id)}
                                            className="btn btn-xs btn-outline text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="text-center mt-6">
                <button
                    onClick={() => navigate('/dashboard/my-donations')}
                    className="btn btn-primary px-6 py-2 text-white"
                >
                    View My All Requests
                </button>
            </div>
        </div>
    );
};

export default RecentDonations;
