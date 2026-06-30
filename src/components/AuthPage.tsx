import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  Building2, 
  MapPin, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  Loader2,
  Heart,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';

interface AuthPageProps {
  onAuthSuccess: (user: UserProfile, role: 'citizen' | 'official') => void;
  initialRole?: 'citizen' | 'official';
}

export default function AuthPage({ onAuthSuccess, initialRole = 'citizen' }: AuthPageProps) {
  const [role, setRole] = useState<'citizen' | 'official'>(initialRole);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ward, setWard] = useState('Ward 80 - Indiranagar');
  const [department, setDepartment] = useState('Public Works Department (PWD)');
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (!email || !password || (isSignUp && !name)) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/login';
    const payload = {
      name,
      email,
      password,
      role,
      extraInfo: role === 'official' ? department : ward
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      setSuccess(isSignUp ? 'Account created successfully! Logging you in...' : 'Welcome back! Login successful.');
      
      // Delay success navigation slightly for beautiful micro-interaction
      setTimeout(() => {
        onAuthSuccess(data.user, data.role);
      }, 1200);

    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In Simulation
  const handleGoogleSelect = async (selectedName: string, selectedEmail: string) => {
    setShowGoogleModal(false);
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: selectedName,
          email: selectedEmail,
          role: role
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Google Authentication failed');
      }

      setSuccess(`Authenticated via Google as ${selectedName}!`);
      setTimeout(() => {
        onAuthSuccess(data.user, data.role);
      }, 1200);

    } catch (err: any) {
      setError(err.message || 'Google Auth failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12" id="auth-page-container">
      
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500 text-slate-900 font-black text-2xl shadow-xl shadow-emerald-500/20 mb-3">
          N
        </div>
        <h2 className="text-3xl font-black tracking-tight text-white">
          Welcome to Nagrik<span className="text-emerald-400">AI</span>
        </h2>
        <p className="text-slate-400 text-sm mt-1.5">
          Empowering citizens & authorities through hyper-local intelligence
        </p>
      </div>

      {/* Role Selection Tabs */}
      <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-800/80 mb-6">
        <button
          onClick={() => {
            setRole('citizen');
            setIsSignUp(false);
            setError(null);
          }}
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center space-x-2 ${
            role === 'citizen'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10'
              : 'text-slate-400 hover:text-white'
          }`}
          id="role-tab-citizen"
        >
          <Globe className="w-4 h-4" />
          <span>Citizen Portal</span>
        </button>
        <button
          onClick={() => {
            setRole('official');
            setIsSignUp(false);
            setError(null);
          }}
          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center space-x-2 ${
            role === 'official'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10'
              : 'text-slate-400 hover:text-white'
          }`}
          id="role-tab-official"
        >
          <Building2 className="w-4 h-4" />
          <span>Gov Official</span>
        </button>
      </div>

      {/* Card Form container */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden backdrop-blur-sm">
        
        {/* Decorative ambient background blur */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none"></div>

        {/* Title Indicator */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span>Secure Authentication</span>
          </div>
          <h3 className="text-xl font-extrabold text-white">
            {role === 'citizen' 
              ? (isSignUp ? 'Create Citizen Profile' : 'Citizen Sign In') 
              : (isSignUp ? 'Register Government Node' : 'Official Console Login')
            }
          </h3>
        </div>

        {/* Notification banners */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start space-x-2"
              id="auth-error-banner"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/20 text-emerald-300 text-xs flex items-start space-x-2"
              id="auth-success-banner"
            >
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              <span>{success}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isSignUp && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="e.g. Rajesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              {role === 'official' ? 'Official Email ID' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                placeholder={role === 'official' ? 'officer.name@municipal.gov.in' : 'name@example.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Dynamic Extra Field based on Role during Signup */}
          {isSignUp && role === 'citizen' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Residential Ward</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <select
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
                >
                  <option value="Ward 80 - Indiranagar">Ward 80 - Indiranagar</option>
                  <option value="Ward 151 - Koramangala">Ward 151 - Koramangala</option>
                  <option value="Ward 174 - HSR Layout">Ward 174 - HSR Layout</option>
                  <option value="Ward 111 - Shantala Nagar">Ward 111 - Shantala Nagar</option>
                  <option value="Ward 44 - Whitefield">Ward 44 - Whitefield</option>
                </select>
              </div>
            </div>
          )}

          {isSignUp && role === 'official' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Assigned Department</label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
                >
                  <option value="Public Works Department (PWD)">Public Works Department (PWD)</option>
                  <option value="Solid Waste Management (SWM)">Solid Waste Management (SWM)</option>
                  <option value="Water Supply & Sewerage Board">Water Supply & Sewerage Board</option>
                  <option value="Electricity Distribution Board">Electricity Distribution Board</option>
                  <option value="Municipal Electrical Department">Municipal Electrical Department</option>
                </select>
              </div>
            </div>
          )}

          {/* Action button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center space-x-2 cursor-pointer mt-4"
            id="auth-submit-btn"
          >
            {loading ? (
              <Loader2 className="w-4.5 h-4.5 animate-spin text-slate-950" />
            ) : (
              <>
                <span>
                  {isSignUp 
                    ? (role === 'citizen' ? 'Create Citizen Profile' : 'Register Official Account') 
                    : (role === 'citizen' ? 'Secure Citizen Login' : 'Enter Government Console')
                  }
                </span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </>
            )}
          </button>

        </form>

        {/* Divider */}
        {role === 'citizen' && (
          <>
            <div className="flex items-center my-5">
              <div className="flex-1 h-px bg-slate-800"></div>
              <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-slate-800"></div>
            </div>

            {/* Google Sign In Button */}
            <button
              onClick={() => setShowGoogleModal(true)}
              type="button"
              className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center space-x-2.5 cursor-pointer"
              id="google-signin-btn"
            >
              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.579-7.859-8s3.529-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.111C18.281 1.09 15.514 0 12.24 0 5.48 0 0 5.48 0 12.24s5.48 12.24 12.24 12.24c7.058 0 11.751-4.966 11.751-11.96 0-.806-.088-1.42-.196-2.235H12.24z"
                />
              </svg>
              <span>{isSignUp ? 'Sign up with Google' : 'Sign in with Google'}</span>
            </button>
          </>
        )}

        {/* Form Toggle Link */}
        <div className="text-center mt-6 text-xs text-slate-400">
          <span>
            {isSignUp 
              ? 'Already have an account?' 
              : (role === 'citizen' ? "Don't have a profile yet?" : "Need official credentials?")
            }
          </span>
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
            className="text-emerald-400 hover:text-emerald-300 font-bold ml-1.5 transition-colors focus:outline-none"
            type="button"
          >
            {isSignUp ? 'Sign In' : 'Sign Up Now'}
          </button>
        </div>

      </div>

      {/* Interactive Google Sign-In Popup Selector Modal */}
      <AnimatePresence>
        {showGoogleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4" id="google-auth-modal">
            {/* Overlay background */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGoogleModal(false)}
              className="absolute inset-0 bg-slate-950"
            ></motion.div>

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl relative z-10 overflow-hidden"
            >
              {/* Google Brand Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.53-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-8.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.11 0-5.74-2.11-6.68-4.96H1.21v3.15C3.18 21.88 7.31 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.32 14.24A7.16 7.16 0 0 1 4.9 12c0-.79.13-1.57.32-2.34V6.51H1.21A11.94 11.94 0 0 0 0 12c0 1.92.45 3.74 1.21 5.39l4.11-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.18 2.12 1.21 5.39l4.11 3.15c.94-2.85 3.57-4.96 6.68-4.96z"
                    />
                  </svg>
                  <span className="font-bold text-sm text-slate-200">Sign in with Google</span>
                </div>
                <button 
                  onClick={() => setShowGoogleModal(false)}
                  className="text-slate-500 hover:text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
              </div>

              <p className="text-slate-400 text-xs mb-4">
                Select an active Google Account to log in instantly to your {role === 'citizen' ? 'Citizen' : 'Official'} profile:
              </p>

              {/* Accounts list */}
              <div className="space-y-2">
                
                {/* Account 1 */}
                <button
                  onClick={() => handleGoogleSelect('Amit Patel', 'amit.patel@gmail.com')}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-850 hover:border-slate-700 transition-all text-left cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 text-white font-bold flex items-center justify-center text-xs">
                      AP
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Amit Patel</p>
                      <p className="text-[10px] text-slate-500">amit.patel@gmail.com</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-slate-850 text-slate-400 px-2 py-0.5 rounded font-bold">Active demo</span>
                </button>

                {/* Account 2 */}
                <button
                  onClick={() => handleGoogleSelect('Rajesh Kumar', 'rajesh.k@gmail.com')}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-850 hover:border-slate-700 transition-all text-left cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                      RK
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Rajesh Kumar</p>
                      <p className="text-[10px] text-slate-500">rajesh.k@gmail.com</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold">Expert</span>
                </button>

                {/* Account 3 */}
                <button
                  onClick={() => handleGoogleSelect('Ananya Rao', 'ananya.r@outlook.com')}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-850 hover:border-slate-700 transition-all text-left cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500 text-white font-bold flex items-center justify-center text-xs">
                      AR
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Ananya Rao</p>
                      <p className="text-[10px] text-slate-500">ananya.r@outlook.com</p>
                    </div>
                  </div>
                </button>

                {/* Custom input trigger */}
                <div className="pt-2">
                  <p className="text-[10px] text-slate-500 text-center uppercase tracking-wider">
                    Secured by Google Identity Services
                  </p>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
