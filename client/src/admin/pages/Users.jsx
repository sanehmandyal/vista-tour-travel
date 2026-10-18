import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/adminApi';
import { formatDate } from '../../utils/formatDate';
import { Users as UsersIcon, Search, Shield, UserX, UserCheck, Trash2 } from 'lucide-react';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers({ limit: 50 });
      if (res.success && res.data) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStatusToggle = async (user) => {
    try {
      const res = await adminApi.updateUser(user._id, { isActive: !user.isActive });
      if (res.success) {
        toast.success(`User ${!user.isActive ? 'activated' : 'deactivated'}`);
        fetchUsers();
      }
    } catch (err) {
      toast.error(err.message || 'Action failed');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await adminApi.updateUser(userId, { role: newRole });
      if (res.success) {
        toast.success(`Role updated to ${newRole}`);
        fetchUsers();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update role');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete user ${name}?`)) {
      try {
        const res = await adminApi.deleteUser(id);
        if (res.success) {
          toast.success('User deleted');
          fetchUsers();
        }
      } catch (err) {
        toast.error(err.message || 'Failed to delete');
      }
    }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.phone && u.phone.includes(search))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-navy-900 tracking-tight">Customer & User Accounts</h1>
        <p className="text-xs text-slate-500">Manage registered travel accounts, assign roles, and toggle access.</p>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-soft border border-slate-100 flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-500"
          />
        </div>
        <span className="text-xs font-semibold text-slate-400">Total Users: {filtered.length}</span>
      </div>

      {loading ? (
        <Loader text="Loading user directory..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={UsersIcon}
          title="No users found"
          description="User accounts will appear as travelers register on your site."
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                        alt={u.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
                        }}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-navy-900 text-sm">{u.name}</h4>
                        <span className="text-[11px] text-slate-400 font-mono">{u._id}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-700">{u.email}</p>
                      <p className="text-[11px] text-slate-400">{u.phone || 'No phone set'}</p>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className={`text-xs font-bold px-2 py-1 rounded-lg border focus:outline-none ${
                          u.role === 'superadmin' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                          u.role === 'admin' ? 'bg-brand-50 text-brand-700 border-brand-200' :
                          'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="superadmin">Superadmin</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {u.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleStatusToggle(u)}
                        className={`p-1.5 rounded-lg ${
                          u.isActive
                            ? 'text-amber-600 hover:bg-amber-50'
                            : 'text-emerald-600 hover:bg-emerald-50'
                        }`}
                        title={u.isActive ? 'Deactivate User' : 'Activate User'}
                      >
                        {u.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => handleDelete(u._id, u.name)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
