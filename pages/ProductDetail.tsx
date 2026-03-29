import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FirebaseService } from '../services/firebaseService';
import { Product } from '../types';
import { useCart } from '../App';
import { Truck, RefreshCw, ShieldCheck, Sparkles } from 'lucide-react';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [activeImage, setActiveImage] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      if (id) {
        try {
          const products = await FirebaseService.getProducts();
          const found = products.find(p => p.id === id);
          if (found) {
            setProduct(found);
            setActiveImage(found.image);
          } else {
            setTimeout(() => navigate('/shop'), 2000);
          }
        } catch (error) {
          console.error('Error fetching product:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProduct();
  }, [id, navigate]);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!product) return <div className="h-screen flex items-center justify-center">Product not found. Redirecting...</div>;

  const allImages = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 fade-in">
      {/* Breadcrumb */}
      <div className="text-xs uppercase tracking-widest text-stone-400 mb-8">
        <span className="hover:text-stone-800 cursor-pointer" onClick={() => navigate('/')}>Home</span> / 
        <span className="hover:text-stone-800 cursor-pointer mx-1" onClick={() => navigate('/shop')}>Catalog</span> / 
        <span className="text-stone-800 ml-1">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        {/* Left: Gallery */}
        <div className="flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnails (Vertical on desktop, horizontal on mobile) */}
          <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible no-scrollbar">
            {allImages.map((img, idx) => (
              <div 
                key={idx} 
                onClick={() => setActiveImage(img)}
                className={`w-20 h-24 flex-shrink-0 cursor-pointer border-2 transition-all duration-200 ${activeImage === img ? 'border-stone-800 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={img} alt={`View ${idx}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          
          {/* Main Image */}
          <div className="flex-1 bg-stone-50 aspect-[3/4] relative overflow-hidden group">
            <img 
              src={activeImage} 
              alt={product.title} 
              className="w-full h-full object-cover object-center transition-transform duration-500" 
            />
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex flex-col justify-center">
          <h1 className="font-serif text-4xl md:text-5xl text-stone-900 mb-4">{product.title}</h1>
          <div className="mb-6">
            <p className="text-2xl font-sans text-stone-900 font-bold">₹{((product.price || 0) + (product.shipping || 0)).toFixed(2)}</p>
            {product.shipping && product.shipping > 0 ? (
              <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1">
                Base: ₹{product.price} + Shipping: ₹{product.shipping}
              </p>
            ) : (
              <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1">Free Shipping Included</p>
            )}
          </div>
          
          <div className="text-stone-600 mb-8 leading-relaxed whitespace-pre-line">
            {product.description}
          </div>

          <div className="flex flex-col gap-4 mb-8">
            <button 
              onClick={() => addToCart(product)}
              className="w-full bg-stone-900 text-white py-4 px-8 uppercase tracking-widest text-sm font-bold hover:bg-rose-400 transition-colors duration-300 shadow-lg"
            >
              Add to Cart
            </button>
            <div className="w-full py-4 px-8 bg-stone-50 rounded-lg flex items-center justify-center gap-3 text-stone-500 italic">
              <Sparkles size={16} className="text-rose-300" />
              <span className="text-xs uppercase tracking-widest font-medium">Ethically sourced & handmade with love</span>
            </div>
          </div>

          {/* Features / Icons */}
          <div className="grid grid-cols-3 gap-4 border-t border-stone-100 pt-6 text-center">
             <div className="flex flex-col items-center gap-2">
                <Truck size={20} className="text-stone-400" />
                <span className="text-[10px] uppercase tracking-widest text-stone-500">Free Shipping</span>
             </div>
             <div className="flex flex-col items-center gap-2">
                <RefreshCw size={20} className="text-stone-400" />
                <span className="text-[10px] uppercase tracking-widest text-stone-500">Free Returns</span>
             </div>
             <div className="flex flex-col items-center gap-2">
                <ShieldCheck size={20} className="text-stone-400" />
                <span className="text-[10px] uppercase tracking-widest text-stone-500">Secure Pay</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;