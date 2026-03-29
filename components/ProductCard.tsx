import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="group flex flex-col">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-50 mb-4 cursor-pointer">
        <Link to={`/product/${product.id}`}>
            <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-in-out"
            />
        </Link>
        
        {/* Quick Add Overlay */}
        <button 
            onClick={() => onAddToCart(product)}
            className="absolute inset-x-0 bottom-0 bg-white/90 py-3 text-xs font-bold uppercase tracking-widest text-stone-900 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hover:bg-rose-400 hover:text-white"
        >
            Add to Cart
        </button>
      </div>

      {/* Details */}
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">{product.category}</p>
        <Link to={`/product/${product.id}`}>
            <h3 className="font-serif text-lg text-stone-800 leading-tight mb-1 truncate px-2 hover:text-rose-500 transition-colors">{product.title}</h3>
        </Link>
        <p className="font-sans text-xs font-bold text-stone-900">₹{((product.price || 0) + (product.shipping || 0)).toFixed(2)}</p>
        {product.shipping && product.shipping > 0 ? (
          <p className="text-[8px] text-stone-400 uppercase tracking-widest mt-1">Incl. ₹{product.shipping} shipping</p>
        ) : (
          <p className="text-[8px] text-stone-400 uppercase tracking-widest mt-1">Free Shipping</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;