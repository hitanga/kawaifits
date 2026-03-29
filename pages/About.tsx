import React from 'react';
import { useNavigate } from 'react-router-dom';

const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Left: Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 shadow-xl">
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2600&auto=format&fit=crop" 
            alt="Kawai Fits Story" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-stone-900/10"></div>
        </div>

        {/* Right: Content */}
        <div className="flex flex-col justify-center">
          <span className="text-xs uppercase tracking-[0.3em] text-rose-400 font-bold mb-4">Our Story</span>
          <h1 className="font-serif text-5xl md:text-6xl text-stone-900 mb-8 leading-tight">
            The Essence of <br /> Kawai Fits
          </h1>
          
          <div className="space-y-6 text-stone-600 leading-relaxed font-serif italic text-lg">
            <p>
              Founded in the heart of the fashion district, Kawai Fits was born from a simple vision: to create a space where elegance meets modern innovation. We believe that fashion is not just about what you wear, but how it makes you feel.
            </p>
            <p>
              Our collections are carefully curated to celebrate the diverse beauty of women. From airy summer dresses to timeless outerwear, each piece is selected for its quality, style, and the story it tells.
            </p>
            <p>
              With our integrated AI Stylist, we're bridging the gap between traditional boutique experiences and the digital future, providing personalized fashion advice that understands your unique personality.
            </p>
          </div>

          <div className="mt-12 pt-12 border-t border-stone-100 flex gap-12">
            <div>
              <h4 className="font-serif text-3xl text-stone-900 mb-1">2018</h4>
              <p className="text-[10px] uppercase tracking-widest text-stone-400">Established</p>
            </div>
            <div>
              <h4 className="font-serif text-3xl text-stone-900 mb-1">50k+</h4>
              <p className="text-[10px] uppercase tracking-widest text-stone-400">Happy Clients</p>
            </div>
            <div>
              <h4 className="font-serif text-3xl text-stone-900 mb-1">15+</h4>
              <p className="text-[10px] uppercase tracking-widest text-stone-400">Design Partners</p>
            </div>
          </div>

          <button 
            onClick={() => navigate('/shop')}
            className="mt-12 self-start bg-stone-900 text-white px-10 py-4 text-xs font-bold uppercase tracking-widest hover:bg-rose-400 transition-colors shadow-lg"
          >
            Explore Collection
          </button>
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="mt-32 bg-stone-50 p-12 md:p-24 text-center">
        <h2 className="font-serif text-4xl text-stone-900 mb-8">Our Philosophy</h2>
        <div className="max-w-3xl mx-auto text-stone-600 leading-loose">
          <p className="text-xl italic font-serif">
            "We don't just sell clothes; we curate confidence. Every stitch, every fabric, and every silhouette is a testament to our commitment to timeless beauty and sustainable fashion practices."
          </p>
          <div className="mt-8 flex justify-center items-center gap-4">
            <div className="h-px w-12 bg-stone-300"></div>
            <span className="text-xs uppercase tracking-widest font-bold text-stone-400">Kawai Team</span>
            <div className="h-px w-12 bg-stone-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
