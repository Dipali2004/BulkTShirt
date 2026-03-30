import { FC, useState, useEffect } from 'react';
import { XCircle, Info, CheckCircle } from 'lucide-react';

const GlobalToast: FC = () => {
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' | 'info'; code?: string } | null>(null);

  useEffect(() => {
    const handleError = (event: any) => {
      const { message, code } = event.detail;
      setToast({ message, type: 'error', code });
      
      // Auto-hide after 5 seconds
      setTimeout(() => setToast(null), 5000);
    };

    window.addEventListener('api-error', handleError);
    return () => window.removeEventListener('api-error', handleError);
  }, []);

  if (!toast) return null;

  const styles = {
    error: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const Icons = {
    error: <XCircle className="h-5 w-5 text-red-500" />,
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
  };

  return (
    <div className="fixed top-24 right-4 z-[100] max-w-sm w-full animate-in fade-in slide-in-from-right-4 duration-300">
      <div className={`p-4 rounded-2xl border-2 shadow-xl ${styles[toast.type]} flex items-start`}>
        <div className="flex-shrink-0 mr-3 mt-0.5">
          {Icons[toast.type]}
        </div>
        <div className="flex-1">
          <p className="font-black text-xs uppercase tracking-widest mb-1">
            {toast.type === 'error' ? `Error: ${toast.code || 'UNKNOWN'}` : toast.type.toUpperCase()}
          </p>
          <p className="text-sm font-bold leading-relaxed">{toast.message}</p>
        </div>
        <button 
          onClick={() => setToast(null)}
          className="ml-4 text-gray-400 hover:text-gray-600 transition"
        >
          <XCircle className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default GlobalToast;
