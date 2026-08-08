import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  CheckSquare,
  Users,
  AlertTriangle,
  Plus
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Dashboard = () => {
  const { theme } = useTheme();
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState({ projectStatus: [], taskPriority: [] });
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await API.get('/dashboard/stats');
      if (res.data.success) {
        setStats(res.data.stats);
        setCharts(res.data.charts);
        setRecentProjects(res.data.recentProjects || []);
        setRecentTasks(res.data.recentTasks || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="p-6 md:p-8 space-y-8 overflow-y-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Overview Dashboard</h1>
              <p className="text-sm text-gray-500 dark:text-slate-400">Track project health, task metrics, and team capacity</p>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                to="/projects"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>New Project</span>
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="py-20 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="glass-card rounded-2xl p-4 border border-slate-800/80 hover:border-indigo-500/30 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Total Projects</span>
                    <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
                      <FolderKanban className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">{stats?.totalProjects || 0}</div>
                  <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-medium mt-1 inline-block">Workspace Total</span>
                </div>

                <div className="glass-card rounded-2xl p-4 border border-slate-800/80 hover:border-emerald-500/30 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active Projects</span>
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-emerald-400">{stats?.activeProjects || 0}</div>
                  <span className="text-[10px] text-emerald-500 font-medium mt-1 inline-block">In Execution</span>
                </div>

                <div className="glass-card rounded-2xl p-4 border border-slate-800/80 hover:border-blue-500/30 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Completed Projects</span>
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-blue-400">{stats?.completedProjects || 0}</div>
                  <span className="text-[10px] text-blue-500 font-medium mt-1 inline-block">Delivered</span>
                </div>

                <div className="glass-card rounded-2xl p-4 border border-slate-800/80 hover:border-amber-500/30 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Pending Tasks</span>
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-amber-400">{stats?.pendingTasks || 0}</div>
                  <span className="text-[10px] text-amber-500 font-medium mt-1 inline-block">Requires Attention</span>
                </div>

                <div className="glass-card rounded-2xl p-4 border border-slate-800/80 hover:border-violet-500/30 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Completed Tasks</span>
                    <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400">
                      <CheckSquare className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-violet-400">{stats?.completedTasks || 0}</div>
                  <span className="text-[10px] text-violet-500 font-medium mt-1 inline-block">Resolved</span>
                </div>

                <div className="glass-card rounded-2xl p-4 border border-slate-800/80 hover:border-purple-500/30 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Team Members</span>
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-purple-400">{stats?.totalTeamMembers || 0}</div>
                  <span className="text-[10px] text-purple-500 font-medium mt-1 inline-block">Active Contributors</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card rounded-3xl p-6">
                  <h3 className="text-base font-bold text-gray-900 dark:text-slate-200 mb-1">Project Status Breakdown</h3>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mb-6">Distribution across status pipelines</p>
                  <div className="h-64 w-full">
                    {charts.projectStatus && charts.projectStatus.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={charts.projectStatus}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {charts.projectStatus.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={
                              theme === 'dark' 
                                ? { backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }
                                : { backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a' }
                            }
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs text-slate-500">No project data recorded</div>
                    )}
                  </div>
                </div>

                <div className="glass-card rounded-3xl p-6">
                  <h3 className="text-base font-bold text-gray-900 dark:text-slate-200 mb-1">Task Priority Distribution</h3>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mb-6">Tasks grouped by urgency priority</p>
                  <div className="h-64 w-full">
                    {charts.taskPriority && charts.taskPriority.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={charts.taskPriority}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                          <YAxis stroke="#94a3b8" fontSize={12} />
                          <Tooltip
                            contentStyle={
                              theme === 'dark' 
                                ? { backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }
                                : { backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a' }
                            }
                          />
                          <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs text-slate-500">No task priority data</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-gray-900 dark:text-slate-200">Recent Projects</h3>
                    <Link to="/projects" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">View All →</Link>
                  </div>

                  <div className="space-y-3">
                    {recentProjects.length > 0 ? (
                      recentProjects.map((p) => (
                        <Link
                          key={p._id}
                          to={`/projects/${p._id}`}
                          className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-900/60 border border-gray-200 dark:border-slate-800/60 hover:border-indigo-500/30 transition-all group"
                        >
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {p.title}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-slate-400 line-clamp-1">{p.description || 'No description'}</p>
                          </div>
                          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full border bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700">
                            {p.status}
                          </span>
                        </Link>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 py-4 text-center">No recent projects</p>
                    )}
                  </div>
                </div>

                <div className="glass-card rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-gray-900 dark:text-slate-200">Upcoming Tasks</h3>
                    <Link to="/tasks" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">View All →</Link>
                  </div>

                  <div className="space-y-3">
                    {recentTasks.length > 0 ? (
                      recentTasks.map((t) => (
                        <div
                          key={t._id}
                          className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-900/60 border border-gray-200 dark:border-slate-800/60"
                        >
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-slate-200">{t.title}</h4>
                            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{t.project?.title}</span>
                          </div>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md border bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700">
                            {t.priority}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 py-4 text-center">No upcoming tasks</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
