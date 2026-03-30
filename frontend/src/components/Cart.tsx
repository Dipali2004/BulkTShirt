import { FC } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart: FC = () => {
  const { cartItems, removeFromCart, updateQuantity, totalAmount } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100">
          <ShoppingBag className="h-20 w-20 text-gray-200 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-gray-800 mb-4 tracking-tight">Your cart is empty</h2>
          <p className="text-lg text-gray-500 mb-8 font-medium">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/catalog" className="inline-flex items-center space-x-2 bg-primary text-white px-10 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl shadow-primary/20">
            <span>Explore Catalog</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 lg:px-8">
      <h1 className="text-4xl font-black text-gray-800 mb-10 tracking-tight flex items-center space-x-4">
        <ShoppingBag className="h-10 w-10 text-primary" />
        <span>Shopping Cart</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-6">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-6 hover:shadow-md transition-all group">
              <div className="h-32 w-32 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                <img src={item.image} alt={item.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-black text-gray-800 tracking-tight">{item.name}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.size} / {item.color}</span>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.productId)} className="text-gray-300 hover:text-red-500 transition-colors p-2 rounded-xl hover:bg-red-50">
                    <Trash2 className="h-6 w-6" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                    <button 
                      onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                      className="p-2 hover:bg-white rounded-lg transition-colors text-gray-500 hover:text-primary"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center font-black text-gray-800">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="p-2 hover:bg-white rounded-lg transition-colors text-gray-500 hover:text-primary"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total</p>
                    <p className="text-2xl font-black text-primary tracking-tight">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-4">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-2xl font-black text-gray-800 mb-8 tracking-tight">Order Summary</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-bold uppercase text-xs tracking-widest">Subtotal</span>
                <span className="text-xl font-black text-gray-800 tracking-tight">₹{totalAmount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-bold uppercase text-xs tracking-widest">Shipping</span>
                <span className="text-green-600 font-black tracking-tight">FREE</span>
              </div>
              <hr className="border-gray-100" />
              <div className="flex justify-between items-center">
                <span className="text-gray-800 font-black uppercase text-sm tracking-widest">Total</span>
                <span className="text-3xl font-black text-primary tracking-tighter">₹{totalAmount}</span>
              </div>
            </div>

            <div className="space-y-4">
              <Link to="/checkout" className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg hover:bg-gray-800 transition-all shadow-xl shadow-primary/30 flex items-center justify-center space-x-2 active:scale-95 transform">
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-6 w-6" />
              </Link>
              
              <div className="flex items-center justify-center space-x-6 pt-6">
                <div className="flex flex-col items-center space-y-2 opacity-50 grayscale hover:grayscale-0 transition-all cursor-default">
                  <ShieldCheck className="h-6 w-6" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Secure Pay</span>
                </div>
                <div className="flex flex-col items-center space-y-2 opacity-50 grayscale hover:grayscale-0 transition-all cursor-default">
                  <Truck className="h-6 w-6" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Fast Track</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
