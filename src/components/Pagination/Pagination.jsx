import React, { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Pagination = ({ totalPages = 10, onPageChange }) => {
    const [currentPage, setCurrentPage] = useState(1); // default active page

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        onPageChange?.(page); // optional callback
    };

    const renderPages = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => goToPage(i)}
                    className={`rounded-lg flex items-center gap-2 border px-3 py-1 transition duration-150 ease-in-out hover:border-black ${currentPage === i
                            ? "bg-black text-white border-gray-300"
                            : "bg-gray-50 text-gray-900 border-gray-300"
                        }`}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    return (
        <div className="col-span-12 mx-auto mt-12 grid grid-cols-4 grid-rows-2 items-center gap-3 px-4 py-4 pb-8 sm:flex sm:justify-center">
            {/* Back button */}
            <div className="order-2 col-span-2 flex justify-end gap-2">
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="rounded-lg flex items-center gap-2 border border-gray-300 px-3 py-1 transition duration-150 ease-in-out hover:border-black bg-gray-50 text-gray-900 disabled:opacity-50"
                >
                    <IoIosArrowBack />
                    Back
                </button>
            </div>

            {/* Page Numbers */}
            <div className="order-1 col-span-4 flex justify-center gap-3 sm:order-2">
                {renderPages()}
            </div>

            {/* Next button */}
            <div className="order-2 col-span-2 flex items-center gap-2">
                <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="rounded-lg flex items-center gap-2 border border-gray-300 px-3 py-1 transition duration-150 ease-in-out hover:border-black bg-gray-50 text-gray-900 disabled:opacity-50"
                >
                    Next
                    <IoIosArrowForward />
                </button>
            </div>
        </div>
    );
};

export default Pagination;