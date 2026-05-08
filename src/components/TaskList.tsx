import { Reorder, AnimatePresence } from 'motion/react';
import { Task } from '../types';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onReorder: (newTasks: Task[]) => void;
}

export default function TaskList({ tasks, onToggle, onDelete, onUpdate, onReorder }: TaskListProps) {
  return (
    <Reorder.Group
      axis="y"
      values={tasks}
      onReorder={onReorder}
      className="space-y-3"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggle}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))}
      </AnimatePresence>
    </Reorder.Group>
  );
}
