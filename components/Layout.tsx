import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search } from 'lucide-react';
import { useCart } from '../App';
import { auth } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cart } = useCart();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isActive = (path: string) => location.pathname === path ? 'text-stone-900 font-bold' : 'text-stone-500 hover:text-rose-400';

  return (
    <div className="min-h-screen flex flex-col font-sans text-stone-800 bg-white">
      {/* Top Announcement Bar */}
      <div className="bg-rose-50 text-center py-2 text-[10px] md:text-xs uppercase tracking-widest font-medium text-stone-600">
        Free Shipping on orders ₹2000+
      </div>

      {/* Main Header */}
      <header className={`bg-white sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-md py-1' : 'py-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Row: Mobile Menu | Logo | User Actions */}
          <div className={`flex justify-between items-center transition-all duration-300 ${isScrolled ? 'py-3 md:py-4' : 'py-6 md:py-8'} relative`}>
            
            {/* Mobile Menu Trigger */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-stone-600">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Logo - Centered Absolute on Desktop, Relative on Mobile */}
            <div className="md:absolute md:left-1/2 md:-translate-x-1/2 text-center">
              <Link to="/" className="font-serif text-3xl md:text-4xl tracking-widest font-bold text-stone-900 uppercase">
                Kawai <span className="text-stone-400 font-light">Fits</span>
              </Link>
            </div>

            {/* Right Actions */}
            <div className="ml-auto flex items-center space-x-4 md:space-x-6 text-xs font-bold uppercase tracking-wider text-stone-500">
              <Link to={user ? "/admin/dashboard" : "/admin/login"} className="hover:text-rose-500 transition-colors" title={user ? "Admin Dashboard" : "Admin Login"}>
                <Search size={20} className="hidden" /> {/* Placeholder for search if needed */}
                <span className="text-[10px] border border-stone-200 px-2 py-1 rounded hover:bg-stone-50">
                  {user ? 'Dashboard' : 'Admin'}
                </span>
              </Link>
              <Link to="/cart" className="flex items-center gap-1 hover:text-rose-500">
                <span className="hidden md:inline">Cart</span>
                <span className="md:hidden"><ShoppingBag size={20}/></span>
                <span>({cart.reduce((acc: number, item: any) => acc + item.quantity, 0)})</span>
              </Link>
            </div>
          </div>

          {/* Desktop Navigation Strip */}
          <div className="hidden md:flex justify-center items-center py-4 border-y border-stone-50 space-x-12 text-xs font-bold uppercase tracking-widest text-stone-500">
            <Link to="/" className={isActive('/')}>Home</Link>
            <Link to="/shop" className={isActive('/shop')}>Catalog</Link>
            <Link to="/about" className={isActive('/about')}>About</Link>
            <Link to="/contact" className={isActive('/contact')}>Contact</Link>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-stone-100 absolute w-full z-50">
            <div className="px-4 py-4 space-y-4 text-center">
              <Link to="/" className="block text-sm uppercase tracking-wider text-stone-600" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/shop" className="block text-sm uppercase tracking-wider text-stone-600" onClick={() => setIsMenuOpen(false)}>Catalog</Link>
              <Link to="/about" className="block text-sm uppercase tracking-wider text-stone-600" onClick={() => setIsMenuOpen(false)}>About</Link>
              <Link to="/contact" className="block text-sm uppercase tracking-wider text-stone-600" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white text-stone-500 pt-16 pb-8 border-t border-stone-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
          
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start">
             <span className="font-serif text-xl font-bold tracking-widest text-stone-900 uppercase mb-4">Kawai Fits</span>
             {/* Social Icons Placeholder */}
             <div className="flex gap-4 mt-2">
                <div className="w-8 h-8 rounded-full bg-stone-100 hover:bg-rose-200 transition-colors flex items-center justify-center cursor-pointer">
                    <span className="text-xs font-bold">Ig</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-stone-100 hover:bg-rose-200 transition-colors flex items-center justify-center cursor-pointer">
                    <span className="text-xs font-bold">Fb</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-stone-100 hover:bg-rose-200 transition-colors flex items-center justify-center cursor-pointer">
                    <span className="text-xs font-bold">Pi</span>
                </div>
             </div>
          </div>

          {/* Menu */}
          <div>
            <h4 className="font-serif italic text-lg text-stone-800 mb-4">menu</h4>
            <ul className="space-y-2 text-xs uppercase tracking-wider">
              <li><Link to="/" className="hover:text-rose-400 transition">Home</Link></li>
              <li><Link to="/shop" className="hover:text-rose-400 transition">Catalog</Link></li>
              <li><Link to="/about" className="hover:text-rose-400 transition">About</Link></li>
              <li><Link to="/contact" className="hover:text-rose-400 transition">Contact</Link></li>
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-serif italic text-lg text-stone-800 mb-4">explore</h4>
            <ul className="space-y-2 text-xs uppercase tracking-wider">
              <li><Link to="/shop" className="hover:text-rose-400 transition">New Arrivals</Link></li>
              <li><Link to="/shop" className="hover:text-rose-400 transition">Dresses</Link></li>
              <li><Link to="/shop" className="hover:text-rose-400 transition">Tops</Link></li>
              <li><Link to="/shop" className="hover:text-rose-400 transition">Sale</Link></li>
            </ul>
          </div>

          {/* Get In Touch */}
          <div>
            <h4 className="font-serif italic text-lg text-stone-800 mb-4">get in touch</h4>
            <p className="text-xs leading-relaxed mb-4">
              Have questions? We'd love to hear from you.
            </p>
             <Link to="/contact" className="text-xs font-bold uppercase tracking-widest border-b border-stone-300 hover:text-rose-500 hover:border-rose-500 pb-1">Contact Us</Link>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 text-center text-[10px] uppercase tracking-widest text-stone-400">
          Powered by React & Gemini • Theme by Kawai Fits
        </div>
      </footer>
    </div>
  );
};

export default Layout;