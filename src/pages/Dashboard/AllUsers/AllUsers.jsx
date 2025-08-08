import React, { useEffect, useState } from 'react';
import useAxios from '../../../hooks/useAxios';
import useAuth from '../../../hooks/useAuth';

const AllUsers = () => {
    const { user: firebaseUser } = useAuth();
    const axiosSecure = useAxios();
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        axiosSecure
            .get('/users')
            .then((res) => setUsers(res.data))
            .catch((err) => console.error(err));
    }, [axiosSecure]);

    const loggedInUser = users.find((u) => u.email === firebaseUser?.email);
    const loggedInRole = loggedInUser?.role;

    // Hide admins for volunteers and donors
    const filteredUsers = users
        .filter((user) => {
            if (loggedInRole !== 'admin' && user.role === 'admin') return false;
            return true;
        })
        .filter((user) => {
            if (filter === 'all') return true;
            return user.status === filter;
        });

    const handleRoleChange = (id, newRole) => {
        if (!id || typeof id !== 'string') {
            console.error('Invalid user id:', id);
            return;
        }
        axiosSecure.patch(`/users/${id}`, { role: newRole }).then((res) => console.log(res.data));
        setUsers((prev) =>
            prev.map((user) => (user._id === id ? { ...user, role: newRole } : user))
        );
    };

    const handleStatusToggle = (id, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
        try {
            axiosSecure.patch(`/users/${id}`, { status: newStatus });
            setUsers((prev) =>
                prev.map((user) => (user._id === id ? { ...user, status: newStatus } : user))
            );
        } catch (err) {
            console.error('Failed to toggle status', err);
        }
    };

    const getRoleClass = (role) => {
        switch (role) {
            case 'admin':
                return 'bg-purple-100 border-purple-400 text-purple-700';
            case 'donor':
                return 'bg-blue-100 border-blue-400 text-blue-700';
            case 'volunteer':
                return 'bg-yellow-100 border-yellow-400 text-yellow-700';
            default:
                return 'bg-gray-100 border-gray-300 text-gray-700';
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">All Users</h2>

            <div className="mb-4">
                <label className="font-medium mr-2">Filter by status:</label>
                <select
                    className="border p-2 rounded"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="blocked">Blocked</option>
                </select>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 bg-white rounded shadow">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                Avatar
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredUsers.map((user) => {
                            let roleOptions = [];
                            let isDropdownBlocked = false;

                            if (loggedInRole === 'admin') {
                                roleOptions = ['admin', 'donor', 'volunteer'];
                            } else if (loggedInRole === 'volunteer') {
                                roleOptions = ['donor', 'volunteer'];
                                if (user.role === 'admin') {
                                    isDropdownBlocked = true;
                                    roleOptions = ['admin'];
                                }
                            } else {
                                roleOptions = [user.role];
                                isDropdownBlocked = true;
                            }

                            return (
                                <tr key={user._id}>
                                    <td className="px-6 py-4">
                                        <img
                                            className="w-10 h-10 rounded-full"
                                            src={user.image || `https://i.pravatar.cc/150?u=${user.email}`}
                                            alt="avatar"
                                        />
                                    </td>
                                    <td className="px-6 py-4">{user.name}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4 capitalize">
                                        <select
                                            disabled={isDropdownBlocked}
                                            className={`border px-2 py-1 rounded capitalize ${isDropdownBlocked
                                                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                                    : getRoleClass(user.role)
                                                }`}
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                        >
                                            {roleOptions.map((role) => (
                                                <option key={role} value={role}>
                                                    {role}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() =>
                                                loggedInRole === 'admin' && handleStatusToggle(user._id, user.status)
                                            }
                                            disabled={loggedInRole !== 'admin'}
                                            className={`px-3 py-1 rounded font-medium border ${user.status === 'active'
                                                    ? 'bg-green-100 border-green-400 text-green-700 hover:bg-green-200'
                                                    : 'bg-red-100 border-red-400 text-red-700 hover:bg-red-200'
                                                } ${loggedInRole !== 'admin' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {user.status === 'active' ? 'Active' : 'Blocked'}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {filteredUsers.length === 0 && (
                    <p className="text-center text-gray-500 mt-6">No users found.</p>
                )}
            </div>
        </div>
    );
};

export default AllUsers;
