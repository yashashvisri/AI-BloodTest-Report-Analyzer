import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const ROLE_BADGE = {
  admin: "bg-purple-100 text-purple-800",
  doctor: "bg-blue-100 text-blue-800",
  patient: "bg-gray-100 text-gray-700",
};

const STATUS_BADGE = {
  active: "bg-emerald-100 text-emerald-800",
  suspended: "bg-amber-100 text-amber-800",
  banned: "bg-red-100 text-red-800",
};

function StatCard({ label, value, icon, color }) {
  return (
    <div className={`bg-white rounded-2xl border ${color} p-5 flex items-center gap-4`}>
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-3xl font-black text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function RoleModal({ user, onClose, onUpdate }) {
  const [role, setRole] = useState(user.role);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.put(`/admin/users/${user.id}/role`, { role });
      toast.success(`Role updated to ${role}`);
      onUpdate();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to update role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Change Role</h3>
        <p className="text-gray-500 text-sm mb-6">Update role for <strong>{user.username}</strong></p>
        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-6 focus:ring-2 focus:ring-purple-500 outline-none"
        >
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
          <option value="admin">Admin</option>
        </select>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition">Cancel</button>
          <button onClick={handleSubmit} disabled={loading} className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 disabled:bg-gray-400 transition">
            {loading ? "Saving..." : "Update Role"}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusModal({ user, onClose, onUpdate }) {
  const [userStatus, setUserStatus] = useState(user.is_active || "active");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.put(`/admin/users/${user.id}/status`, { status: userStatus });
      toast.success(`Status updated to ${userStatus}`);
      onUpdate();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Account Status</h3>
        <p className="text-gray-500 text-sm mb-6">Manage account status for <strong>{user.username}</strong></p>
        <select
          value={userStatus}
          onChange={e => setUserStatus(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-6 focus:ring-2 focus:ring-amber-500 outline-none"
        >
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="banned">Banned</option>
        </select>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition">Cancel</button>
          <button onClick={handleSubmit} disabled={loading} className="flex-1 px-4 py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 disabled:bg-gray-400 transition">
            {loading ? "Saving..." : "Update Status"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ user, onClose, onUpdate }) {
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/admin/users/${user.id}`);
      toast.success(`User ${user.username} deleted permanently`);
      onUpdate();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-red-700 mb-2">Delete User</h3>
        <p className="text-gray-500 text-sm mb-4">
          This will permanently delete <strong>{user.username}</strong> and all their reports, analyses, and uploaded files. This cannot be undone.
        </p>
        <p className="text-sm text-gray-600 mb-2">Type <strong>DELETE</strong> to confirm:</p>
        <input
          type="text"
          value={confirmText}
          onChange={e => setConfirmText(e.target.value)}
          placeholder="Type DELETE"
          className="w-full border border-red-200 rounded-xl px-4 py-3 mb-6 focus:ring-2 focus:ring-red-500 outline-none"
        />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition">Cancel</button>
          <button
            onClick={handleDelete}
            disabled={loading || confirmText !== "DELETE"}
            className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 disabled:bg-gray-400 transition"
          >
            {loading ? "Deleting..." : "Delete Forever"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [roleModal, setRoleModal] = useState(null);
  const [statusModal, setStatusModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    if (user && user.role !== "admin") {
      toast.error("Admin access required");
      navigate("/");
    }
  }, [user]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/users?search=${debouncedSearch}&role=${roleFilter}&status_filter=${statusFilter}&page=${page}&limit=15`);
      setUsers(res.data.users);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [debouncedSearch, roleFilter, statusFilter, page]);

  useEffect(() => {
    fetchStats();
  }, []);

  const refresh = () => {
    fetchUsers();
    fetchStats();
  };

  return (
    <div className="py-10 px-6 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
          <span className="bg-purple-100 text-purple-700 p-2 rounded-xl">&#x1f6e1;&#xfe0f;</span>
          Admin Panel
        </h1>
        <p className="text-gray-500 font-medium mt-1">Manage users, roles, and platform health.</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          <StatCard label="Total Users" value={stats.total_users} icon="&#x1f465;" color="border-gray-100" />
          <StatCard label="Patients" value={stats.total_patients} icon="&#x1f9d1;&#x200d;&#x2695;&#xfe0f;" color="border-emerald-100" />
          <StatCard label="Doctors" value={stats.total_doctors} icon="&#x1f3e5;" color="border-blue-100" />
          <StatCard label="Reports" value={stats.total_reports} icon="&#x1f4cb;" color="border-teal-100" />
          <StatCard label="Banned" value={stats.banned_users} icon="&#x1f6ab;" color="border-red-100" />
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name, username, or email..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-purple-500 outline-none"
        />
        <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-purple-500 outline-none bg-white">
          <option value="all">All Roles</option>
          <option value="patient">Patients</option>
          <option value="doctor">Doctors</option>
          <option value="admin">Admins</option>
        </select>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-purple-500 outline-none bg-white">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="banned">Banned</option>
        </select>
      </div>

      {/* User Table */}
      <div className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden relative min-h-[300px]">
        {loading && (
          <div className="absolute inset-0 bg-white/60 flex justify-center items-center backdrop-blur-sm z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        )}

        {users.length === 0 && !loading ? (
          <div className="p-16 text-center">
            <p className="text-5xl mb-4">&#x1f50d;</p>
            <h3 className="text-lg font-bold text-gray-700">No users found</h3>
            <p className="text-gray-500 mt-1">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-100 text-gray-500 uppercase text-xs font-bold tracking-wider">
                  <th className="py-4 px-5">ID</th>
                  <th className="py-4 px-5">User</th>
                  <th className="py-4 px-5">Email</th>
                  <th className="py-4 px-5">Role</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-gray-50 last:border-0 hover:bg-purple-50/30 transition-colors">
                    <td className="py-4 px-5 font-semibold text-gray-500">#{u.id}</td>
                    <td className="py-4 px-5">
                      <p className="font-bold text-gray-800">{u.username}</p>
                      {u.name && u.name !== u.username && <p className="text-xs text-gray-400">{u.name}</p>}
                    </td>
                    <td className="py-4 px-5 text-sm text-gray-600">{u.email}</td>
                    <td className="py-4 px-5">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${ROLE_BADGE[u.role] || ROLE_BADGE.patient}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_BADGE[u.is_active] || STATUS_BADGE.active}`}>
                        {u.is_active || "active"}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setRoleModal(u)} className="text-xs font-bold text-purple-600 hover:text-purple-800 px-2 py-1 rounded hover:bg-purple-50 transition" title="Change Role">Role</button>
                        <button onClick={() => setStatusModal(u)} className="text-xs font-bold text-amber-600 hover:text-amber-800 px-2 py-1 rounded hover:bg-amber-50 transition" title="Change Status">Status</button>
                        <button onClick={() => setDeleteModal(u)} className="text-xs font-bold text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50 transition" title="Delete User">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-between items-center">
        <p className="text-sm text-gray-500 font-medium">
          Showing {users.length} of {total} users (Page {page})
        </p>
        <div className="flex gap-2">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 border border-gray-200 rounded-lg bg-white disabled:opacity-50 hover:bg-slate-50 transition font-medium">
            Previous
          </button>
          <button disabled={users.length < 15} onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 border border-gray-200 rounded-lg bg-white disabled:opacity-50 hover:bg-slate-50 transition font-medium">
            Next
          </button>
        </div>
      </div>

      {/* Modals */}
      {roleModal && <RoleModal user={roleModal} onClose={() => setRoleModal(null)} onUpdate={refresh} />}
      {statusModal && <StatusModal user={statusModal} onClose={() => setStatusModal(null)} onUpdate={refresh} />}
      {deleteModal && <DeleteModal user={deleteModal} onClose={() => setDeleteModal(null)} onUpdate={refresh} />}
    </div>
  );
}
