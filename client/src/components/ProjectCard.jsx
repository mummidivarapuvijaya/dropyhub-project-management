import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const { user } = useAuth();
  const canManage = user?.role === 'Admin' || user?.role === 'Project Manager';

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Completed':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'On Hold':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <Link
            to={`/projects/${project._id}`}
            className="font-bold text-gray-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1 text-base"
          >
            {project.title}
          </Link>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium border shrink-0 ${getStatusBadge(project.status)}`}>
            {project.status}
          </span>
        </div>

        <p className="text-xs text-gray-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {project.description || 'No description provided.'}
        </p>

        <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-slate-400 mb-4 bg-gray-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-gray-200 dark:border-slate-800/60">
          <img
            src={project.manager?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${project.manager?.name || 'Manager'}`}
            alt={project.manager?.name}
            className="w-6 h-6 rounded-full border border-gray-300 dark:border-slate-700 object-cover"
          />
          <div className="truncate">
            <span className="text-[10px] text-gray-400 dark:text-slate-500 block leading-tight uppercase font-medium">Project Manager</span>
            <span className="text-gray-700 dark:text-slate-300 font-medium truncate">{project.manager?.name || 'Unassigned'}</span>
          </div>
        </div>
      </div>

      <div>
        <div className="grid grid-cols-2 gap-2 py-3 border-t border-gray-100 dark:border-slate-800/80 text-[11px] text-gray-500 dark:text-slate-400">
          <div className="flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Due: {formatDate(project.dueDate)}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Users className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>{project.teamMembers?.length || 0} Team Members</span>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-100 dark:border-slate-800/80 flex items-center justify-between">
          <Link
            to={`/projects/${project._id}`}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center space-x-1 transition-colors"
          >
            <span>View Details</span>
            <span>→</span>
          </Link>

          {canManage && (
            <div className="flex items-center space-x-1">
              <button
                onClick={() => onEdit(project)}
                className="p-1.5 text-gray-400 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors"
                title="Edit Project"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete(project._id)}
                className="p-1.5 text-gray-400 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                title="Delete Project"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
