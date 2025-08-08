import React, { useEffect, useState } from "react";
import useAxios from "../../../hooks/useAxios";
import useAuth from "../../../hooks/useAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { FaEdit, FaTrash, FaChevronDown } from "react-icons/fa";
import Swal from "sweetalert2";
import Pagination from "../../../components/Pagination/Pagination";

const AllBloodDonation = () => {
    const axiosSecure = useAxios();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [donations, setDonations] = useState([]);
    const [filterStatus, setFilterStatus] = useState("all");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const statusOptions = [
        { label: "All", value: "all", color: "text-gray-700" },
        { label: "Pending", value: "pending", color: "text-yellow-700" },
        { label: "In Progress", value: "inprogress", color: "text-blue-700" },
        { label: "Done", value: "done", color: "text-green-700" },
        { label: "Canceled", value: "canceled", color: "text-red-700" },
    ];

    const updateStatusOptions = ["pending", "inprogress", "done", "canceled"];
    console.log(userData)
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user?.email) {
                    axiosSecure.get(`/user?email=${user.email}`).then(res => {
                        setUserData(res.data);
                    })
                }
            } catch (error) {
                console.error("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        const fetchPaginatedData = async () => {
            try {
                const res = await axiosSecure.get(`/paginated-donation-requests?startIndex=${startIndex}&endIndex=${endIndex}`);
                setDonations(res.data.data); // server response: { data, total, ... }
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
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-red-500"></span>
            </div>
        );
    }

    const getStatusColorClass = (status) => {
        switch (status) {
            case "pending":
                return "bg-yellow-200 text-yellow-800";
            case "inprogress":
                return "bg-blue-200 text-blue-800";
            case "done":
                return "bg-green-200 text-green-800";
            case "canceled":
                return "bg-red-200 text-red-800";
            default:
                return "bg-gray-200 text-gray-800";
        }
    };

    const handleEditClick = (id) => navigate(`/dashboard/update-donation/${id}`);

    const handleDeleteClick = (id) => {
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
                    const res = await axiosSecure.delete(`/donation-delete/${id}`);
                    if (res.data.deletedCount > 0) {
                        toast.success("Deleted successfully!");
                        setDonations((prev) => prev.filter((d) => d._id !== id));
                    } else {
                        toast.error("Failed to delete.");
                    }
                } catch (err) {
                    toast.error("Error while deleting.");
                }
            }
        });
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const res = await axiosSecure.patch(`/donation/${id}`, { status: newStatus });
            if (res.data.modifiedCount > 0) {
                toast.success("Status updated");
                setDonations((prev) =>
                    prev.map((d) => (d._id === id ? { ...d, status: newStatus } : d))
                );
            }
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    const filteredDonations =
        filterStatus === "all"
            ? donations
            : donations.filter((d) => d.status === filterStatus);

    return (
        <div className="mt-10">
            <div className="flex items-center justify-between mb-4 relative">
                <h3 className="text-xl font-bold text-primary">All Donation Requests</h3>

                {/* Filter Dropdown */}
                <div className="relative inline-block text-left">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 border border-red-400 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded transition-all"
                    >
                        <FaChevronDown />
                        {filterStatus === "all"
                            ? "All Requests"
                            : `Filtered: ${filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}`}
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
                            {statusOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        setFilterStatus(option.value);
                                        setIsDropdownOpen(false);
                                    }}
                                    className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${option.color}`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Table */}
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
                            {userData?.role === "admin" && <th className="text-center">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDonations.map((donation, index) => (
                            <tr key={donation._id}>
                                <td>{index + 1}</td>
                                <td>{donation.recipientName}</td>
                                <td>{donation.hospitalName}</td>
                                <td>{donation.bloodGroup}</td>
                                <td>{donation.donationDate}</td>
                                <td>
                                    <select
                                        value={donation.status}
                                        onChange={(e) => handleStatusChange(donation._id, e.target.value)}
                                        className={`select select-xs w-28 font-semibold text-center py-1 rounded ${getStatusColorClass(
                                            donation.status
                                        )}`}
                                        disabled={
                                            donation.status === "done" || donation.status === "canceled"
                                        }
                                    >
                                        {updateStatusOptions.map((status) => (
                                            <option key={status} value={status}>
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </td>

                                {/* Admin-only Action buttons */}
                                {userData?.role === "admin" && (
                                    <td className="flex justify-center gap-2">
                                        <button
                                            className="btn btn-xs btn-outline btn-success"
                                            onClick={() => handleEditClick(donation._id)}
                                            title="Edit"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            className="btn btn-xs btn-outline btn-error"
                                            onClick={() => handleDeleteClick(donation._id)}
                                            title="Delete"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div>
                <Pagination totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
        </div>
    );
};

export default AllBloodDonation;
