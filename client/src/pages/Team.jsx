import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Pagination from '../components/Pagination';
import { useAuth } from '../context/AuthContext';
import { Shield, Search } from 'lucide-react';

const Team = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, [page, search, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (roleFilter !== 'All') params.role = roleFilter;

      const res = await API.get('/users', { params });
      if (res.data.success) {
        setUsers(res.data.data);
        setTotalPages(res.data.pages);
        setTotalItems(res.data.total);
      }
    } catch (err) {
      console.error('Error fetching users', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await API.put(`/users/${userId}/role`, { role: newRole });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update user role');
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Admin':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Project Manager':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onSearch={(val) => { setSearch(val); setPage(1); }} />
        <main className="p-6 md:p-8 space-y-6 overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Team Members & RBAC</h1>
              <p className="text-sm text-gray-500 dark:text-slate-400">View team members, assign workspace permissions & roles</p>
            </div>
            {currentUser?.role === 'Admin' && (
              <div className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-400 flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Admin Permissions Active: Role Editor Enabled</span>
              </div>
            )}
          </div>

          <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search team members by name or email..."
                className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-900 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">Role Filter:</span>
              {['All', 'Admin', 'Project Manager', 'Team Member'].map((r) => (
                <button
                  key={r}
                  onClick={() => { setRoleFilter(r); setPage(1); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                    roleFilter === r
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-800 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="py-20 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="glass-card rounded-3xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-700 dark:text-slate-300">
                  <thead className="bg-gray-50 dark:bg-slate-900/80 border-b border-gray-200 dark:border-slate-800 text-gray-500 dark:text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                    <tr>
                      <th className="px-6 py-4">User Info</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Current Role</th>
                      <th className="px-6 py-4 text-right">RBAC Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-slate-800/60">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-slate-900/40 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`}
                              alt={u.name}
                              className="w-8 h-8 rounded-full border border-gray-200 dark:border-slate-700 object-cover bg-white"
                            />
                            <div>
                              <div className="font-semibold text-gray-900 dark:text-slate-200 text-sm">{u.name}</div>
                              {u._id === currentUser?.id && (
                                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">You (Logged In)</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500 dark:text-slate-400 font-mono">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full border text-[11px] font-medium ${getRoleBadgeColor(u.role)}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {currentUser?.role === 'Admin' ? (
                            <select
                              value={u.role}
                              onChange={(e) => handleRoleChange(u._id, e.target.value)}
                              disabled={u._id === currentUser?.id}
                              className="bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer disabled:opacity-50"
                            >
                              <option value="Team Member">Team Member</option>
                              <option value="Project Manager">Project Manager</option>
                              <option value="Admin">Admin</option>
                            </select>
                          ) : (
                            <span className="text-[11px] text-gray-400 dark:text-slate-500 italic">Protected</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-slate-800">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={(p) => setPage(p)}
                  totalItems={totalItems}
                  pageSize={10}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Team;
