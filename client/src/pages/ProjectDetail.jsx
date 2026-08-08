import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TaskCard from '../components/TaskCard';
import Modal from '../components/Modal';
import { Plus, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);


  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Pending',
    assignedTo: '',
    dueDate: ''
  });

  useEffect(() => {
    fetchProjectDetails();
    fetchProjectTasks();
    fetchUsers();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/projects/${id}`);
      if (res.data.success) {
        setProject(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching project detail', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectTasks = async () => {
    try {
      const res = await API.get(`/tasks?project=${id}`);
      if (res.data.success) {
        setTasks(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching tasks', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get('/users');
      if (res.data.success) setAllUsers(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      await API.patch(`/tasks/${taskId}/status`, { status: newStatus });
      fetchProjectTasks();
      fetchProjectDetails();
    } catch (err) {
      alert('Failed to update task status');
    }
  };

  const handleTaskDelete = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await API.delete(`/tasks/${taskId}`);
      fetchProjectTasks();
      fetchProjectDetails();
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await API.post('/tasks', { ...taskData, project: id });
      setIsTaskModalOpen(false);
      setTaskData({
        title: '',
        description: '',
        priority: 'Medium',
        status: 'Pending',
        assignedTo: '',
        dueDate: ''
      });
      fetchProjectTasks();
      fetchProjectDetails();
    } catch (err) {
      alert('Failed to create task');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100">
        <Sidebar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100">
        <Sidebar />
        <div className="flex-1 flex flex-col p-8">
          <p className="text-gray-900 dark:text-slate-100">Project not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="p-6 md:p-8 space-y-6 overflow-y-auto">
          <Link to="/projects" className="inline-flex items-center space-x-2 text-xs font-semibold text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Projects</span>
          </Link>

          <div className="glass-card rounded-3xl p-6 border border-gray-200 dark:border-slate-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{project.title}</h1>
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium border bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20">
                    {project.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-400 max-w-2xl">{project.description}</p>
              </div>

              <button
                onClick={() => setIsTaskModalOpen(true)}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center space-x-2 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Task to Project</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-slate-800/80 text-xs">
              <div>
                <span className="text-gray-500 dark:text-slate-500 block">Project Manager</span>
                <span className="font-semibold text-gray-900 dark:text-slate-200">{project.manager?.name}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-slate-500 block">Total Tasks</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">{project.stats?.totalTasks || 0}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-slate-500 block">Completed Tasks</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{project.stats?.completedTasks || 0}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-slate-500 block">Team Members</span>
                <span className="font-semibold text-purple-600 dark:text-purple-400">{project.teamMembers?.length || 0} Members</span>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-4 border border-gray-200 dark:border-slate-800">
            <h3 className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-3">Assigned Team Members</h3>
            <div className="flex flex-wrap gap-3">
              {project.teamMembers && project.teamMembers.length > 0 ? (
                project.teamMembers.map((m) => (
                  <div key={m._id} className="flex items-center space-x-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 px-3 py-1.5 rounded-xl">
                    <img src={m.avatar} alt={m.name} className="w-5 h-5 rounded-full" />
                    <span className="text-xs text-gray-700 dark:text-slate-300 font-medium">{m.name}</span>
                    <span className="text-[10px] text-gray-400 dark:text-slate-500">({m.role})</span>
                  </div>
                ))
              ) : (
                <span className="text-xs text-gray-400 dark:text-slate-500 italic">No team members assigned</span>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Project Tasks ({tasks.length})</h2>
            {tasks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onStatusChange={handleTaskStatusChange}
                    onDelete={handleTaskDelete}
                    onEdit={() => {}}
                  />
                ))}
              </div>
            ) : (
              <div className="glass-panel rounded-2xl p-8 text-center text-xs text-gray-500 dark:text-slate-500">
                No tasks created under this project yet. Click "Add Task to Project" above.
              </div>
            )}
          </div>
        </main>
      </div>

      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title="Add Task to Project"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Task Title *
            </label>
            <input
              type="text"
              required
              value={taskData.title}
              onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
              placeholder="e.g. Write Unit Tests"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={taskData.description}
              onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
              placeholder="Task details..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Priority
              </label>
              <select
                value={taskData.priority}
                onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Assignee
              </label>
              <select
                value={taskData.assignedTo}
                onChange={(e) => setTaskData({ ...taskData, assignedTo: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none"
              >
                <option value="">Unassigned</option>
                {allUsers.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={taskData.dueDate}
              onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsTaskModalOpen(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30"
            >
              Create Task
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectDetail;
