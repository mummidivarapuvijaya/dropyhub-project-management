import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import {
  Layers,
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  FolderKanban,
  ListChecks,
  Users,
  ShieldCheck
} from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to sign in. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError('');
      try {
        await googleLogin({ access_token: tokenResponse.access_token });
        navigate('/dashboard');
      } catch (err) {
        setError(err.response?.data?.error || 'Google Authentication failed. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    onError: (errorResponse) => {
      console.error('Google OAuth error:', errorResponse);
      setError('Google Sign-In was cancelled or failed. Please try again.');
    }
  });

  const features = [
    {
      icon: FolderKanban,
      title: 'Project Management',
      desc: 'Plan, organize, and deliver projects efficiently.'
    },
    {
      icon: ListChecks,
      title: 'Task & Progress Tracking',
      desc: 'Track tasks, set priorities, and monitor progress.'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      desc: 'Collaborate with your team and stay aligned.'
    },
    {
      icon: ShieldCheck,
      title: 'Role-Based Access',
      desc: 'Secure workspace with role-based permissions.'
    }
  ];

  return (
    <div className="min-h-screen flex bg-[#0a0e1a]">
      {/* LEFT HALF — Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 min-h-screen relative overflow-y-auto items-center justify-center p-8 xl:p-12">
        {/* Background gradient layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f1629] via-[#131b36] to-[#1a1145]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[80px]" />

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
              Manage projects.{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Empower your team.
              </span>
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed max-w-md">
              DropyHub brings projects, tasks, and team collaboration together in one simple workspace.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="space-y-3.5 pt-2">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="flex items-start space-x-3.5 group">
                  <div className="mt-0.5 w-9 h-9 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center shrink-0 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/30 transition-colors">
                    <Icon className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{f.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dashboard Illustration */}
          <div className="relative max-w-md pt-2">
            <div className="bg-white/[0.04] border border-white/15 rounded-2xl p-4 backdrop-blur-sm shadow-xl">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                <div className="ml-3 h-3 w-24 bg-white/15 rounded" />
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-indigo-500/15 border border-indigo-500/20 rounded-lg p-2.5">
                  <div className="h-2 w-10 bg-indigo-400/40 rounded mb-1.5" />
                  <div className="h-4 w-6 bg-indigo-400/60 rounded font-bold" />
                </div>
                <div className="bg-emerald-500/15 border border-emerald-500/20 rounded-lg p-2.5">
                  <div className="h-2 w-8 bg-emerald-400/40 rounded mb-1.5" />
                  <div className="h-4 w-6 bg-emerald-400/60 rounded" />
                </div>
                <div className="bg-purple-500/15 border border-purple-500/20 rounded-lg p-2.5">
                  <div className="h-2 w-12 bg-purple-400/40 rounded mb-1.5" />
                  <div className="h-4 w-6 bg-purple-400/60 rounded" />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="h-2.5 w-full bg-white/10 rounded" />
                <div className="h-2.5 w-4/5 bg-white/10 rounded" />
                <div className="h-2.5 w-3/5 bg-white/10 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT HALF — Login Form */}
      <div className="w-full lg:w-1/2 min-h-screen flex flex-col items-center justify-center p-6 sm:p-10 lg:p-12 relative overflow-y-auto">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a] via-[#0d1222] to-[#0f152a] lg:bg-gradient-to-br lg:from-[#0d1224] lg:via-[#101828] lg:to-[#141d33]" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/5 rounded-full blur-[100px]" />

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
            <h2 className="text-2xl font-bold text-white mb-1.5">Welcome back 👋</h2>
            <p className="text-sm text-slate-400">Sign in to continue to DropyHub</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all hover:border-white/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold py-2.5 rounded-xl shadow-lg shadow-indigo-600/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 mt-1 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-white/10" />
            <span className="px-3 text-xs text-slate-500 font-medium">Or continue with</span>
            <div className="flex-grow border-t border-white/10" />
          </div>

          {/* Google OAuth */}
          <button
            type="button"
            onClick={() => triggerGoogleLogin()}
            disabled={loading}
            className="w-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 font-medium py-2.5 rounded-xl flex items-center justify-center space-x-3 transition-all text-sm disabled:opacity-50 hover:border-white/20 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"/>
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
              <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.4 0 15.3s.7 5.6 1.9 8l3.7-2.9c-.8-.7-1.4-1.6-1.7-2.7z"/>
              <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Sign up link */}
          <p className="text-center text-sm text-slate-400 mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
