import React from "react";
import { FaUserPlus, FaSearch, FaTint, FaHeartbeat } from "react-icons/fa";

const HowItWorks = () => {
    const steps = [
        {
            id: 1,
            title: "Register",
            desc: "Create your account in just a few clicks and become part of our donor community.",
            icon: <FaUserPlus className="text-red-500 text-4xl" />,
        },
        {
            id: 2,
            title: "Search",
            desc: "Find donors or recipients easily by filtering blood group, district, and upazila.",
            icon: <FaSearch className="text-red-500 text-4xl" />,
        },
        {
            id: 3,
            title: "Donate",
            desc: "Connect with a recipient and donate blood securely and quickly.",
            icon: <FaTint className="text-red-500 text-4xl" />,
        },
        {
            id: 4,
            title: "Save Life",
            desc: "Your small step makes a big difference—save lives and spread hope.",
            icon: <FaHeartbeat className="text-red-500 text-4xl" />,
        },
    ];

    return (
        <section className="py-16 bg-gray-50 ">
            <div className="max-w-6xl mx-auto px-4 text-center py-10">
                <h2 className="text-5xl italic text-gray-900 mb-10">
                    How It Works
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {steps.map((step) => (
                        <div
                            key={step.id}
                            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition"
                        >
                            <div className="flex justify-center mb-4">{step.icon}</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                {step.title}
                            </h3>
                            <p className="text-gray-600 text-sm">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
