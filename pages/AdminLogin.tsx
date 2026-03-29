import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Phone, Key, ArrowRight } from 'lucide-react';
import { auth } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { API_BASE_URL } from '../config';

const AdminLogin: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  useEffect(() => {
    console.log('API_BASE_URL:', API_BASE_URL || '(local)');
  }, []);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate('/admin/dashboard');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {}
      });
    }
  }, []);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Check if it's the admin phone number via backend first
      const checkResponse = await fetch(`${API_BASE_URL}/api/admin/send-otp/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      let data;
      const contentType = checkResponse.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await checkResponse.json();
      }

      if (!checkResponse.ok) {
        throw new Error(data?.error || `Server error: ${checkResponse.status}`);
      }

      const appVerifier = (window as any).recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(result);
      setStep('otp');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/operation-not-allowed') {
        setError('Phone Authentication is not enabled in Firebase. Please enable it in the Firebase Console: https://console.firebase.google.com/project/gen-lang-client-0152785519/authentication/providers');
      } else {
        setError(err.message || 'Failed to send OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!confirmationResult) throw new Error('No confirmation result found.');
      await confirmationResult.confirm(otp);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-10 border border-stone-100 shadow-2xl rounded-2xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield size={32} />
          </div>
          <h1 className="font-serif text-3xl text-stone-900 mb-2">Admin Access</h1>
          <p className="text-stone-500 text-sm">Secure login for Kawai Fits management</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-4 py-3 border-b border-stone-200 focus:outline-none focus:border-stone-900 transition-colors"
                  required
                />
              </div>
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-stone-900 text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-rose-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send OTP'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">Enter OTP</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                <input 
                  type="text" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full pl-10 pr-4 py-3 border-b border-stone-200 focus:outline-none focus:border-stone-900 transition-colors tracking-[0.5em] text-center text-xl font-bold"
                  required
                  maxLength={6}
                />
              </div>
              <p className="mt-4 text-[10px] text-stone-400 text-center">
                Didn't receive code? <button type="button" onClick={() => setStep('phone')} className="text-rose-400 font-bold hover:underline">Resend</button>
              </p>
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-stone-900 text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-rose-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>
        )}
      </div>
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default AdminLogin;
