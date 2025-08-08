import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import JoditEditor from "jodit-react";
import useAxios from "../../../hooks/useAxios";
import toast from "react-hot-toast";

const EditBlog = () => {
    const { id } = useParams();
    console.log(id)
    const navigate = useNavigate();
    const axiosSecure = useAxios();
    const editor = useRef(null);

    const [title, setTitle] = useState("");
    const [imageURL, setImageURL] = useState("");
    const [content, setContent] = useState("");
    const [uploading, setUploading] = useState(false);

    const imgbbKey = "5c7d7322055e41849d14bf3be478e1c8";

    useEffect(() => {
        axiosSecure.get(`/blogs/${id}`).then((res) => {
            const blog = res.data;
            setTitle(blog.title);
            console.log(blog)
            setImageURL(blog.thumbnail);
            setContent(blog.content);
        });
    }, [id, axiosSecure]);

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
            }
        } catch (error) {
            toast.error("Image upload error");
        } finally {
            setUploading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!title || !imageURL || !content) {
            toast.error("All fields are required");
            return;
        }

        const updatedBlog = {
            title,
            thumbnail: imageURL,
            content,
        };

        try {
            const res = await axiosSecure.patch(`/blogs/${id}`, updatedBlog);
            if (res.data.modifiedCount > 0) {
                toast.success("Blog updated successfully");
                navigate("/dashboard/content-management");
            } else {
                toast.error("No changes made");
            }
        } catch (error) {
            toast.error("Update failed");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-8">
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => navigate("/dashboard/content-management")}
                    className="btn btn-outline btn-sm text-primary"
                >
                    &larr; Cancel
                </button>

                <h2 className="text-2xl font-bold text-primary">Update Blog</h2>

                <div></div>
            </div>

            <form onSubmit={handleUpdate} className="space-y-5">
                <div>
                    <label className="block mb-1 font-medium">Title</label>
                    <input
                        type="text"
                        defaultValue={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:ring-red-200"
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
                        defaultValue={content}
                        tabIndex={1}
                        onBlur={(newContent) => setContent(newContent)}
                    />
                </div>

                <button
                    type="submit"
                    className="btn bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded"
                >
                    Update
                </button>
            </form>
        </div>
    );
};

export default EditBlog;