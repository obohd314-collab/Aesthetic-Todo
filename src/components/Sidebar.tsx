import { motion, AnimatePresence } from 'motion/react';
import { 
  Inbox, 
  Sun, 
  Calendar, 
  FolderHeart, 
  Settings, 
  BarChart2, 
  Zap,
  CheckCircle2,
  Menu,
  X
} from 'lucide-react';
import { Section } from '../types';
import { THEMES } from '../constants';
import { useTheme } from '../ThemeContext';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeSection: Section | 'insights' | 'settings';
  setActiveSection: (section: any) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ activeSection, setActiveSection, isOpen, setIsOpen }: SidebarProps) {
  const { theme, setTheme } = useTheme();

  const menuItems = [
    { id: 'inbox', label: 'Inbox', icon: Inbox },
    { id: 'today', label: 'Today', icon: Sun },
    { id: 'upcoming', label: 'Upcoming', icon: Calendar },
    { id: 'someday', label: 'Someday', icon: FolderHeart },
    { id: 'insights', label: 'Insights', icon: BarChart2 },
    { id: 'checkout', label: 'Clarity Pro', icon: Zap },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : -300 }}
        className={cn(
          "fixed top-0 left-0 bottom-0 w-72 z-50 transition-colors duration-500",
          "lg:relative lg:translate-x-0 border-r",
          theme.card,
          theme.border
        )}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className={cn("p-2 rounded-xl text-white", theme.accent)}>
              <Zap size={24} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Clarity</h1>
          </div>

          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    if (window.innerWidth < 1024) setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-medium",
                    isActive 
                      ? cn("text-white shadow-lg", theme.accent) 
                      : cn(theme.text, "hover:bg-zinc-100 dark:hover:bg-zinc-800")
                  )}
                >
                  <Icon size={20} className={cn("transition-transform group-hover:scale-110", isActive ? "text-white" : "opacity-60")} />
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto space-y-6">
            <div>
              <p className={cn("text-xs font-semibold uppercase tracking-wider mb-4 opacity-50 px-4")}>Themes</p>
              <div className="flex flex-wrap gap-2 px-2">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-all hover:scale-110",
                      t.id === theme.id ? "border-zinc-400 scale-110" : "border-transparent",
                      t.id === 'midnight' ? 'bg-zinc-900' : 
                      t.id === 'sakura' ? 'bg-rose-300' : 
                      t.id === 'ocean' ? 'bg-sky-300' : 
                      t.id === 'forest' ? 'bg-emerald-300' : 'bg-zinc-200'
                    )}
                    title={t.name}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={() => setActiveSection('settings')}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm",
                activeSection === 'settings' 
                  ? cn("text-white shadow-lg", theme.accent)
                  : cn(theme.text, "hover:bg-zinc-100 dark:hover:bg-zinc-800")
              )}
            >
              <Settings size={20} />
              Settings
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
