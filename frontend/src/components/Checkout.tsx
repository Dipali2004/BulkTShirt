import { FC, useState, ChangeEvent, FormEvent } from 'react';
import { useCart } from '../context/CartContext';
import { CreditCard, Truck, CheckCircle, Loader2, MapPin, Phone, ShoppingBag, ShieldCheck } from 'lucide-react';
import { coreApiClient as apiClient } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const Checkout: FC = () => {
  const { cartItems, totalAmount, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<'ONLINE' | 'COD'>('ONLINE');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shippingData, setShippingData] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phoneNumber: '',
  });
  const navigate = useNavigate();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orderData = {
        totalAmount,
        paymentMethod,
        shippingAddress: `${shippingData.address}, ${shippingData.city}, ${shippingData.state} - ${shippingData.zipCode}`,
        contactNumber: shippingData.phoneNumber,
        orderItems: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      await apiClient.post('orders', orderData);
      setSuccess(true);
      clearCart();
    } catch (error) {
      console.error('Order failed', error);
      alert('Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="bg-white p-16 rounded-3xl shadow-xl shadow-gray-200 border border-gray-100">
          <div className="bg-green-100 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="h-14 w-14 text-green-600 animate-bounce" />
          </div>
          <h2 className="text-4xl font-black text-gray-800 mb-4 tracking-tight">Order Placed!</h2>
          <p className="text-xl text-gray-500 mb-10 font-medium leading-relaxed">
            Your order has been successfully placed. You will receive a confirmation email shortly.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg hover:bg-gray-800 transition-all shadow-xl shadow-primary/30 flex items-center justify-center space-x-2 active:scale-95 transform"
          >
            <ShoppingBag className="h-6 w-6" />
            <span>Continue Shopping</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 lg:px-8">
      <h1 className="text-4xl font-black text-gray-800 mb-10 tracking-tight flex items-center space-x-4">
        <ShieldCheck className="h-10 w-10 text-primary" />
        <span>Checkout</span>
      </h1>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-8">
          {/* Shipping Details */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-black text-gray-800 mb-8 tracking-tight flex items-center space-x-3">
              <MapPin className="h-6 w-6 text-primary" />
              <span>Shipping Information</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2 space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider ml-1">Street Address</label>
                <textarea
                  name="address"
                  value={shippingData.address}
                  onChange={handleInputChange}
                  required
                  rows={2}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition"
                  placeholder="H.No 123, Sector 45"
                ></textarea>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider ml-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={shippingData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition"
                  placeholder="Delhi"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider ml-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={shippingData.state}
                  onChange={handleInputChange}
                  required
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition"
                  placeholder="Delhi NCR"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider ml-1">ZIP / Postal Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={shippingData.zipCode}
                  onChange={handleInputChange}
                  required
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition"
                  placeholder="110001"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider ml-1">Phone Number</label>
                <div className="relative group">
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={shippingData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition"
                    placeholder="9876543210"
                  />
                  <Phone className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-black text-gray-800 mb-8 tracking-tight flex items-center space-x-3">
              <CreditCard className="h-6 w-6 text-primary" />
              <span>Payment Method</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div 
                onClick={() => setPaymentMethod('ONLINE')}
                className={`p-6 rounded-3xl border-2 cursor-pointer transition-all ${paymentMethod === 'ONLINE' ? 'border-primary bg-primary/5 ring-4 ring-primary/10 shadow-lg' : 'border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-gray-100'}`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${paymentMethod === 'ONLINE' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                    <CreditCard className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-800 tracking-tight">Online Payment</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">UPI / Cards / Net Banking</p>
                  </div>
                </div>
              </div>
              <div 
                onClick={() => setPaymentMethod('COD')}
                className={`p-6 rounded-3xl border-2 cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-primary bg-primary/5 ring-4 ring-primary/10 shadow-lg' : 'border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-gray-100'}`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${paymentMethod === 'COD' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                    <Truck className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-800 tracking-tight">Cash on Delivery</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Pay at your doorstep</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-2xl font-black text-gray-800 mb-8 tracking-tight">Order Summary</h2>
            <div className="space-y-4 mb-8">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 font-bold">{item.name} x {item.quantity}</span>
                  <span className="text-gray-800 font-black tracking-tight">₹{item.price * item.quantity}</span>
                </div>
              ))}
              <hr className="border-gray-100" />
              <div className="flex justify-between items-center">
                <span className="text-gray-800 font-black uppercase text-sm tracking-widest">Total to Pay</span>
                <span className="text-3xl font-black text-primary tracking-tighter">₹{totalAmount}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg hover:bg-gray-800 transition-all shadow-xl shadow-primary/30 flex items-center justify-center space-x-2 active:scale-95 transform disabled:bg-gray-300 disabled:shadow-none"
            >
              {loading ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-6 w-6" />
                  <span>Place Order</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
