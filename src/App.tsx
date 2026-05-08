import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Sidebar from './components/Sidebar';
import TaskList from './components/TaskList';
import AddTask from './components/AddTask';
import FocusMode from './components/FocusMode';
import Insights from './components/Insights';
import Checkout from './components/Checkout';
import { useTasks } from './useTasks';
import { Section } from './types';
import { useTheme } from './ThemeContext';
import { cn } from './lib/utils';
import { Menu, Zap } from 'lucide-react';

export default function App() {
  const { theme } = useTheme();
  const { tasks, addTask, toggleTask, deleteTask, updateTask, reorderTasks, stats } = useTasks();
  
  const [activeSection, setActiveSection] = useState<Section | 'insights' | 'settings' | 'checkout'>('today');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Filter tasks based on section
  const sectionTasks = tasks
    .filter(t => t.section === (activeSection as Section))
    .sort((a, b) => a.order - b.order);

  const incompleteTasks = sectionTasks.filter(t => !t.completed);
  const completedTasks = sectionTasks.filter(t => t.completed);

  return (
    <div className="flex min-h-screen">
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <main className="flex-1 min-w-0 p-4 lg:p-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-3 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <Menu size={20} />
              </button>
              <div>
                <h2 className="text-4xl font-bold tracking-tight capitalize">{activeSection}</h2>
                <p className="text-sm opacity-50 font-medium mt-1">
                  {incompleteTasks.length} tasks remaining for your clarity.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFocusMode(true)}
                className={cn(
                  "hidden sm:flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg",
                  theme.accent
                )}
              >
                <Zap size={18} fill="currentColor" />
                Focus Mode
              </button>
            </div>
          </header>

          {/* Main Content Areas */}
          <AnimatePresence mode="wait">
            {activeSection === 'insights' ? (
              <motion.div
                key="insights"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Insights stats={stats} tasks={tasks} />
              </motion.div>
            ) : activeSection === 'checkout' ? (
              <motion.div
                key="checkout"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Checkout />
              </motion.div>
            ) : activeSection === 'settings' ? (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={cn("p-12 rounded-[40px] border shadow-sm text-center", theme.card, theme.border)}
              >
                <h3 className="text-2xl font-bold mb-4">Settings</h3>
                <p className="opacity-50">Customization and account settings will appear here.</p>
              </motion.div>
            ) : (
              <motion.div
                key="tasks"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-12"
              >
                <AddTask 
                  onAdd={addTask} 
                  defaultSection={activeSection as Section} 
                />

                <div className="space-y-10">
                  {incompleteTasks.length > 0 && (
                    <div className="space-y-4">
                      <TaskList 
                        tasks={incompleteTasks}
                        onToggle={toggleTask}
                        onDelete={deleteTask}
                        onUpdate={updateTask}
                        onReorder={(newIncomplete) => {
                          const updatedTasks = [
                            ...tasks.filter(t => t.section !== activeSection || t.completed),
                            ...newIncomplete,
                            ...completedTasks
                          ];
                          reorderTasks(updatedTasks);
                        }}
                      />
                    </div>
                  )}

                  {completedTasks.length > 0 && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-30">Completed</span>
                        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
                      </div>
                      <TaskList 
                        tasks={completedTasks}
                        onToggle={toggleTask}
                        onDelete={deleteTask}
                        onUpdate={updateTask}
                        onReorder={(newCompleted) => {
                          const updatedTasks = [
                            ...tasks.filter(t => t.section !== activeSection || !t.completed),
                            ...incompleteTasks,
                            ...newCompleted
                          ];
                          reorderTasks(updatedTasks);
                        }}
                      />
                    </div>
                  )}

                  {sectionTasks.length === 0 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.4 }}
                      className="py-24 flex flex-col items-center justify-center text-center space-y-4"
                    >
                      <div className="w-20 h-20 rounded-full border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center">
                        <Zap size={32} />
                      </div>
                      <div>
                        <h3 className="font-bold">The canvas is blank</h3>
                        <p className="text-sm">Add a task to start your path to clarity.</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Overlays */}
      <AnimatePresence>
        {isFocusMode && (
          <FocusMode 
            tasks={tasks} 
            onToggle={toggleTask} 
            onExit={() => setIsFocusMode(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
