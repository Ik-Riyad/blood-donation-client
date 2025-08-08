import { FaHandHoldingHeart, FaHeartbeat, FaTint } from "react-icons/fa";

const Services = () => {
    const services = [
        {
            title: "Blood Donation",
            icon: <FaHandHoldingHeart className="text-5xl text-primary" />,
            description: "Join our life-saving mission by donating blood. Just one donation can help save up to three lives and support emergency medical care."
        },
        {
            title: "Health Check",
            icon: <FaHeartbeat className="text-5xl text-primary" />,
            description: "We offer free basic health screenings to ensure you're healthy and ready to donate, promoting wellness and early detection of health issues."
        },
        {
            title: "Blood Bank",
            icon: <FaTint className="text-5xl text-primary" />,
            description: "Our blood bank ensures safe storage and quick delivery of all blood types, serving hospitals, clinics, and emergency patients across the country."
        }

    ];

    return (
        <section className="bg-primary text-white py-20">
            <div className="max-w-screen-xl mx-auto px-4 text-center">
                <h2 className="text-5xl italic mb-16">Our Services</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="bg-white text-gray-800 rounded-xl shadow-lg p-8 h-80 flex flex-col justify-between items-center transform transition duration-300 hover:-translate-y-2"
                        >
                            <div className="flex flex-col items-center gap-4">
                                {service.icon}
                                <h3 className="text-3xl font-semibold">{service.title}</h3>
                                <p className="text-center text-md text-gray-400">{service.description}</p>
                            </div>
                            <button className="mt-6 text-primary font-medium hover:underline">
                                Learn More
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
