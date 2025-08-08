import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import useAxios from "../../../hooks/useAxios";
import useAuth from "../../../hooks/useAuth";
import toast from "react-hot-toast";

const UpdateDonorDashboard = () => {
    const { id } = useParams();
    const axiosSecure = useAxios();
    const { user } = useAuth();
    const navigate = useNavigate();

    const { register, handleSubmit, reset, watch } = useForm();
    const [donationData, setDonationData] = useState(null);
    const [districts, setDistricts] = useState([]);
    const [upazilas, setUpazilas] = useState([]);

    // Fetch districts and upazilas
    useEffect(() => {
        axiosSecure.get("/districts").then((res) => setDistricts(res.data));
        axiosSecure.get("/upazilas").then((res) => setUpazilas(res.data));
    }, [axiosSecure]);

    // Fetch existing donation data and reset form with default values
    useEffect(() => {
        axiosSecure.get(`/donations/${id}`).then((res) => {
            const data = res.data;
            setDonationData(data);

            const matchedDistrict = districts.find((d) => d.name === data.recipientDistrict);
            const matchedUpazila = upazilas.find((u) => u.name === data.recipientUpazila);

            reset({
                recipientName: data.recipientName,
                hospitalName: data.hospitalName,
                bloodGroup: data.bloodGroup,
                donationDate: data.donationDate,
                donationTime: data.donationTime,
                fullAddress: data.fullAddress,
                requestMessage: data.requestMessage,
                recipientDistrict: matchedDistrict?.id || "",
                recipientUpazila: matchedUpazila?.id || "",
            });
        });
    }, [id, axiosSecure, reset, districts, upazilas]);

    const selectedDistrictId = watch("recipientDistrict");
    const filteredUpazilas = upazilas.filter(
        (u) => u.district_id === selectedDistrictId
    );

    const onSubmit = async (data) => {
        const selectedDistrict = districts.find((d) => d.id === data.recipientDistrict);
        const selectedUpazila = upazilas.find((u) => u.id === data.recipientUpazila);

        const updatedData = {
            ...donationData,
            recipientName: data.recipientName,
            hospitalName: data.hospitalName,
            bloodGroup: data.bloodGroup,
            donationDate: data.donationDate,
            donationTime: data.donationTime,
            fullAddress: data.fullAddress,
            requestMessage: data.requestMessage,
            recipientDistrict: selectedDistrict?.name || "",
            recipientUpazila: selectedUpazila?.name || "",
        };

        try {
            const res = await axiosSecure.patch(`/donation/${id}`, updatedData);
            if (res.data.modifiedCount > 0) {
                toast.success("Donation request updated successfully!");
                navigate("/dashboard");
            } else {
                toast.error("No changes were made.");
            }
        } catch (error) {
            toast.error("Failed to update donation request.");
        }
    };

    if (!donationData) return <p className="text-center mt-10">Loading donation data...</p>;

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-lg p-6 mt-8 shadow-2xl hover:shadow-red-400 transition-shadow duration-300 ease-in-out">
            <h2 className="text-2xl font-bold mb-6 text-center text-red-600">
                Update Donation Request
            </h2>
            {
                // donationData might be an object, so adjust accordingly.
                // If it's an array, keep this. If object, remove map.
                Array.isArray(donationData) ? donationData.map(donation =>
                    <form key={donation._id} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <FormFields donation={donation} user={user} districts={districts} filteredUpazilas={filteredUpazilas} register={register} />
                        <FormButtons navigate={navigate} />
                    </form>
                ) :
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <FormFields donation={donationData} user={user} districts={districts} filteredUpazilas={filteredUpazilas} register={register} />
                        <FormButtons navigate={navigate} />
                    </form>
            }
        </div>
    );
};

const FormFields = ({ donation, user, districts, filteredUpazilas, register }) => (
    <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="label">Requester Name</label>
                <input
                    type="text"
                    readOnly
                    defaultValue={user?.displayName}
                    className="input input-bordered w-full"
                />
            </div>
            <div>
                <label className="label">Requester Email</label>
                <input
                    type="email"
                    readOnly
                    defaultValue={user?.email}
                    className="input input-bordered w-full"
                />
            </div>
        </div>

        <div>
            <label className="label">Recipient Name</label>
            <input
                type="text"
                defaultValue={donation.recipientName}
                className="input input-bordered w-full"
                {...register("recipientName", { required: true })}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="label">Recipient District</label>
                <select
                    className="select select-bordered w-full"
                    {...register("recipientDistrict", { required: true })}
                >
                    <option value="">Select District</option>
                    {districts.map((district) => (
                        <option key={district.id} value={district.id}>
                            {district.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label className="label">Recipient Upazila</label>
                <select
                    className="select select-bordered w-full"
                    {...register("recipientUpazila", { required: true })}
                >
                    <option value="">Select Upazila</option>
                    {filteredUpazilas.map((upazila) => (
                        <option key={upazila.id} value={upazila.id}>
                            {upazila.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>

        <div>
            <label className="label">Hospital Name</label>
            <input
                type="text"
                defaultValue={donation.hospitalName}
                className="input input-bordered w-full"
                {...register("hospitalName", { required: true })}
            />
        </div>

        <div>
            <label className="label">Full Address</label>
            <input
                type="text"
                defaultValue={donation.fullAddress}
                className="input input-bordered w-full"
                {...register("fullAddress", { required: true })}
            />
        </div>

        <div>
            <label className="label">Blood Group</label>
            <select
                className="select select-bordered w-full"
                {...register("bloodGroup", { required: true })}
            >
                <option value="">Select blood group</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
                    <option key={group} value={group}>
                        {group}
                    </option>
                ))}
            </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="label">Donation Date</label>
                <input
                    type="date"
                    defaultValue={donation.donationDate}
                    className="input input-bordered w-full"
                    {...register("donationDate", { required: true })}
                />
            </div>
            <div>
                <label className="label">Donation Time</label>
                <input
                    type="time"
                    defaultValue={donation.donationTime}
                    className="input input-bordered w-full"
                    {...register("donationTime", { required: true })}
                />
            </div>
        </div>

        <div>
            <label className="label">Request Message</label>
            <textarea
                defaultValue={donation.requestMessage}
                className="textarea textarea-bordered w-full"
                {...register("requestMessage", { required: true })}
                rows={4}
            />
        </div>
    </>
);

const FormButtons = ({ navigate }) => (
    <div className="text-center flex justify-center gap-4 mt-4">
        <button
            type="submit"
            className="btn btn-error px-10 text-white"
        >
            Update Request
        </button>

        <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-outline btn-error hover:text-white px-10"
        >
            Cancel
        </button>
    </div>
);

export default UpdateDonorDashboard;
