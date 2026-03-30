import { FC, useState, ChangeEvent, FormEvent } from 'react';
import { Send, CheckCircle, Loader2 } from 'lucide-react';
import { coreApiClient as apiClient } from '../utils/api';

const EnquiryForm: FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await apiClient.post('enquiries', formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phoneNumber: '', message: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center max-w-2xl mx-auto">
        <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6 animate-pulse" />
        <h2 className="text-3xl font-black text-gray-800 mb-4 tracking-tight">Thank You!</h2>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Your enquiry has been sent successfully. We will get back to you on your email or phone shortly.
        </p>
        <button 
          onClick={() => setSuccess(false)}
          className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg shadow-primary/20"
        >
          Send Another Enquiry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-black text-gray-800 mb-2 tracking-tight">Get a Quote</h2>
        <p className="text-gray-500 font-medium">Fill out the form below and we'll reach out within 24 hours.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider ml-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition"
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider ml-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition"
              placeholder="john@example.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 uppercase tracking-wider ml-1">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition"
            placeholder="+91 12345 67890"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 uppercase tracking-wider ml-1">Your Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition resize-none"
            placeholder="Tell us about your bulk requirement (colors, sizes, quantity)..."
          ></textarea>
        </div>

        {error && <p className="text-red-500 text-sm font-semibold bg-red-50 p-4 rounded-xl border border-red-100">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-5 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all shadow-lg shadow-primary/20 disabled:bg-gray-300 disabled:shadow-none flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Sending Enquiry...</span>
            </>
          ) : (
            <>
              <Send className="h-6 w-6" />
              <span>Send Enquiry</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default EnquiryForm;
