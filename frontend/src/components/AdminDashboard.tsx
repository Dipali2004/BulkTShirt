import { FC, useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { coreApiClient as coreApi, default as authApi } from '../utils/api';
import { Plus, Trash2, Edit2, CheckCircle, XCircle, Loader2, Users, ShoppingBag } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  priceMoreThan9: number;
  priceLessThan9: number;
  size: string;
  color: string;
  material: string;
  imageUrl: string;
  stockQuantity: number;
}

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

const AdminDashboard: FC = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'users'>('products');
  
  // Products State
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productFormData, setProductFormData] = useState({
    name: '',
    description: '',
    priceMoreThan9: 0,
    priceLessThan9: 0,
    size: '',
    color: '',
    material: '',
    imageUrl: '',
    stockQuantity: 0,
  });

  // Users State
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userFormData, setUserFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'ROLE_USER',
  });

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const response = await coreApi.get('/products');
      setProducts(response.data);
    } catch (err: any) {
      // Error handled by global interceptor
    } finally {
      setProductsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const response = await authApi.get('/auth/users');
      setUsers(response.data);
    } catch (err: any) {
      // Error handled by global interceptor
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'products') fetchProducts();
    else fetchUsers();
  }, [activeTab]);

  const handleProductChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProductFormData({
      ...productFormData,
      [name]: name.includes('price') || name === 'stockQuantity' ? parseFloat(value) : value,
    });
  };

  const handleUserChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUserFormData({ ...userFormData, [e.target.name]: e.target.value });
  };

  const handleProductSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await coreApi.put(`/products/${editingProduct.id}`, productFormData);
      } else {
        await coreApi.post('/products', productFormData);
      }
      setIsProductModalOpen(false);
      fetchProducts();
    } catch (err: any) {}
  };

  const handleUserSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await authApi.post('/auth/users', userFormData);
      setIsUserModalOpen(false);
      setUserFormData({ username: '', email: '', password: '', role: 'ROLE_USER' });
      fetchUsers();
    } catch (err: any) {}
  };

  const handleProductDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await coreApi.delete(`/products/${id}`);
      fetchProducts();
    } catch (err: any) {}
  };

  const handleUserDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await authApi.delete(`/auth/users/${id}`);
      fetchUsers();
    } catch (err: any) {}
  };

  const handleUpdateUserRole = async (id: number, newRole: string) => {
    try {
      await authApi.put(`/auth/users/${id}/role`, { role: newRole });
      fetchUsers();
    } catch (err: any) {}
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductFormData({
      name: product.name,
      description: product.description,
      priceMoreThan9: product.priceMoreThan9,
      priceLessThan9: product.priceLessThan9,
      size: product.size,
      color: product.color,
      material: product.material,
      imageUrl: product.imageUrl,
      stockQuantity: product.stockQuantity,
    });
    setIsProductModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-black text-gray-800 uppercase italic tracking-tight">Admin Console</h1>
          <div className="flex mt-2 bg-gray-100 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition ${activeTab === 'products' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <div className="flex items-center">
                <ShoppingBag className="h-3 w-3 mr-2" />
                Products
              </div>
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition ${activeTab === 'users' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <div className="flex items-center">
                <Users className="h-3 w-3 mr-2" />
                Users
              </div>
            </button>
          </div>
        </div>
        
        {activeTab === 'products' ? (
          <button
            onClick={() => {
              setEditingProduct(null);
              setProductFormData({
                name: '',
                description: '',
                priceMoreThan9: 0,
                priceLessThan9: 0,
                size: '',
                color: '',
                material: '',
                imageUrl: '',
                stockQuantity: 0,
              });
              setIsProductModalOpen(true);
            }}
            className="bg-primary text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center hover:bg-gray-800 transition shadow-lg shadow-primary/20"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </button>
        ) : (
          <button
            onClick={() => setIsUserModalOpen(true)}
            className="bg-primary text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center hover:bg-gray-800 transition shadow-lg shadow-primary/20"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </button>
        )}
      </div>

      {activeTab === 'products' ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {productsLoading ? (
            <div className="py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Product</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Pricing</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Stock</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img src={product.imageUrl} alt="" className="h-12 w-12 rounded-lg object-cover bg-gray-100 mr-4" />
                          <div>
                            <p className="font-bold text-gray-800">{product.name}</p>
                            <p className="text-xs text-gray-400 font-medium">{product.color} | {product.size} | {product.material}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-bold text-gray-800">₹{product.priceMoreThan9} <span className="text-[10px] text-gray-400">(9+)</span></p>
                          <p className="text-xs font-medium text-gray-400">₹{product.priceLessThan9} <span className="text-[10px] text-gray-400">(&lt;9)</span></p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          product.stockQuantity > 50 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {product.stockQuantity} in stock
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button onClick={() => handleEditProduct(product)} className="p-2 text-gray-400 hover:text-primary transition">
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleProductDelete(product.id)} className="p-2 text-gray-400 hover:text-red-500 transition">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {usersLoading ? (
            <div className="py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">User Info</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Role</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-gray-800">{user.username}</p>
                          <p className="text-xs text-gray-400 font-medium">{user.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select 
                          value={user.role}
                          onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                          className="bg-accent border-0 rounded-lg px-3 py-1 text-xs font-bold text-gray-700 focus:ring-2 focus:ring-primary/20"
                        >
                          <option value="ROLE_USER">User</option>
                          <option value="ROLE_ADMIN">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => handleUserDelete(user.id)}
                          disabled={user.username === 'admin'}
                          className="p-2 text-gray-400 hover:text-red-500 transition disabled:opacity-30 disabled:hover:text-gray-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-gray-800 uppercase italic">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setIsProductModalOpen(false)} className="text-gray-400 hover:text-gray-800 transition">
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Product Name</label>
                  <input
                    required
                    name="name"
                    value={productFormData.name}
                    onChange={handleProductChange}
                    className="w-full bg-accent border-0 rounded-xl px-4 py-3 font-bold text-sm focus:ring-2 focus:ring-primary/20 transition"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Material</label>
                  <input
                    required
                    name="material"
                    value={productFormData.material}
                    onChange={handleProductChange}
                    className="w-full bg-accent border-0 rounded-xl px-4 py-3 font-bold text-sm focus:ring-2 focus:ring-primary/20 transition"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Price (9+ Qty)</label>
                  <input
                    required
                    type="number"
                    name="priceMoreThan9"
                    value={productFormData.priceMoreThan9}
                    onChange={handleProductChange}
                    className="w-full bg-accent border-0 rounded-xl px-4 py-3 font-bold text-sm focus:ring-2 focus:ring-primary/20 transition"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Price (&lt;9 Qty)</label>
                  <input
                    required
                    type="number"
                    name="priceLessThan9"
                    value={productFormData.priceLessThan9}
                    onChange={handleProductChange}
                    className="w-full bg-accent border-0 rounded-xl px-4 py-3 font-bold text-sm focus:ring-2 focus:ring-primary/20 transition"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Size</label>
                  <input
                    required
                    name="size"
                    value={productFormData.size}
                    onChange={handleProductChange}
                    className="w-full bg-accent border-0 rounded-xl px-4 py-3 font-bold text-sm focus:ring-2 focus:ring-primary/20 transition"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Color</label>
                  <input
                    required
                    name="color"
                    value={productFormData.color}
                    onChange={handleProductChange}
                    className="w-full bg-accent border-0 rounded-xl px-4 py-3 font-bold text-sm focus:ring-2 focus:ring-primary/20 transition"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Image URL</label>
                  <input
                    required
                    name="imageUrl"
                    value={productFormData.imageUrl}
                    onChange={handleProductChange}
                    className="w-full bg-accent border-0 rounded-xl px-4 py-3 font-bold text-sm focus:ring-2 focus:ring-primary/20 transition"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Stock Quantity</label>
                  <input
                    required
                    type="number"
                    name="stockQuantity"
                    value={productFormData.stockQuantity}
                    onChange={handleProductChange}
                    className="w-full bg-accent border-0 rounded-xl px-4 py-3 font-bold text-sm focus:ring-2 focus:ring-primary/20 transition"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                  <textarea
                    required
                    name="description"
                    value={productFormData.description}
                    onChange={handleProductChange}
                    rows={3}
                    className="w-full bg-accent border-0 rounded-xl px-4 py-3 font-bold text-sm focus:ring-2 focus:ring-primary/20 transition resize-none"
                  />
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-gray-800 transition flex items-center justify-center"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="flex-1 bg-gray-100 text-gray-500 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-gray-800 uppercase italic">Add New User</h2>
              <button onClick={() => setIsUserModalOpen(false)} className="text-gray-400 hover:text-gray-800 transition">
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleUserSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Username</label>
                  <input
                    required
                    name="username"
                    value={userFormData.username}
                    onChange={handleUserChange}
                    className="w-full bg-accent border-0 rounded-xl px-4 py-3 font-bold text-sm focus:ring-2 focus:ring-primary/20 transition"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={userFormData.email}
                    onChange={handleUserChange}
                    className="w-full bg-accent border-0 rounded-xl px-4 py-3 font-bold text-sm focus:ring-2 focus:ring-primary/20 transition"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
                  <input
                    required
                    type="password"
                    name="password"
                    value={userFormData.password}
                    onChange={handleUserChange}
                    className="w-full bg-accent border-0 rounded-xl px-4 py-3 font-bold text-sm focus:ring-2 focus:ring-primary/20 transition"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Role</label>
                  <select
                    name="role"
                    value={userFormData.role}
                    onChange={handleUserChange}
                    className="w-full bg-accent border-0 rounded-xl px-4 py-3 font-bold text-sm focus:ring-2 focus:ring-primary/20 transition"
                  >
                    <option value="ROLE_USER">User</option>
                    <option value="ROLE_ADMIN">Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-gray-800 transition flex items-center justify-center"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Add User
                </button>
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="flex-1 bg-gray-100 text-gray-500 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

