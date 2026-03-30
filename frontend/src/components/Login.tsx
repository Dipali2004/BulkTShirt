import { FC, useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

const Login: FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    captcha: '',
  });
  const [captchaCode, setCaptchaCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const generateCaptcha = () => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    setCaptchaCode(code);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.captcha !== captchaCode) {
      setError('Invalid captcha code');
      generateCaptcha();
      return;
    }

    setLoading(true);
    try {
      await login(formData);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      generateCaptcha();
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
            <h2 className="text-2xl font-black text-gray-800 tracking-tight">Welcome back!</h2>
            <p className="text-gray-500 font-medium mt-1">Sign in to your account to continue.</p>
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
                  placeholder="Enter your username"
                />
                <User className="absolute left-4 top-4 h-6 w-6 text-gray-400 group-focus-within:text-primary transition-colors" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Password</label>
                <Link to="/forgot-password" className="text-xs font-bold text-primary hover:underline underline-offset-4 transition">Forgot Password?</Link>
              </div>
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
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider ml-1">Verification</label>
              <div className="flex space-x-4">
                <div className="bg-primary text-white font-black italic tracking-widest px-6 py-4 rounded-2xl flex items-center justify-center text-xl select-none shadow-lg shadow-primary/20 border-2 border-gray-800 flex-1">
                  {captchaCode}
                </div>
                <div className="relative flex-[2]">
                  <input
                    type="text"
                    name="captcha"
                    value={formData.captcha}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                    placeholder="Type code"
                  />
                  <ShieldCheck className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
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
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-black text-primary hover:underline underline-offset-4">Create one now</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
