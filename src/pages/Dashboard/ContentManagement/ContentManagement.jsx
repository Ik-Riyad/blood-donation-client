import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useAxios from "../../../hooks/useAxios";
import useAuth from "../../../hooks/useAuth";
import toast from "react-hot-toast";
import { FaEdit, FaTrash, FaUpload, FaUndo } from "react-icons/fa";

const ContentManagement = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxios();
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [role, setRole] = useState("");
  const [filter, setFilter] = useState("all");

  // Fetch role of logged-in user
  useEffect(() => {
    if (user?.email) {
      axiosSecure.get(`/usersMatchByEmail?email=${user.email}`).then((res) => {
        setRole(res.data.role);
      });
    }
  }, [user]);

  // Fetch all blogs
  useEffect(() => {
    axiosSecure.get("/blogs").then((res) => setBlogs(res.data));
  }, [axiosSecure]);

  // Actions
  const handlePublish = async (id) => {
    try {
      await axiosSecure.patch(`/blogs/publish/${id}`);
      toast.success("Blog published");
      refreshBlogs();
    } catch (err) {
      toast.error("Failed to publish blog");
    }
  };

  const handleUnpublish = async (id) => {
    try {
      await axiosSecure.patch(`/blogs/unpublish/${id}`);
      toast.success("Blog unpublished");
      refreshBlogs();
    } catch (err) {
      toast.error("Failed to unpublish blog");
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this blog?");
    if (!confirm) return;

    try {
      await axiosSecure.delete(`/blogs/${id}`);
      toast.success("Blog deleted");
      refreshBlogs();
    } catch (err) {
      toast.error("Failed to delete blog");
    }
  };

  const refreshBlogs = async () => {
    const res = await axiosSecure.get("/blogs");
    setBlogs(res.data);
  };

  const filteredBlogs =
    filter === "all" ? blogs : blogs.filter((blog) => blog.status === filter);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Blog Management</h2>
        <button
          onClick={() => navigate("/dashboard/content-management/add-blog")}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded shadow cursor-pointer"
        >
          Add Blog
        </button>
      </div>

      <div className="mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="select select-bordered w-full max-w-xs"
        >
          <option value="all">All</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white p-4 shadow rounded">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBlogs.map((blog) => (
              <tr key={blog._id}>
                <td>{blog.title}</td>
                <td>
                  <span
                    className={`badge ${blog.status === "published"
                      ? "badge-success"
                      : "badge-warning"
                      }`}
                  >
                    {blog.status}
                  </span>
                </td>
                <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                <td className="space-x-2 flex items-center">
                  {/* Admin only: Publish/Unpublish */}
                  {role === "admin" && blog.status === "draft" && (
                    <button
                      onClick={() => handlePublish(blog._id)}
                      className="btn btn-success btn-sm tooltip"
                      data-tip="Publish"
                    >
                      <FaUpload />
                    </button>
                  )}

                  {role === "admin" && blog.status === "published" && (
                    <button
                      onClick={() => handleUnpublish(blog._id)}
                      className="btn btn-warning btn-sm tooltip"
                      data-tip="Unpublish"
                    >
                      <FaUndo />
                    </button>
                  )}

                  {/* Admin or Volunteer: Edit */}
                  {(role === "admin" || role === "volunteer") && (
                    <button
                      onClick={() => navigate(`/dashboard/content-management/edit/${blog._id}`)}
                      className="btn btn-info btn-sm tooltip"
                      data-tip="Edit"
                    >
                      <FaEdit />
                    </button>
                  )}

                  {/* Admin only: Delete */}
                  {role === "admin" && (
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="btn btn-error btn-sm tooltip"
                      data-tip="Delete"
                    >
                      <FaTrash />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredBlogs.length === 0 && (
          <p className="text-gray-500 text-center mt-4">No blogs found.</p>
        )}
      </div>
    </div>
  );
};

export default ContentManagement;
