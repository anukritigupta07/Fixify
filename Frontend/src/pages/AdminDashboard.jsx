const AdminDashboard = () => {
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h3 className="text-base font-semibold text-gray-600">Total Users</h3>
                    <p className="text-3xl font-bold text-indigo-600 mt-1">{mockUsers.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h3 className="text-base font-semibold text-gray-600">Total Services</h3>
                    <p className="text-3xl font-bold text-green-600 mt-1">{mockServices.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h3 className="text-base font-semibold text-gray-600">Total Bookings</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-1">{mockBookings.length}</p>
                </div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">User Management</h2>
             <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <table className="min-w-full leading-normal">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Username</th>
                            <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                            <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                            <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {mockUsers.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-5 py-5 bg-transparent text-sm text-gray-900">{user.username}</td>
                                <td className="px-5 py-5 bg-transparent text-sm text-gray-600">{user.email}</td>
                                <td className="px-5 py-5 bg-transparent text-sm text-gray-600">{user.role}</td>
                                <td className="px-5 py-5 bg-transparent text-sm font-semibold">
                                    <button className="text-indigo-600 hover:text-indigo-800 mr-4">Edit</button>
                                    <button className="text-red-600 hover:text-red-800">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};