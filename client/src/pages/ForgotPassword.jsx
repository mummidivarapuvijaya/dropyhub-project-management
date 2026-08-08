import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { Layers, Mail, ArrowRight, CheckCircle2, AlertCircle, KeyRound, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await API.post('/auth/forgot-password', { email });
      setMessage(res.data.message || 'Password reset link sent to your email address');
      if (res.data.resetToken) {
        setResetToken(res.data.resetToken);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to request password reset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0a0e1a]">
      {/* LEFT HALF — Branding */}
      <div className="hidden lg:flex lg:w-1/2 min-h-screen relative overflow-y-auto items-center justify-center p-8 xl:p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f1629] via-[#131b36] to-[#1a1145]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        <div className="relative z-10 w-full max-w-xl my-auto space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">DropyHub</h2>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">Project Management</p>
            </div>
          </div>

          <div>
            <h1 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight mb-2">
              Recover your{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                account access.
              </span>
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed max-w-md">
              Don't worry, it happens to the best of us. Enter your email and we'll send you a reset link to get back into your workspace.
            </p>
          </div>

          {/* Security illustration */}
          <div className="relative max-w-md pt-2">
            <div className="bg-white/[0.04] border border-white/15 rounded-2xl p-5 backdrop-blur-sm shadow-xl">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                  <KeyRound className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <div className="h-2.5 w-28 bg-white/20 rounded mb-1.5" />
                  <div className="h-2 w-20 bg-white/10 rounded" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                  </div>
                  <div className="h-2 w-32 bg-white/15 rounded" />
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                  </div>
                  <div className="h-2 w-24 bg-white/15 rounded" />
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-slate-500/20 border border-slate-500/30" />
                  <div className="h-2 w-28 bg-white/10 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT HALF — Form */}
      <div className="w-full lg:w-1/2 min-h-screen flex flex-col items-center justify-center p-6 sm:p-10 lg:p-12 relative overflow-y-auto">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a] via-[#0d1222] to-[#0f152a] lg:bg-gradient-to-br lg:from-[#0d1224] lg:via-[#101828] lg:to-[#141d33]" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/5 rounded-full blur-[100px]" />

        <div className="relative z-10 w-full max-w-sm my-auto">
          {/* Mobile logo */}
          <div className="flex items-center justify-center space-x-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">DropyHub</h2>
          </div>

          {/* Back link */}
          <Link to="/login" className="inline-flex items-center space-x-1.5 text-xs font-medium text-slate-400 hover:text-indigo-400 transition-colors mb-6">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-1.5">Forgot Password 🔑</h2>
            <p className="text-sm text-slate-400">Enter your registered email to reset password</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {message ? (
            <div className="space-y-5 text-center py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <p className="text-sm text-slate-200 font-medium">{message}</p>

              {resetToken && (
                <div className="p-4 bg-white/[0.03] border border-indigo-500/20 rounded-xl text-left">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                    Quick Reset Shortcut (Dev Mode):
                  </span>
                  <Link
                    to={`/reset-password/${resetToken}`}
                    className="text-xs text-indigo-300 underline font-mono break-all hover:text-white transition-colors"
                  >
                    Click to Reset Password Immediately →
                  </Link>
                </div>
              )}

              <Link
                to="/login"
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          ) : (
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

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold py-2.5 rounded-xl shadow-lg shadow-indigo-600/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 mt-1 cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Send Reset Email</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-slate-400 mt-8">
            Remember password?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
