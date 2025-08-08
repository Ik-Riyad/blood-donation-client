import React, { useEffect, useState } from "react";
import useAxios from "../../../hooks/useAxios";
import bannerImg from '../../../assets/images/image2.jpg'

const SearchDonor = () => {
    const axiosInstanceIntercept = useAxios();
    const [filters, setFilters] = useState({
        bloodGroup: "",
        district: "",
        upazila: ""
    });

    const [districts, setDistricts] = useState([]);
    const [upazilas, setUpazilas] = useState([]);
    const [donors, setDonors] = useState([]);

    useEffect(() => {
        axiosInstanceIntercept.get("/districts").then((res) => setDistricts(res.data));
        axiosInstanceIntercept.get("/upazilas").then((res) => setUpazilas(res.data));
    }, []);

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        // Get the selected district name from the ID
        const selectedDistrictObj = districts.find((d) => d.id === filters.district);
        const districtName = selectedDistrictObj?.name || "";

        // Include district name in the request
        const searchParams = {
            ...filters,
            districtName // sending district name too
        };

        const res = await axiosInstanceIntercept.get("/search-donors", { params: searchParams });
        setDonors(res.data);
    };

    const filteredUpazilas = upazilas.filter(
        (u) => u.district_id === filters.district
    );
    return (
        <>
            <div
                className="relative bg-cover bg-center flex items-center min-h-[450px] mt-[-98px] md:mt-[-149px] lg:mt-[-100px] -z-10"
                style={{ backgroundImage: `url(${bannerImg})` }}
            >
                {/* Overlay */}
                <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>

                {/* Content */}
                <div className="z-10 mt-20 md:mt-0 md:text-left w-9/12 mx-auto space-y-3">
                    <h1 className="text-3xl md:text-6xl text-center font-bold coiny-regular text-white">Search for Donor Information.</h1>
                    <h1 className="text-2xl md:text-4xl text-center font-bold coiny-regular text-red-400">Your Blood Can Be Someone’s Hope.</h1>
                </div>
            </div>
            <div className="flex flex-col md:flex-row max-w-10/12 mx-auto gap-6 p-4">
                {/* Filter Sidebar */}
                <div className="md:w-1/4 bg-white rounded-xl p-6 min-h-screen">
                    <h2 className="text-xl font-semibold mb-4">Search Donors</h2>
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div>
                            <label className="block mb-1 font-medium">Blood Group</label>
                            <select
                                name="bloodGroup"
                                value={filters.bloodGroup}
                                onChange={handleChange}
                                className="select select-bordered w-full"
                                required
                            >
                                <option value="">Select</option>
                                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                                    <option key={bg} value={bg}>{bg}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">District</label>
                            <select
                                name="district"
                                value={filters.district}
                                onChange={handleChange}
                                className="select select-bordered w-full"
                                required
                            >
                                <option value="">Select District</option>
                                {districts.map((d) => (
                                    <option key={d._id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Upazila</label>
                            <select
                                name="upazila"
                                value={filters.upazila}
                                onChange={handleChange}
                                className="select select-bordered w-full"
                                required
                            >
                                <option value="">Select Upazila</option>
                                {filteredUpazilas.map((u) => (
                                    <option key={u._id} value={u.name}>{u.name}</option>
                                ))}
                            </select>
                        </div>

                        <button type="submit" className="btn btn-error w-full text-white">
                            Search
                        </button>
                    </form>
                </div>

                {/* Donor Results */}
                <div className="md:w-2/3 space-y-4">
                    <h2 className="text-xl font-semibold mb-4">Matching Donors</h2>
                    {donors.length === 0 ? (
                        <p className="text-gray-600 text-xl">No donors found. Please search above.</p>
                    ) : (
                        donors?.map((donor) => (
                            <div className="max-w-2xl mx-4 sm:max-w-sm md:max-w-sm lg:max-w-sm xl:max-w-sm sm:mx-auto mt-16 shadow rounded-xl bg-white hover:shadow-2xl hover:shadow-red-400 transition">
                                {/* Banner Image */}
                                <div className="rounded-t-lg h-20 overflow-hidden">
                                    <img
                                        className="object-cover object-top w-full"
                                        src="https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max"
                                        alt="Mountain"
                                    />
                                </div>

                                {/* Profile Image */}
                                <div className="mx-auto w-24 h-24 relative -mt-14 border-4 border-white rounded-full overflow-hidden">
                                    <img
                                        className="object-cover object-center h-32 w-32"
                                        src={donor.photoURL}
                                        alt="Profile"
                                    />
                                </div>

                                {/* Name and Job */}
                                <div className="text-center mt-2">
                                    <h2 className="font-semibold">Name : {donor.name}</h2>
                                    <p className="text-gray-500">Email : {donor.email}</p>
                                    <p className="text-gray-500">Address : {donor.upazila}, {donor.districtName}</p>
                                    <p className="text-gray-500">Blood Group : <span className="text-red-500 font-semibold">{donor.bloodGroup}</span></p>
                                </div>

                                {/* Follow Button */}
                                <div className="p-4 border-t mx-8 mt-2">
                                    <button className="w-1/2 block mx-auto rounded-full bg-gray-900 hover:shadow-lg font-semibold text-white px-6 py-2">
                                        Follow
                                    </button>
                                </div>
                            </div>

                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default SearchDonor;
