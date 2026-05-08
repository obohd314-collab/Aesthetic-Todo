import { motion, AnimatePresence } from 'motion/react';
import { Task } from '../types';
import { useTheme } from '../ThemeContext';
import { cn } from '../lib/utils';
import { Check, X, ArrowLeft, ArrowRight, Zap } from 'lucide-react';
import { useState } from 'react';

interface FocusModeProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onExit: () => void;
}

export default function FocusMode({ tasks, onToggle, onExit }: FocusModeProps) {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const activeTasks = tasks.filter(t => !t.completed);

  if (activeTasks.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-zinc-950"
      >
        <div className={cn("p-6 rounded-full mb-8 text-white", theme.accent)}>
          <Zap size={48} />
        </div>
        <h2 className="text-4xl font-bold mb-4">All Clear</h2>
        <p className="text-zinc-500 mb-8 max-w-sm">You've completed all your important tasks. Take a moment to breathe.</p>
        <button 
          onClick={onExit}
          className={cn("px-8 py-4 rounded-2xl text-white font-bold transition-transform hover:scale-105", theme.accent)}
        >
          Return to Dashboard
        </button>
      </motion.div>
    );
  }

  const currentTask = activeTasks[currentIndex % activeTasks.length];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-white dark:bg-zinc-900 flex flex-col items-center justify-center p-8 overflow-hidden"
    >
      <button 
        onClick={onExit}
        className="absolute top-8 left-8 p-3 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      >
        <X size={24} />
      </button>

      <div className="absolute top-8 right-8">
        <span className={cn("px-4 py-2 rounded-full font-bold text-sm", theme.accent, "text-white")}>
          Focus Mode
        </span>
      </div>

      <div className="w-full max-w-3xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTask.id}
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 1.1 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="flex flex-col items-center text-center space-y-12"
          >
            <div className={cn("px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest opacity-50")}>
              {currentTask.category}
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
              {currentTask.title}
            </h1>

            {currentTask.note && (
              <p className="text-xl text-zinc-500 max-w-lg italic">
                "{currentTask.note}"
              </p>
            )}

            <div className="flex items-center gap-6 pt-12">
              <button
                onClick={() => onToggle(currentTask.id)}
                className={cn(
                  "w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group",
                  theme.accent, "text-white shadow-2xl"
                )}
              >
                <Check size={40} strokeWidth={3} className="group-hover:scale-110" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-12 flex items-center gap-8">
        <button 
          onClick={() => setCurrentIndex(prev => (prev - 1 + activeTasks.length) % activeTasks.length)}
          className="p-4 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors opacity-40 hover:opacity-100"
        >
          <ArrowLeft size={24} />
        </button>
        <span className="font-mono text-sm opacity-40">
          {currentIndex + 1} / {activeTasks.length}
        </span>
        <button 
          onClick={() => setCurrentIndex(prev => (prev + 1) % activeTasks.length)}
          className="p-4 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors opacity-40 hover:opacity-100"
        >
          <ArrowRight size={24} />
        </button>
      </div>
    </motion.div>
  );
}
