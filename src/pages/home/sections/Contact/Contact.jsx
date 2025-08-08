import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn } from 'react-icons/fa';

const Contact = () => {
    return (
        <section className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 ">
                {/* Left: Contact Info */}
                <div className='flex justify-center items-center bg-primary rounded-l-xl'>
                    <div className=" text-white p-10 space-y-6">
                        <h2 className="text-3xl font-bold mb-2">Get in Touch</h2>
                        <p className="text-white/90">
                            We are always here to answer your questions and help you with any blood donation, health, or emergency service needs.
                        </p>

                        <div className="space-y-3">
                            <p className="flex items-center gap-2">
                                <FaMapMarkerAlt /> <span>123 Blood Street, Dhaka, Bangladesh</span>
                            </p>
                            <p className="flex items-center gap-2">
                                <FaPhoneAlt /> <span>+880 1234 567 890</span>
                            </p>
                            <p className="flex items-center gap-2">
                                <FaEnvelope /> <span>contact@lifesavers.org</span>
                            </p>
                        </div>

                        <div className="flex gap-4 mt-6 text-xl">
                            <a href="#" className="hover:text-white/80"><FaFacebookF /></a>
                            <a href="#" className="hover:text-white/80"><FaInstagram /></a>
                            <a href="#" className="hover:text-white/80"><FaYoutube /></a>
                            <a href="#" className="hover:text-white/80"><FaLinkedinIn /></a>
                        </div>
                    </div>
                </div>

                {/* Right: Contact Form */}
                <div className="bg-gray-50 p-10 rounded-r-xl">
                    <form className="space-y-6">
                        <div>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Enter your name"
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Enter your email"
                            />
                        </div>
                        <div>
                            <textarea
                                rows="5"
                                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Write your message"
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="bg-primary text-white px-6 py-3 rounded-md hover:bg-red-800 transition cursor-pointer"
                        >
                            Contact Us
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contact;
