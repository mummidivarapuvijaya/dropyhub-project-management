import React from 'react';
import { Calendar, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TaskCard = ({ task, onStatusChange, onEdit, onDelete }) => {
  const { user } = useAuth();
  const canEdit = user?.role !== 'Team Member' || task.assignedTo?._id === user?.id || task.createdBy?._id === user?.id;

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'High':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Medium':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'In Progress':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'In Review':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="glass-card rounded-2xl p-4 transition-all duration-200 hover:border-gray-300 dark:hover:border-slate-700/80">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${getPriorityBadge(task.priority)}`}>
          {task.priority} Priority
        </span>
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task._id, e.target.value)}
          disabled={!canEdit}
          className={`text-xs font-medium px-2 py-0.5 rounded-md border bg-white dark:bg-slate-900 cursor-pointer focus:outline-none ${getStatusBadge(
            task.status
          )}`}
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="In Review">In Review</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <h4 className="font-semibold text-gray-900 dark:text-slate-200 text-sm mb-1 line-clamp-2">{task.title}</h4>

      {task.description && (
        <p className="text-xs text-gray-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">{task.description}</p>
      )}

      <div className="text-[11px] text-gray-500 dark:text-slate-400 mb-3 bg-gray-100 dark:bg-slate-950/40 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-slate-800/50 flex items-center justify-between">
        <span className="truncate text-gray-500 dark:text-slate-400">Proj: <span className="text-indigo-600 dark:text-indigo-400 font-medium">{task.project?.title || 'Unknown'}</span></span>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-slate-800/80 text-xs">
        <div className="flex items-center space-x-1.5">
          {task.assignedTo ? (
            <>
              <img
                src={task.assignedTo.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assignedTo.name}`}
                alt={task.assignedTo.name}
                className="w-5 h-5 rounded-full border border-gray-200 dark:border-slate-700 object-cover"
              />
              <span className="text-gray-700 dark:text-slate-300 text-[11px] font-medium truncate max-w-[90px]">{task.assignedTo.name}</span>
            </>
          ) : (
            <span className="text-gray-400 dark:text-slate-500 text-[11px] italic">Unassigned</span>
          )}
        </div>

        <div className="flex items-center space-x-2 text-[11px] text-gray-500 dark:text-slate-400">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3 text-gray-400 dark:text-slate-500" />
            <span>{formatDate(task.dueDate)}</span>
          </div>

          {canEdit && (
            <div className="flex items-center space-x-1 pl-1">
              <button
                onClick={() => onEdit(task)}
                className="p-1 text-gray-400 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded transition-colors"
              >
                <Edit2 className="w-3 h-3" />
              </button>
              <button
                onClick={() => onDelete(task._id)}
                className="p-1 text-gray-400 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-800 rounded transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
