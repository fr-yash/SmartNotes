import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analytics');
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [suspensionRequests, setSuspensionRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newLimit, setNewLimit] = useState('');
  const [responseText, setResponseText] = useState('');

  // Check if user is admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Fetch data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (activeTab === 'analytics') {
          const data = await adminAPI.getAnalytics();
          setAnalytics(data);
        } else if (activeTab === 'users') {
          const data = await adminAPI.getAllUsers();
          setUsers(data);
        } else if (activeTab === 'suspension-requests') {
          const data = await adminAPI.getSuspensionRequests();
          setSuspensionRequests(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const handleToggleUserStatus = async (userId) => {
    try {
      await adminAPI.toggleUserStatus(userId);
      // Refresh users list
      const data = await adminAPI.getAllUsers();
      setUsers(data);
    } catch (err) {
      alert('Error updating user status: ' + err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await adminAPI.deleteUser(userId);
        const data = await adminAPI.getAllUsers();
        setUsers(data);
      } catch (err) {
        alert('Error deleting user: ' + err.message);
      }
    }
  };

  const handleUpdateAILimit = async (userId) => {
    if (!newLimit || newLimit < 0) {
      alert('Please enter a valid limit');
      return;
    }
    try {
      await adminAPI.updateAILimit(userId, parseInt(newLimit));
      const data = await adminAPI.getAllUsers();
      setUsers(data);
      setSelectedUser(null);
      setNewLimit('');
    } catch (err) {
      alert('Error updating AI limit: ' + err.message);
    }
  };

  const handlePromoteToAdmin = async (userId) => {
    try {
      await adminAPI.promoteToAdmin(userId);
      const data = await adminAPI.getAllUsers();
      setUsers(data);
    } catch (err) {
      alert('Error promoting user: ' + err.message);
    }
  };

  const handleDemoteToUser = async (userId) => {
    try {
      await adminAPI.demoteToUser(userId);
      const data = await adminAPI.getAllUsers();
      setUsers(data);
    } catch (err) {
      alert('Error demoting user: ' + err.message);
    }
  };

  const handleApproveSuspensionRequest = async (requestId) => {
    if (!responseText.trim()) {
      alert('Please provide a response');
      return;
    }
    try {
      await adminAPI.approveSuspensionRequest(requestId, responseText);
      const data = await adminAPI.getSuspensionRequests();
      setSuspensionRequests(data);
      setResponseText('');
    } catch (err) {
      alert('Error approving request: ' + err.message);
    }
  };

  const handleRejectSuspensionRequest = async (requestId) => {
    if (!responseText.trim()) {
      alert('Please provide a response');
      return;
    }
    try {
      await adminAPI.rejectSuspensionRequest(requestId, responseText);
      const data = await adminAPI.getSuspensionRequests();
      setSuspensionRequests(data);
      setResponseText('');
    } catch (err) {
      alert('Error rejecting request: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, analytics, and system settings</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 overflow-x-auto">
          {['analytics', 'users', 'suspension-requests'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium transition-colors capitalize whitespace-nowrap ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'suspension-requests' ? 'Appeals' : tab}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 border border-red-200">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : (
          <>
            {/* Analytics Tab */}
            {activeTab === 'analytics' && analytics && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <p className="text-gray-600 text-sm mb-2">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.totalUsers}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <p className="text-gray-600 text-sm mb-2">Active Users</p>
                  <p className="text-3xl font-bold text-green-600">{analytics.activeUsers}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <p className="text-gray-600 text-sm mb-2">Suspended Users</p>
                  <p className="text-3xl font-bold text-red-600">{analytics.suspendedUsers}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <p className="text-gray-600 text-sm mb-2">Admin Users</p>
                  <p className="text-3xl font-bold text-blue-600">{analytics.adminUsers}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <p className="text-gray-600 text-sm mb-2">Total Notes</p>
                  <p className="text-3xl font-bold text-purple-600">{analytics.totalNotes}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <p className="text-gray-600 text-sm mb-2">AI Requests Today</p>
                  <p className="text-3xl font-bold text-orange-600">{analytics.totalAIRequests}</p>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Role</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">AI Limit</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">{u.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              u.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {u.isActive ? 'Active' : 'Suspended'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{u.aiRequestsLimit}</td>
                          <td className="px-6 py-4 text-sm space-x-2">
                            <button
                              onClick={() => handleToggleUserStatus(u._id)}
                              className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 text-xs"
                            >
                              {u.isActive ? 'Suspend' : 'Activate'}
                            </button>
                            {u.role === 'user' ? (
                              <button
                                onClick={() => handlePromoteToAdmin(u._id)}
                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs"
                              >
                                Promote
                              </button>
                            ) : (
                              <button
                                onClick={() => handleDemoteToUser(u._id)}
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-xs"
                              >
                                Demote
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Suspension Requests Tab */}
            {activeTab === 'suspension-requests' && (
              <div className="space-y-6">
                {suspensionRequests.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-200">
                    <p className="text-gray-600">No suspension appeals at this time</p>
                  </div>
                ) : (
                  suspensionRequests.map((request) => (
                    <div key={request._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{request.userName}</h3>
                          <p className="text-sm text-gray-600">{request.userEmail}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Submitted: {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          request.status === 'approved' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </div>

                      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-2">User's Appeal:</p>
                        <p className="text-gray-600 text-sm">{request.reason}</p>
                      </div>

                      {request.adminResponse && (
                        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm font-medium text-blue-900 mb-2">Admin Response:</p>
                          <p className="text-blue-800 text-sm">{request.adminResponse}</p>
                        </div>
                      )}

                      {request.status === 'pending' && (
                        <div className="space-y-3">
                          <textarea
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                            placeholder="Enter your response..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            rows="3"
                          />
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleApproveSuspensionRequest(request._id)}
                              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                            >
                              Approve & Reactivate
                            </button>
                            <button
                              onClick={() => handleRejectSuspensionRequest(request._id)}
                              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

