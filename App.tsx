import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import ProductDetail from './pages/ProductDetail';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProductCard from './components/ProductCard';
import AIStylist from './components/AIStylist';
import ErrorBoundary from './components/ErrorBoundary';
import { Product, User, CartItem, Order } from './types';
import { FirebaseService } from './services/firebaseService';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Search, Filter, ShoppingCart, Trash2, CheckCircle, Upload, Lock } from 'lucide-react';

// --- Contexts ---
const CartContext = createContext<any>(null);

export const useCart = () => useContext(CartContext);

// --- Pages defined inline for simplicity within file limit ---

// SHOP PAGE
const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();
  const [search, setSearch] = useState('');

  useEffect(() => {
    const unsubscribe = FirebaseService.subscribeToProducts((data) => {
      setProducts(data);
    });
    return () => unsubscribe();
  }, []);

  const filtered = products.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <h2 className="font-serif text-4xl font-bold text-stone-900">New Arrivals</h2>
        
        <div className="flex flex-wrap gap-4 items-center">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 rounded-full border border-stone-200 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
                />
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filtered.map(p => (
          <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-20 text-stone-500">
            <p className="text-xl">No products found.</p>
            <button onClick={() => setSearch('')} className="mt-4 text-rose-500 hover:underline">Clear Search</button>
        </div>
      )}
    </div>
  );
};

// CART PAGE
const Cart = () => {
  const { cart, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const handleCheckout = () => {
    const orderDetails = cart.map((item: CartItem) => 
      `${item.title} (x${item.quantity}) - ₹${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');
    
    const message = `I would like to place an order for the following items:\n\n${orderDetails}\n\nTotal: ₹${total.toFixed(2)}`;
    
    navigate('/contact', { state: { orderMessage: message } });
  };

  if (success) {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-6 animate-bounce">
                <CheckCircle size={40} />
            </div>
            <h2 className="font-serif text-3xl font-bold mb-2">Order Placed Successfully!</h2>
            <p className="text-stone-500 mb-8 max-w-md">Thank you for your order. We will get back to you shortly.</p>
            <button onClick={() => navigate('/shop')} className="bg-stone-900 text-white px-8 py-3 rounded-full hover:bg-stone-700 transition">Continue Shopping</button>
        </div>
    );
  }

  if (cart.length === 0) {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
             <ShoppingCart size={48} className="text-stone-300 mb-4" />
             <h2 className="text-xl font-medium text-stone-600 mb-4">Your bag is empty</h2>
             <button onClick={() => navigate('/shop')} className="text-rose-500 hover:underline">Start Shopping</button>
        </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="font-serif text-3xl font-bold mb-8">Shopping Bag</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
                {cart.map((item: CartItem) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-stone-100">
                        <img src={item.image} alt={item.title} className="w-24 h-32 object-cover rounded-md" />
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="font-medium text-stone-900">{item.title}</h3>
                                <p className="text-sm text-stone-500">{item.category}</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-rose-500">₹{item.price.toFixed(2)}</span>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center border border-stone-200 rounded-full">
                                        <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1 hover:bg-stone-100 rounded-l-full">-</button>
                                        <span className="text-sm w-4 text-center">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1 hover:bg-stone-100 rounded-r-full">+</button>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id)} className="text-stone-400 hover:text-red-500">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 h-fit sticky top-24">
                <h3 className="font-serif text-xl font-bold mb-4">Order Summary</h3>
                <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-stone-600"><span>Subtotal</span><span>₹{total.toFixed(2)}</span></div>
                    <div className="flex justify-between text-stone-600"><span>Shipping</span><span>Free</span></div>
                    <div className="border-t pt-3 flex justify-between font-bold text-lg"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
                </div>
                <button onClick={handleCheckout} className="w-full bg-stone-900 text-white py-4 rounded-lg hover:bg-rose-600 transition duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    Proceed to Checkout
                </button>
            </div>
        </div>
    </div>
  );
};

// MAIN APP COMPONENT
const App = () => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [user, setUser] = useState<any>(null);
    const [isAuthReady, setIsAuthReady] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setIsAuthReady(true);
        });
        return () => unsubscribe();
    }, []);

    const cartContextValue = {
        cart,
        addToCart: (product: Product) => {
            setCart(prev => {
                const existing = prev.find(item => item.id === product.id);
                if (existing) {
                    return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
                }
                return [...prev, { ...product, quantity: 1 }];
            });
            alert("Added to bag!");
        },
        removeFromCart: (id: string) => setCart(prev => prev.filter(i => i.id !== id)),
        updateQuantity: (id: string, delta: number) => {
            setCart(prev => prev.map(item => {
                if (item.id === id) {
                    const newQ = item.quantity + delta;
                    return newQ > 0 ? { ...item, quantity: newQ } : item;
                }
                return item;
            }));
        },
        clearCart: () => setCart([]),
        total: cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)
    };

    return (
        <CartContext.Provider value={cartContextValue}>
            <Router>
                <Layout>
                    <ErrorBoundary>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/shop" element={<Shop />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/product/:id" element={<ProductDetail />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/admin/login" element={<AdminLogin />} />
                            <Route path="/admin/dashboard" element={<AdminDashboard />} />
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </ErrorBoundary>
                    <AIStylist />
                </Layout>
            </Router>
        </CartContext.Provider>
    );
};

export default App;