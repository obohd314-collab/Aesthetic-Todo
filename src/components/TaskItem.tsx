import { motion, Reorder, useDragControls, AnimatePresence } from 'motion/react';
import { 
  Check, 
  GripVertical, 
  MoreHorizontal, 
  Trash2, 
  Calendar as CalendarIcon,
  MessageSquare,
  ChevronRight,
  FolderHeart, 
  CheckCircle2
} from 'lucide-react';
import { Task } from '../types';
import { useTheme } from '../ThemeContext';
import { PRIORITIES } from '../constants';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

interface TaskItemProps {
  key?: string;
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
}

export default function TaskItem({ task, onToggle, onDelete, onUpdate }: TaskItemProps) {
  const { theme } = useTheme();
  const controls = useDragControls();

  const priorityStyles = PRIORITIES[task.priority];

  return (
    <Reorder.Item
      value={task}
      id={task.id}
      dragControls={controls}
      dragListener={false}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileDrag={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
      className={cn(
        "group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300",
        theme.card,
        theme.border,
        task.completed ? "opacity-60" : "hover:border-zinc-300 dark:hover:border-zinc-600"
      )}
    >
      <div 
        onPointerDown={(e) => controls.start(e)}
        className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-40 transition-opacity"
      >
        <GripVertical size={18} />
      </div>

      <button
        onClick={() => onToggle(task.id)}
        className={cn(
          "relative flex-shrink-0 w-6 h-6 rounded-lg border-2 transition-all duration-300 flex items-center justify-center",
          task.completed 
            ? cn("text-white scale-110", theme.accent) 
            : cn("border-zinc-300 hover:border-zinc-400 dark:border-zinc-700")
        )}
      >
        <AnimatePresence>
          {task.completed && (
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
            >
              <Check size={14} strokeWidth={4} />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={cn(
            "text-sm font-medium transition-all duration-500",
            task.completed ? "line-through opacity-50" : theme.text
          )}>
            {task.title}
          </span>
          <span className={cn("px-2 py-0.5 rounded-full text-[10px] uppercase font-bold", priorityStyles.color)}>
            {task.priority}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          {task.dueDate && (
            <div className="flex items-center gap-1 text-[11px] opacity-50">
              <CalendarIcon size={12} />
              {format(new Date(task.dueDate), 'MMM d')}
            </div>
          )}
          {task.category && (
            <div className="flex items-center gap-1 text-[11px] opacity-50">
              <FolderHeart size={12} />
              {task.category}
            </div>
          )}
          {task.subtasks.length > 0 && (
            <div className="flex items-center gap-1 text-[11px] opacity-50">
              <CheckCircle2 size={12} />
              {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onDelete(task.id)}
          className="p-2 rounded-lg hover:bg-rose-50 text-rose-500 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </Reorder.Item>
  );
}
