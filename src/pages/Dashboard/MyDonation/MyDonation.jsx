import React, { useEffect, useState } from "react";
import useAxios from "../../../hooks/useAxios";
import useAuth from "../../../hooks/useAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { FaEdit, FaTrash, FaFilter, FaChevronDown, FaEye } from "react-icons/fa"; // Added FaEye
import Swal from "sweetalert2";

const MyDonation = () => {
  const axiosSecure = useAxios();
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dataLoding, setDataLoading] = useState(true);

  const navigate = useNavigate();

  const statusOptions = [
    { label: "All", value: "all", color: "text-gray-700" },
    { label: "Pending", value: "pending", color: "text-yellow-700" },
    { label: "In Progress", value: "inprogress", color: "text-blue-700" },
    { label: "Done", value: "done", color: "text-green-700" },
    { label: "Canceled", value: "canceled", color: "text-red-700" },
  ];

  useEffect(() => {
    if (user?.email) {
      axiosSecure.get(`/donations?email=${user.email}`).then((res) => {
        setDonations(res.data);
        setDataLoading(false);
      });
    }
  }, [user, axiosSecure]);

  useEffect(() => {
    if (filterStatus === "all") {
      setFilteredDonations(donations);
    } else {
      setFilteredDonations(donations.filter((d) => d.status === filterStatus));
    }
  }, [filterStatus, donations]);

  const getStatusColorClass = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-200 text-yellow-800";
      case "inprogress": return "bg-blue-200 text-blue-800";
      case "done": return "bg-green-200 text-green-800";
      case "canceled": return "bg-red-200 text-red-800";
      default: return "bg-gray-200 text-gray-800";
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
            setDonations(donations.filter((d) => d._id !== donationId));
          } else {
            toast.error("Failed to delete the donation request.");
          }
        } catch (error) {
          toast.error("Error deleting the donation request.");
        }
      }
    });
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleFilterChange = (value) => {
    setFilterStatus(value);
    setDropdownOpen(false);
  };

  if (dataLoding) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-red-500"></span>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-4 relative">
        <h3 className="text-xl font-bold text-primary">My All Donation Requests</h3>

        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-2 border border-error text-error hover:bg-error hover:text-white px-4 py-2 rounded-md transition-all"
          >
            <FaFilter className="text-sm" />
            {filterStatus === "all"
              ? "All Requests"
              : `Filtered: ${filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}`}
            <FaChevronDown className="ml-1" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-md z-10">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange(option.value)}
                  className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${option.color}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

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
            {filteredDonations.map((donation, index) => (
              <tr key={donation._id}>
                <td>{index + 1}</td>
                <td>{donation.recipientName}</td>
                <td>{donation.hospitalName}</td>
                <td>{donation.bloodGroup}</td>
                <td>{donation.donationDate}</td>
                <td>
                  <span
                    className={`select select-xs select-bordered w-28 font-semibold ${getStatusColorClass(
                      donation.status
                    )} inline-block text-center py-1 rounded`}
                  >
                    {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                  </span>
                </td>
                <td className="flex justify-center gap-2">
                  <button
                    className="btn btn-xs btn-outline btn-info"
                    onClick={() => handleViewClick(donation._id)}
                    title="View"
                  >
                    <FaEye />
                  </button>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyDonation;
