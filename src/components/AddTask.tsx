import { motion, AnimatePresence } from 'motion/react';
import { useState, FormEvent } from 'react';
import { Plus, X, Calendar, Flag, Tag, ChevronDown } from 'lucide-react';
import { Section, Priority } from '../types';
import { useTheme } from '../ThemeContext';
import { CATEGORIES, PRIORITIES } from '../constants';
import { cn } from '../lib/utils';

interface AddTaskProps {
  onAdd: (title: string, section: Section, priority: Priority, category: string) => void;
  defaultSection: Section;
}

export default function AddTask({ onAdd, defaultSection }: AddTaskProps) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState(CATEGORIES[0]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title, defaultSection, priority, category);
    setTitle('');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "w-full flex items-center gap-3 px-6 py-5 rounded-3xl border-2 border-dashed transition-all duration-300",
          "hover:border-zinc-300 dark:hover:border-zinc-700 opacity-60 hover:opacity-100",
          theme.card,
          theme.border
        )}
      >
        <div className={cn("p-1.5 rounded-lg text-white", theme.accent)}>
          <Plus size={18} />
        </div>
        <span className="text-sm font-semibold opacity-50">Capture your next intention...</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={cn(
                "fixed top-1/4 left-1/2 -translate-x-1/2 w-full max-w-xl z-[101] p-8 rounded-[40px] border shadow-2xl overflow-hidden",
                theme.card,
                theme.border
              )}
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold tracking-tight">New Intention</h3>
                  <button 
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <input
                  autoFocus
                  placeholder="What needs clarity?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-transparent text-2xl font-bold border-none outline-none placeholder:opacity-20"
                />

                <div className="flex flex-wrap gap-4">
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 px-1">Priority</p>
                    <div className="flex gap-2">
                      {(Object.keys(PRIORITIES) as Priority[]).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriority(p)}
                          className={cn(
                            "px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
                            priority === p 
                              ? theme.accent + " text-white shadow-md shadow-zinc-200 dark:shadow-none"
                              : "bg-zinc-100 dark:bg-zinc-800 opacity-60"
                          )}
                        >
                          {p.charAt(0).toUpperCase() + p.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 flex-1 min-w-[200px]">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 px-1">Category</p>
                    <div className="relative group">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className={cn(
                          "w-full appearance-none px-4 py-2 rounded-xl text-xs font-bold bg-zinc-100 dark:bg-zinc-800 outline-none cursor-pointer pr-10 border-none"
                        )}
                      >
                        {CATEGORIES.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className={cn(
                      "w-full py-4 rounded-2xl text-white font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg",
                      theme.accent
                    )}
                  >
                    Add to {defaultSection.charAt(0).toUpperCase() + defaultSection.slice(1)}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
