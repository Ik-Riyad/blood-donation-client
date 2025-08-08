import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import useAxios from '../../hooks/useAxios';

const PublishedBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const axiosSecure = useAxios();

    useEffect(() => {
        const fetchPublishedBlogs = async () => {
            try {
                const res = await axiosSecure.get('/blogsPublished');
                setBlogs(res.data);
            } catch (error) {
                console.error('Failed to fetch published blogs:', error);
            }
        };

        fetchPublishedBlogs();
    }, [axiosSecure]);

    return (
        <div className="space-y-8 px-4 md:px-0 my-20">
            {blogs.map((blog) => (
                <motion.div
                    key={blog._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-br from-red-600 to-red-800 text-white rounded-2xl shadow-xl p-4 md:p-6 max-w-3xl mx-auto
          hover:shadow-[0_16px_40px_rgba(255,100,100,0.5),0_0_30px_rgba(255,0,0,0.3)] transition-shadow duration-500 ease-in-out"
                >
                    {/* Blog Title */}
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center drop-shadow">
                        {blog.title}
                    </h2>

                    {/* Thumbnail Image (smaller) */}
                    <div className="flex justify-center mb-4">
                        <img
                            src={blog.thumbnail}
                            alt="Blog Thumbnail"
                            className="w-full max-w-md rounded-xl shadow-lg hover:shadow-[0_6px_30px_rgba(255,255,255,0.2)] transition-shadow duration-300"
                        />
                    </div>

                    {/* Blog Content (wider) */}
                    <div
                        className="bg-white text-gray-800 rounded-lg p-6 max-w-3xl mx-auto prose prose-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                </motion.div>
            ))}
        </div>
    );
};

export default PublishedBlogs;
