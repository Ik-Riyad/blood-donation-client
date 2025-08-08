import React from 'react';
import saveLifeImg from '../../../assets/images/image3.jpeg'; // replace with your image
import { IoMdCheckmark } from "react-icons/io";


const SaveLife = () => {
    return (
        <>

            <div className='py-36 space-y-5'>
                <h1 className='text-4xl italic text-center'>"Save More Life Together"</h1>
                <h1 className='text-4xl italic text-center '>"Donate Your Blood to Us, Save More Life Together"</h1>
            </div>
            <section className="max-w-screen-2xl mx-auto px-4 pb-16 flex flex-col lg:flex-row items-center gap-12">
                {/* Left Side: Content */}
                <div className="w-full lg:w-1/2">
                    {/* Header */}
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        Together We Can <br /> Save More Lives
                    </h2>

                    {/* About Us Paragraph */}
                    <p className="text-gray-700 mb-6">
                        We are a non-profit organization committed to saving lives by connecting blood donors with those in need. With a mission to ensure no life is lost due to a shortage of blood, our team works day and night to make a difference.
                    </p>

                    {/* Services with Tick Marks */}
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 pb-6">
                        {[
                            "24/7 Blood Donation Support",
                            "Nationwide Donor Network",
                            "Emergency Blood Requests",
                            "Community Awareness Programs",
                            "Real-Time Donor Matching",
                            "Safe & Hygienic Blood Collection"
                        ].map((item, index) => (
                            <li key={index} className="flex items-center gap-2 text-gray-800">
                                <span className="text-red-500 text-lg font-bold  grid-cols-3">
                                    <IoMdCheckmark />
                                </span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>

                    {/* About Us Button */}
                    <button className="btn btn-primary">About Us</button>
                </div>

                {/* Right Side: Image */}
                <div className="w-full lg:w-1/2">
                    <img
                        src={saveLifeImg}
                        alt="Save lives"
                        className="rounded-lg shadow-lg w-full object-cover"
                    />
                </div>
            </section>
        </>
    );
};

export default SaveLife;
