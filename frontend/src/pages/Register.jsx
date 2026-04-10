import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock, Briefcase, AlertCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const userData = await register(formData.name, formData.email, formData.password, formData.role);
      if (userData.role === 'student') navigate('/student-dashboard');
      else navigate('/recruiter-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md bg-surface p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-800">
        <h2 className="text-3xl font-bold text-center text-textLight mb-8">Create Account</h2>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle size={18} />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm text-textMuted font-medium ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" required
                className="w-full bg-background border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-textLight focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                placeholder="John Doe"
                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-textMuted font-medium ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="email" required
                className="w-full bg-background border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-textLight focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                placeholder="you@example.com"
                value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-textMuted font-medium ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="password" required
                className="w-full bg-background border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-textLight focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                placeholder="••••••••"
                value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-textMuted font-medium ml-1">I am a...</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({...formData, role: 'student'})}
                className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                  formData.role === 'student' ? 'bg-primary/20 border-primary text-primary' : 'bg-background border-gray-700 text-textMuted hover:border-gray-500'
                }`}
              >
                <User size={18} /> Student
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, role: 'recruiter'})}
                className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                  formData.role === 'recruiter' ? 'bg-primary/20 border-primary text-primary' : 'bg-background border-gray-700 text-textMuted hover:border-gray-500'
                }`}
              >
                <Briefcase size={18} /> Recruiter
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-primary hover:bg-blue-600 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-primary/25 mt-4 active:scale-[0.98]"
          >
            Create Account
          </button>
        </form>
        
        <p className="text-center text-textMuted mt-8 text-sm">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
