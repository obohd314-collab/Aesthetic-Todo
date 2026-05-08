import { useState, useEffect, useCallback } from 'react';
import { Task, Section, Priority, Stats } from './types';
import confetti from 'canvas-confetti';
import { supabase } from './lib/supabase';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    completedToday: 0,
    totalCompleted: 0,
    productivityScore: 0,
    streak: 0,
  });

  // Fetch from Supabase on mount
  useEffect(() => {
    async function fetchTasks() {
      try {
        const { data, error } = await supabase()
          .from('tasks')
          .select('*')
          .order('order', { ascending: true });

        if (error) throw error;

        if (data) {
          const formattedTasks: Task[] = data.map(t => ({
            id: t.id,
            title: t.title,
            note: t.note,
            dueDate: t.due_date,
            priority: t.priority as Priority,
            category: t.category,
            completed: t.completed,
            section: t.section as Section,
            subtasks: t.subtasks || [],
            createdAt: t.created_at,
            order: t.order,
          }));
          setTasks(formattedTasks);
        }
      } catch (err) {
        console.error('Supabase fetch error:', err);
        // Fallback to localStorage
        const saved = localStorage.getItem('clarity-tasks');
        if (saved) setTasks(JSON.parse(saved));
      } finally {
        setIsLoading(false);
      }
    }
    fetchTasks();
  }, []);

  // Update stats whenever tasks change
  useEffect(() => {
    localStorage.setItem('clarity-tasks', JSON.stringify(tasks));
    
    const today = new Date().toDateString();
    const completedTodayCount = tasks.filter(t => t.completed && new Date(t.createdAt).toDateString() === today).length;
    const totalCompleted = tasks.filter(t => t.completed).length;
    
    setStats(prev => ({
      ...prev,
      completedToday: completedTodayCount,
      totalCompleted,
      productivityScore: tasks.length > 0 ? Math.round((totalCompleted / tasks.length) * 100) : 0
    }));
  }, [tasks]);

  const addTask = async (title: string, section: Section, priority: Priority = 'medium', category: string = 'Personal') => {
    const newTask: Omit<Task, 'id' | 'createdAt'> = {
      title,
      completed: false,
      section,
      priority,
      category,
      subtasks: [],
      order: tasks.length,
    };

    try {
      const { data, error } = await supabase()
        .from('tasks')
        .insert([{
          title: newTask.title,
          completed: newTask.completed,
          section: newTask.section,
          priority: newTask.priority,
          category: newTask.category,
          subtasks: newTask.subtasks,
          order: newTask.order
        }])
        .select();

      if (error) throw error;
      if (data && data[0]) {
        setTasks(prev => [...prev, {
          ...newTask,
          id: data[0].id,
          createdAt: data[0].created_at,
          priority: data[0].priority as Priority,
          section: data[0].section as Section,
        } as Task]);
      }
    } catch (err) {
      console.error('Supabase add error:', err);
      // Local addition if sync fails
      const localTask: Task = {
        ...newTask,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      } as Task;
      setTasks(prev => [...prev, localTask]);
    }
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newCompleted = !task.completed;

    try {
      const { error } = await supabase()
        .from('tasks')
        .update({ completed: newCompleted })
        .eq('id', id);

      if (error) throw error;

      if (newCompleted) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#818cf8', '#f472b6', '#4ade80']
        });
      }

      setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: newCompleted } : t));
    } catch (err) {
      console.error('Supabase toggle error:', err);
      setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: newCompleted } : t));
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase()
        .from('tasks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Supabase delete error:', err);
      setTasks(prev => prev.filter(t => t.id !== id));
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const dbUpdates: any = {};
      if (updates.title) dbUpdates.title = updates.title;
      if (updates.completed !== undefined) dbUpdates.completed = updates.completed;
      if (updates.priority) dbUpdates.priority = updates.priority;
      if (updates.section) dbUpdates.section = updates.section;
      if (updates.order !== undefined) dbUpdates.order = updates.order;
      if (updates.category) dbUpdates.category = updates.category;
      if (updates.note) dbUpdates.note = updates.note;

      const { error } = await supabase()
        .from('tasks')
        .update(dbUpdates)
        .eq('id', id);
      
      if (error) throw error;
      setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    } catch (err) {
      console.error('Supabase update error:', err);
      setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    }
  };

  const reorderTasks = async (newTasks: Task[]) => {
    setTasks(newTasks);
    // Note: In a production app, you'd want to batch update the 'order' field in Supabase here
    // for simplicity, we update locally and let the next interaction sync or stick with the local state.
  };

  return {
    tasks,
    isLoading,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    reorderTasks,
    stats,
  };
}
