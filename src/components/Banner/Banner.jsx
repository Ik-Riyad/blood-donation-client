import React from 'react';
import bannerImg from '../../assets/banner/banner4.jpg';
import { IoSearch } from "react-icons/io5";
import { TbUsersPlus } from "react-icons/tb";
import { Link } from 'react-router';


const Banner = () => {
    return (
        <div
            className="w-full bg-cover bg-center flex flex-col lg:flex-row"
            style={{ height: 'calc(100vh - 62px)', backgroundImage: `url(${bannerImg})` }}
        >
            {/* Left side (image area - just blank for visual) */}
            <div className="w-full lg:w-1/2 h-64 lg:h-full"></div>

            {/* Right side (content box) */}
            <div className="w-full lg:w-1/2 h-full bg-white/90 flex items-center justify-center p-6 sm:p-10">
                <div className="">
                    <h1 className="text-2xl sm:text-3xl md:text-6xl font-bold text-gray-800 mb-4">
                        Donate Your Blood to <br /> Us, Save More Lives <br /> Together
                    </h1>
                    <p className="text-sm sm:text-base text-gray-700 mb-6 py-5">
                        Every two seconds, someone somewhere needs blood. Your simple act of donating blood can give someone a second chance at life — a child fighting cancer, a mother giving birth, or a patient undergoing surgery.

                        By donating just one pint of blood, you can save up to three lives. It's safe, easy, and takes less than an hour — but the impact lasts a lifetime.

                        Let your blood flow for a reason. Be someone's lifeline today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button className="btn btn-primary w-full sm:w-auto"><TbUsersPlus /> Join as a donor</button>
                        <Link to='/search-page'>
                            <button className="btn btn-outline w-full sm:w-auto"><IoSearch /> Search Donors</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;
