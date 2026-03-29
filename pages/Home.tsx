
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { FirebaseService } from '../services/firebaseService';
import ProductCard from '../components/ProductCard';
import { useCart } from '../App';

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = React.useState<Product[]>([]);
  const { addToCart } = useCart();

  React.useEffect(() => {
    const fetchFeatured = async () => {
      const all = await FirebaseService.getProducts();
      setFeaturedProducts(all.slice(0, 4));
    };
    fetchFeatured();
  }, []);

  return (
    <div className="w-full">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[600px] md:h-[700px] overflow-hidden group">
        {/* Light overlay to ensure dark text pops against the image */}
        <div className="absolute inset-0 bg-white/30 z-10"></div>
        
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2600&auto=format&fit=crop"
          alt="Floral Fashion Hero"
          className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-[2000ms]"
        />
        
        {/* Overlay Text Box */}
        <div className="absolute top-1/2 left-[10%] -translate-y-1/2 max-w-md p-8 fade-in z-20 bg-white/40 backdrop-blur-sm rounded-sm">
          <h2 className="font-serif text-5xl md:text-7xl text-stone-900 mb-6 lowercase tracking-tight">
            let's shop
          </h2>
          <p className="font-serif italic text-lg md:text-xl text-stone-800 mb-8 leading-relaxed">
            vicamus congue mauris in nisl finibus maximus. aenean in lorem vel mi laoreet semper.
          </p>
          <Link 
            to="/shop" 
            className="inline-block bg-rose-400 text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-colors shadow-sm"
          >
            Shop Collection
          </Link>
        </div>
      </section>

      {/* 2. FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h3 className="font-serif text-3xl md:text-4xl text-stone-800 mb-12 lowercase">
          featured products
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
          {featuredProducts.map((p) => (
             <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
          ))}
        </div>
      </section>

      {/* 3. SPLIT BANNER SECTION */}
      <section className="grid grid-cols-1 md:grid-cols-2 h-auto md:h-[500px]">
        {/* Left Image */}
        <div className="relative h-[400px] md:h-full bg-stone-200">
            <img 
                src="https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=2000&auto=format&fit=crop" 
                alt="Flatlay Cosmetics" 
                className="w-full h-full object-cover"
            />
        </div>
        {/* Right Content */}
        <div className="bg-[#d4a5a5] flex flex-col justify-center items-center text-center p-12 text-white">
            <span className="text-xs uppercase tracking-widest mb-2 opacity-90">Get The</span>
            <h2 className="font-serif text-4xl md:text-5xl mb-2">monthly subscription</h2>
            <p className="font-serif italic text-xl mb-8 opacity-90">delivered right to your door!</p>
            <Link to="/shop" className="border border-white/50 px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-[#d4a5a5] transition-colors">
                Learn More
            </Link>
        </div>
      </section>

      {/* 4. INSTAGRAM / GALLERY */}
      <section className="py-20 text-center">
        <h3 className="font-serif text-2xl text-stone-400 mb-10 lowercase">
           @ charlotte_demo on instagram
        </h3>
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
                'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=800&auto=format&fit=crop', // White items/desktop
                'https://images.unsplash.com/photo-1485230946086-1d99d5297123?q=80&w=800&auto=format&fit=crop', // Minimal
                'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800&auto=format&fit=crop', // Clothes rack
                'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop'  // Shoes/flowers
            ].map((img, i) => (
                <div key={i} className="aspect-square overflow-hidden bg-stone-100 group cursor-pointer">
                    <img src={img} alt="Gallery" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500 hover:scale-105 transform" />
                </div>
            ))}
        </div>
      </section>

      {/* 5. NEWSLETTER STRIP (The Pink Bar) */}
      <section className="bg-rose-50 py-10 border-t border-rose-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="font-serif text-2xl font-bold text-stone-800 lowercase">
                get on our list!
            </div>

            <div className="flex-1 w-full max-w-md flex">
                <input 
                    type="email" 
                    placeholder="email@example.com" 
                    className="flex-1 bg-white border border-stone-200 px-4 py-3 text-sm focus:outline-none font-serif italic"
                />
                <button className="bg-[#b58383] text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#a37070] transition-colors">
                    Subscribe
                </button>
            </div>

            <div className="flex items-center gap-4 text-stone-500">
                <span className="font-serif italic text-lg text-stone-800">join us on</span>
                <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-stone-400 hover:text-rose-500 cursor-pointer transition">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-stone-400 hover:text-rose-500 cursor-pointer transition">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-stone-400 hover:text-rose-500 cursor-pointer transition">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                    </div>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
