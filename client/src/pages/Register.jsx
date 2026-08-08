import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Layers,
  Lock,
  Mail,
  User,
  AlertCircle,
  ArrowRight,
  FolderKanban,
  ListChecks,
  Users as UsersIcon,
  ShieldCheck
} from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Check details or try another email.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: FolderKanban,
      title: 'Organize Projects',
      desc: 'Structure your work into projects with clear goals and deadlines.'
    },
    {
      icon: ListChecks,
      title: 'Track Tasks & Progress',
      desc: 'Set priorities, assign tasks, and track progress in real time.'
    },
    {
      icon: UsersIcon,
      title: 'Collaborate with Your Team',
      desc: 'Invite team members and work together seamlessly.'
    },
    {
      icon: ShieldCheck,
      title: 'Role-Based Access Control',
      desc: 'Admin, Manager, and Member roles with granular permissions.'
    }
  ];

  return (
    <div className="min-h-screen flex bg-[#0a0e1a]">
      {/* LEFT HALF — Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 min-h-screen relative overflow-y-auto items-center justify-center p-8 xl:p-12">
        {/* Background gradient layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f1629] via-[#131b36] to-[#1a1145]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[80px]" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-xl my-auto space-y-6">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">DropyHub</h2>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">Project Management</p>
            </div>
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight mb-2">
              Start managing your{' '}
              <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
                work smarter.
              </span>
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed max-w-md">
              Manage projects, assign tasks, and collaborate with your team — all in one streamlined workspace built for modern teams.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="space-y-3.5 pt-2">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="flex items-start space-x-3.5 group">
                  <div className="mt-0.5 w-9 h-9 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center shrink-0 group-hover:bg-purple-500/20 group-hover:border-purple-500/30 transition-colors">
                    <Icon className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{f.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Kanban / Project Illustration */}
          <div className="relative max-w-md pt-2">
            <div className="bg-white/[0.04] border border-white/15 rounded-2xl p-4 backdrop-blur-sm shadow-xl">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                <div className="ml-3 h-3 w-20 bg-white/15 rounded" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1.5">
                  <div className="h-2 w-12 bg-amber-400/40 rounded mx-auto" />
                  <div className="bg-amber-500/15 border border-amber-500/20 rounded-lg p-2 space-y-1">
                    <div className="h-1.5 w-full bg-white/20 rounded" />
                    <div className="h-1.5 w-3/4 bg-white/10 rounded" />
                  </div>
                  <div className="bg-amber-500/15 border border-amber-500/20 rounded-lg p-2 space-y-1">
                    <div className="h-1.5 w-full bg-white/20 rounded" />
                    <div className="h-1.5 w-2/3 bg-white/10 rounded" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="h-2 w-12 bg-blue-400/40 rounded mx-auto" />
                  <div className="bg-blue-500/15 border border-blue-500/20 rounded-lg p-2 space-y-1">
                    <div className="h-1.5 w-full bg-white/20 rounded" />
                    <div className="h-1.5 w-4/5 bg-white/10 rounded" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="h-2 w-12 bg-emerald-400/40 rounded mx-auto" />
                  <div className="bg-emerald-500/15 border border-emerald-500/20 rounded-lg p-2 space-y-1">
                    <div className="h-1.5 w-full bg-white/20 rounded" />
                    <div className="h-1.5 w-3/5 bg-white/10 rounded" />
                  </div>
                  <div className="bg-emerald-500/15 border border-emerald-500/20 rounded-lg p-2 space-y-1">
                    <div className="h-1.5 w-full bg-white/20 rounded" />
                    <div className="h-1.5 w-1/2 bg-white/10 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT HALF — Register Form */}
      <div className="w-full lg:w-1/2 min-h-screen flex flex-col items-center justify-center p-6 sm:p-10 lg:p-12 relative overflow-y-auto">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a] via-[#0d1222] to-[#0f152a] lg:bg-gradient-to-br lg:from-[#0d1224] lg:via-[#101828] lg:to-[#141d33]" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/5 rounded-full blur-[100px]" />

        <div className="relative z-10 w-full max-w-sm my-auto">
          {/* Mobile Logo */}
          <div className="flex items-center justify-center space-x-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">DropyHub</h2>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-1.5">Create your account 🚀</h2>
            <p className="text-sm text-slate-400">Join DropyHub and get started</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all hover:border-white/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all hover:border-white/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all hover:border-white/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-2.5 rounded-xl shadow-lg shadow-indigo-600/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 mt-1 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Sign in link */}
          <p className="text-center text-sm text-slate-400 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
