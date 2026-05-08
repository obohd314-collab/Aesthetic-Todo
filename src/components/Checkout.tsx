import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { CreditCard, Shield, Zap, Check, ArrowRight } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';

export default function Checkout() {
  const { theme } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    plan: 'Clarity Pro (Lifetime)',
    amount: 29.00
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase()
        .from('checkouts')
        .insert([
          {
            full_name: formData.fullName,
            email: formData.email,
            plan: formData.plan,
            amount: formData.amount,
            status: 'completed'
          }
        ]);

      if (error) throw error;
      
      setIsSuccess(true);
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Checkout failed. Please ensure you have created the "checkouts" table in Supabase.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn("p-12 rounded-[40px] border shadow-sm text-center max-w-2xl mx-auto", theme.card, theme.border)}
      >
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={40} />
        </div>
        <h2 className="text-3xl font-bold mb-4">Welcome to Clarity Pro</h2>
        <p className="opacity-50 mb-8 text-lg">Your order has been confirmed. Your journey to deeper focus begins now.</p>
        <button 
          onClick={() => window.location.reload()}
          className={cn("px-8 py-4 rounded-2xl text-white font-bold transition-all shadow-lg", theme.accent)}
        >
          Return Home
        </button>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-8"
      >
        <div>
          <h2 className="text-4xl font-bold tracking-tight mb-4">Upgrade to Pro</h2>
          <p className="text-lg opacity-50 font-medium">Unlock the full potential of Clarity and master your intentions.</p>
        </div>

        <div className="space-y-4">
          {[
            "Unlimited Projects & Sections",
            "Cloud Sync across all devices",
            "Advanced Productivity Insights",
            "Custom Theme Builder",
            "Focus Mode Soundscapes"
          ].map(feature => (
            <div key={feature} className="flex items-center gap-3">
              <div className={cn("p-1 rounded-full text-white", theme.accent)}>
                <Check size={14} />
              </div>
              <span className="font-medium">{feature}</span>
            </div>
          ))}
        </div>

        <div className={cn("p-8 rounded-[32px] border", theme.card, theme.border)}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold uppercase tracking-widest opacity-40">One-time payment</span>
            <Zap size={20} className="text-amber-500" fill="currentColor" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-black tracking-tighter">$29</span>
            <span className="text-sm font-bold opacity-30">lifetime access</span>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className={cn("p-10 rounded-[40px] border shadow-2xl overflow-hidden relative", theme.card, theme.border)}
      >
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest opacity-40 px-1">Full Name</label>
            <input 
              required
              placeholder="e.g. Alex Chen"
              value={formData.fullName}
              onChange={e => setFormData({...formData, fullName: e.target.value})}
              className="w-full bg-zinc-50 dark:bg-zinc-800 p-4 rounded-2xl border-none outline-none focus:ring-2 ring-indigo-500/20 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest opacity-40 px-1">Email Address</label>
            <input 
              required
              type="email"
              placeholder="alex@focus.com"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full bg-zinc-50 dark:bg-zinc-800 p-4 rounded-2xl border-none outline-none focus:ring-2 ring-indigo-500/20 transition-all"
            />
          </div>

          <div className="pt-4">
            <button 
              disabled={isSubmitting}
              className={cn(
                "w-full py-5 rounded-2xl text-white font-bold transition-all shadow-xl flex items-center justify-center gap-3",
                theme.accent,
                isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02] active:scale-[0.98]"
              )}
            >
              {isSubmitting ? 'Processing...' : (
                <>
                  Complete Purchase <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 opacity-30 text-xs font-medium">
            <Shield size={14} />
            Secure Checkout powered by Supabase
          </div>
        </form>

        <div className={cn("absolute -bottom-24 -right-24 w-64 h-64 blur-3xl opacity-10", theme.accent)} />
      </motion.div>
    </div>
  );
}
