import React, { useRef, useState } from "react";
import JoditEditor from "jodit-react";
import useAxios from "../../../hooks/useAxios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const AddBlog = () => {
    const axiosSecure = useAxios();
    const navigate = useNavigate();
    const editor = useRef(null);
    const [content, setContent] = useState("");
    const [imageURL, setImageURL] = useState("");
    const [uploading, setUploading] = useState(false);

    const imgbbKey = "5c7d7322055e41849d14bf3be478e1c8";

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        setUploading(true);
        try {
            const res = await fetch(
                `https://api.imgbb.com/1/upload?key=${imgbbKey}`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await res.json();

            if (data.success) {
                setImageURL(data.data.url);
                toast.success("Image uploaded");
            } else {
                toast.error("Image upload failed");
                console.error("imgbb error:", data);
            }
        } catch (error) {
            toast.error("Failed to upload image");
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const title = form.title.value;

        if (!title || !imageURL || !content) {
            toast.error("All fields are required");
            return;
        }

        const blogData = {
            title,
            thumbnail: imageURL,
            content,
            status: "draft", // default
            createdAt: new Date(),
        };

        try {
            const res = await axiosSecure.post("/blogs", blogData);
            if (res.data.insertedId) {
                toast.success("Blog created in draft status");
                navigate("/dashboard/content-management");
            }
        } catch (err) {
            toast.error("Failed to create blog");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-8">
            <div className="flex justify-between items-center mb-6">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="btn btn-outline btn-sm text-primary"
                >
                    &larr; Back
                </button>

                <h2 className="text-2xl font-bold text-primary">Add New Blog</h2>

                {/* Empty div to balance flex */}
                <div></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block mb-1 font-medium">Title</label>
                    <input
                        type="text"
                        name="title"
                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:ring-red-200"
                        placeholder="Enter blog title"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Thumbnail Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="file-input file-input-bordered file-input-sm"
                    />
                    {uploading && <p className="text-sm text-yellow-600">Uploading...</p>}
                    {imageURL && (
                        <img
                            src={imageURL}
                            alt="Thumbnail preview"
                            className="mt-2 w-48 h-auto rounded border"
                        />
                    )}
                </div>

                <div>
                    <label className="block mb-1 font-medium">Blog Content</label>
                    <JoditEditor
                        ref={editor}
                        value={content}
                        tabIndex={1}
                        onBlur={(newContent) => setContent(newContent)}
                    />
                </div>

                <button
                    type="submit"
                    className="btn bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded"
                >
                    Create
                </button>
            </form>
        </div>
    );
};

export default AddBlog;
