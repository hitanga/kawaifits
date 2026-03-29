import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, LogOut, Package, DollarSign, Tag, Image as ImageIcon, Check, X, Truck } from 'lucide-react';
import { FirebaseService } from '../services/firebaseService';
import { auth } from '../firebase';
import { Product } from '../types';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    title: '',
    price: 0,
    shipping: 0,
    category: 'Dresses',
    description: '',
    image: '',
    images: []
  });
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/admin/login');
      } else {
        setLoading(false);
      }
    });

    const unsubscribeProducts = FirebaseService.subscribeToProducts((data) => {
      setProducts(data);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeProducts();
    };
  }, [navigate]);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/admin/login');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800000) { // ~800KB limit to be safe with Firestore 1MB limit
        setError('Image is too large. Please select an image smaller than 800KB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      setError('Please upload an image.');
      return;
    }
    try {
      if (editingId) {
        await FirebaseService.updateProduct(editingId, formData);
        setEditingId(null);
      } else {
        await FirebaseService.addProduct(formData as Omit<Product, 'id'>);
      }
      setIsAdding(false);
      setFormData({ title: '', price: 0, shipping: 0, category: 'Dresses', description: '', image: '', images: [] });
      setError(null);
    } catch (err: any) {
      setError('Failed to save product. Please check your permissions.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await FirebaseService.deleteProduct(id);
      setDeletingId(null);
      setError(null);
    } catch (err: any) {
      setError('Failed to delete product.');
    }
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData(product);
    setIsAdding(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="font-serif text-4xl text-stone-900 mb-2">Admin Dashboard</h1>
          <p className="text-stone-500 text-sm">Manage your product catalog and inventory</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => { setIsAdding(true); setEditingId(null); setFormData({ title: '', price: 0, shipping: 0, category: 'Dresses', description: '', image: '', images: [] }); }}
            className="bg-stone-900 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-rose-500 transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            Add Product
          </button>
          <button 
            onClick={handleLogout}
            className="border border-stone-200 text-stone-600 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-stone-50 transition-all flex items-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600"><X size={16} /></button>
        </div>
      )}

      {isAdding && (
        <div className="mb-12 bg-stone-50 p-8 rounded-2xl border border-stone-100 fade-in">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-serif text-2xl text-stone-900">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
            <button onClick={() => setIsAdding(false)} className="text-stone-400 hover:text-stone-900"><X size={24} /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">Product Title</label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border-b border-stone-200 focus:outline-none focus:border-stone-900 bg-transparent"
                    placeholder="Floral Summer Dress"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">Base Price (₹)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                  <input 
                    type="number" 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                    className="w-full pl-10 pr-4 py-3 border-b border-stone-200 focus:outline-none focus:border-stone-900 bg-transparent"
                    placeholder="999.00"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">Shipping Cost (₹)</label>
                <div className="relative">
                  <Truck className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                  <input 
                    type="number" 
                    value={formData.shipping}
                    onChange={(e) => setFormData({...formData, shipping: parseFloat(e.target.value) || 0})}
                    className="w-full pl-10 pr-4 py-3 border-b border-stone-200 focus:outline-none focus:border-stone-900 bg-transparent"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              <div className="p-4 bg-stone-100 rounded-xl border border-stone-200">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-stone-500">Final Price (Inclusive)</span>
                  <span className="font-serif text-xl text-stone-900">₹{((formData.price || 0) + (formData.shipping || 0)).toFixed(2)}</span>
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">Category</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border-b border-stone-200 focus:outline-none focus:border-stone-900 bg-transparent appearance-none"
                  >
                    <option>Dresses</option>
                    <option>Outerwear</option>
                    <option>Tops</option>
                    <option>Bottoms</option>
                    <option>Accessories</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">Product Image</label>
                <div className="flex items-start gap-4">
                  <div className="w-32 h-40 bg-stone-100 rounded-xl overflow-hidden flex items-center justify-center border-2 border-dashed border-stone-200 group relative">
                    {formData.image ? (
                      <>
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <label className="cursor-pointer text-white text-[10px] font-bold uppercase tracking-widest">Change</label>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-4">
                        <ImageIcon className="mx-auto text-stone-300 mb-2" size={24} />
                        <span className="text-[8px] text-stone-400 font-bold uppercase tracking-widest">Upload Image</span>
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  <div className="flex-1 text-[10px] text-stone-400 leading-relaxed">
                    <p className="font-bold text-stone-500 mb-1">Upload Guidelines:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Max size: 800KB</li>
                      <li>Recommended: 3:4 aspect ratio</li>
                      <li>Format: JPG, PNG, WEBP</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-4 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 bg-transparent h-32"
                  placeholder="Describe the product details..."
                  required
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full bg-stone-900 text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-rose-500 transition-all flex items-center justify-center gap-2"
              >
                <Check size={18} />
                {editingId ? 'Update Product' : 'Save Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {products.map(product => (
          <div key={product.id} className="flex items-center gap-6 p-6 bg-white border border-stone-100 rounded-2xl hover:shadow-lg transition-all group">
            <div className="w-24 h-32 overflow-hidden rounded-xl bg-stone-50">
              <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-rose-400 font-bold mb-1 block">{product.category}</span>
                  <h3 className="font-serif text-xl text-stone-900 mb-1">{product.title}</h3>
                  <p className="text-stone-500 text-sm line-clamp-1 max-w-md">{product.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-serif text-xl text-stone-900 mb-1">₹{((product.price || 0) + (product.shipping || 0)).toFixed(2)}</p>
                  <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-4">(₹{product.price} + ₹{product.shipping || 0} shipping)</p>
                  <div className="flex gap-2">
                    {deletingId === product.id ? (
                      <div className="flex items-center gap-2 bg-red-50 p-1 rounded-lg border border-red-100 animate-in fade-in slide-in-from-right-2">
                        <span className="text-[10px] font-bold text-red-600 px-2 uppercase tracking-tighter">Confirm?</span>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all"
                          title="Confirm Delete"
                        >
                          <Check size={14} />
                        </button>
                        <button 
                          onClick={() => setDeletingId(null)}
                          className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-white rounded-md transition-all"
                          title="Cancel"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <button 
                          onClick={() => startEdit(product)}
                          className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-50 rounded-lg transition-all"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => setDeletingId(product.id)}
                          className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
