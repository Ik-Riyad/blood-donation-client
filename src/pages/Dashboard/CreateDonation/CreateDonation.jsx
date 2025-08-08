import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const CreateDonation = () => {
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const navigate = useNavigate();

  const { register, handleSubmit, watch, reset } = useForm();
  const [upazilas, setUpazilas] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);


  // Fetch district and upazila data
  // useEffect(() => {
  //   axiosSecure.get("/districts").then((res) => setDistricts(res.data));
  //   axiosSecure.get("/upazilas").then((res) => setUpazilas(res.data));
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

  // Check user active status
  useEffect(() => {
    if (user?.email) {
      axiosSecure.get(`/user?email=${user.email}`).then((res) => {
        setIsActive(res.data.status === "active");
      });
    }
  }, [user, axiosSecure]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-red-500"></span>
      </div>
    );
  }

  // Get selected district to filter upazilas
  const selectedDistrictId = watch("recipientDistrict");
  const filteredUpazilas = upazilas.filter(
    (u) => u.district_id === selectedDistrictId
  );

  const onSubmit = (data) => {
    if (!isActive) return;

    const selectedDistrict = districts.find((d) => d.id === data.recipientDistrict);
    const selectedUpazila = upazilas.find((u) => u.id === data.recipientUpazila);

    const requestData = {
      requesterName: user.displayName,
      requesterEmail: user.email,
      recipientName: data.recipientName,
      recipientDistrict: selectedDistrict?.name || "",
      recipientUpazila: selectedUpazila?.name || "",
      hospitalName: data.hospitalName,
      fullAddress: data.fullAddress,
      bloodGroup: data.bloodGroup,
      donationDate: data.donationDate,
      donationTime: data.donationTime,
      requestMessage: data.requestMessage,
      status: "pending",
      createdAt: new Date(),
    };

    axiosSecure.post("/donation-requests", requestData).then((res) => {
      if (res.data.insertedId) {
        toast.success("Donation request submitted!");
        reset();
        navigate("/dashboard");
      }
    });
  };

  if (!isActive) {
    return (
      <div className="text-center text-red-600 font-semibold mt-10">
        You are currently Blocked and cannot create donation requests.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg p-6 mt-8 shadow-2xl hover:shadow-red-400 transition-shadow duration-300 ease-in-out">
      <h2 className="text-2xl font-bold mb-6 text-center text-red-600">
        Create Donation Request
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Requester Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Requester Name</label>
            <input
              type="text"
              readOnly
              defaultValue={user?.displayName}
              className="input input-bordered w-full"
              {...register("requesterName")}
            />
          </div>
          <div>
            <label className="label">Requester Email</label>
            <input
              type="email"
              readOnly
              defaultValue={user?.email}
              className="input input-bordered w-full"
              {...register("requesterEmail")}
            />
          </div>
        </div>

        {/* Recipient Name */}
        <div>
          <label className="label">Recipient Name</label>
          <input
            type="text"
            className="input input-bordered w-full"
            {...register("recipientName", { required: true })}
            placeholder="Enter recipient name"
          />
        </div>

        {/* District and Upazila */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* District */}
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

          {/* Upazila */}
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

        {/* Hospital Name */}
        <div>
          <label className="label">Hospital Name</label>
          <input
            type="text"
            className="input input-bordered w-full"
            {...register("hospitalName", { required: true })}
            placeholder="e.g. Dhaka Medical College Hospital"
          />
        </div>

        {/* Full Address */}
        <div>
          <label className="label">Full Address</label>
          <input
            type="text"
            className="input input-bordered w-full"
            {...register("fullAddress", { required: true })}
            placeholder="e.g. Zahir Raihan Rd, Dhaka"
          />
        </div>

        {/* Blood Group */}
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

        {/* Donation Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Donation Date</label>
            <input
              type="date"
              className="input input-bordered w-full"
              {...register("donationDate", { required: true })}
              onFocus={(e) => (e.target.type = "date")}
            />
          </div>
          <div>
            <label className="label">Donation Time</label>
            <input
              type="time"
              className="input input-bordered w-full"
              {...register("donationTime", { required: true })}
              onFocus={(e) => (e.target.type = "time")}
            />
          </div>
        </div>

        {/* Request Message */}
        <div>
          <label className="label">Request Message</label>
          <textarea
            className="textarea textarea-bordered w-full"
            {...register("requestMessage", { required: true })}
            rows={4}
            placeholder="Why do you need blood?"
          />
        </div>

        {/* Submit */}
        <div className="text-center">
          <button type="submit" className="btn btn-error px-10 text-white">
            Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateDonation;
