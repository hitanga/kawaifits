import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useCart } from '../App';
import { API_BASE_URL } from '../config';

const Contact: React.FC = () => {
  const location = useLocation();
  const { clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    console.log('API_BASE_URL:', API_BASE_URL || '(local)');
  }, []);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (location.state && location.state.orderMessage) {
      setFormData(prev => ({
        ...prev,
        message: location.state.orderMessage
      }));
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/send-email/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send email.');
      }

      setSubmitted(true);
      if (location.state && location.state.orderMessage) {
        clearCart();
      }
    } catch (err: any) {
      console.error('Error sending email:', err);
      setError(err.message || 'Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl text-stone-900 mb-4">Get in Touch</h1>
        <p className="text-stone-500">We'd love to hear from you. Fill out the form below.</p>
      </div>

      {submitted ? (
        <div className="bg-rose-50 p-8 text-center rounded-lg border border-rose-100 animate-fade-in">
          <h3 className="font-serif text-2xl text-stone-800 mb-2">Message Sent!</h3>
          <p className="text-stone-600">Thank you for contacting us. We will get back to you shortly.</p>
          <button onClick={() => setSubmitted(false)} className="mt-6 text-xs font-bold uppercase tracking-widest text-rose-500 hover:text-rose-600">Send another</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Info */}
          <div className="bg-stone-50 p-8 rounded-sm h-fit">
             <h3 className="font-serif text-xl font-bold mb-6 text-stone-800">Customer Care</h3>
             <div className="space-y-4 text-sm text-stone-600">
                <p><span className="font-bold block text-stone-900 uppercase text-xs tracking-wider mb-1">Email</span> hello@kawaifits.com</p>
                <p><span className="font-bold block text-stone-900 uppercase text-xs tracking-wider mb-1">Phone</span> +1 (555) 123-4567</p>
                <p><span className="font-bold block text-stone-900 uppercase text-xs tracking-wider mb-1">Address</span> 123 Fashion Ave, Suite 100<br/>New York, NY 10012</p>
             </div>
             <div className="mt-8 pt-8 border-t border-stone-200">
                <p className="italic text-xs text-stone-500">Hours: Mon-Fri 9am - 6pm EST</p>
             </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
             <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Name</label>
                <input 
                  required 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border-b border-stone-200 py-2 focus:outline-none focus:border-stone-900 transition-colors" 
                />
             </div>
             <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Email</label>
                <input 
                  required 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full border-b border-stone-200 py-2 focus:outline-none focus:border-stone-900 transition-colors" 
                />
             </div>
             <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Message / Order Details</label>
                <textarea 
                  required 
                  rows={8} 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full border-b border-stone-200 py-2 focus:outline-none focus:border-stone-900 transition-colors resize-none"
                ></textarea>
             </div>
             {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
                  {error}
                </div>
             )}
             <button 
               disabled={loading}
               className="bg-stone-900 text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-rose-500 transition-colors disabled:opacity-50"
             >
                {loading ? 'Sending...' : (location.state?.orderMessage ? 'Send Order Request' : 'Send Message')}
             </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Contact;