import { FC, useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, User, ShieldCheck, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import apiClient from '../utils/api';

const Register: FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'ROLE_USER',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await apiClient.post('auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-accent flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="text-center block mb-8">
          <h1 className="text-4xl font-black text-primary tracking-tighter uppercase italic">BulkPlainTShirt</h1>
        </Link>
        <div className="bg-white py-10 px-8 rounded-3xl shadow-xl shadow-gray-200 border border-gray-100">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-gray-800 tracking-tight">Create an account</h2>
            <p className="text-gray-500 font-medium mt-1">Join our community of bulk buyers.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider ml-1">Username</label>
              <div className="relative group">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                  placeholder="Choose a username"
                />
                <User className="absolute left-4 top-4 h-6 w-6 text-gray-400 group-focus-within:text-primary transition-colors" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                  placeholder="john@example.com"
                />
                <Mail className="absolute left-4 top-4 h-6 w-6 text-gray-400 group-focus-within:text-primary transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider ml-1">Password</label>
                <div className="relative group">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                    placeholder="••••••••"
                  />
                  <Lock className="absolute left-4 top-4 h-6 w-6 text-gray-400 group-focus-within:text-primary transition-colors" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider ml-1">Confirm</label>
                <div className="relative group">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                    placeholder="••••••••"
                  />
                  <ShieldCheck className="absolute left-4 top-4 h-6 w-6 text-gray-400 group-focus-within:text-primary transition-colors" />
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-2xl border border-red-100 animate-shake">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p className="text-sm font-bold">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg hover:bg-gray-800 transition-all shadow-xl shadow-primary/30 disabled:bg-gray-300 disabled:shadow-none flex items-center justify-center space-x-2 active:scale-95 transform"
            >
              {loading ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-black text-primary hover:underline underline-offset-4">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
