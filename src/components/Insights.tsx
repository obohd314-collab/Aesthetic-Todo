import { motion } from 'motion/react';
import { Stats, Task } from '../types';
import { useTheme } from '../ThemeContext';
import { cn } from '../lib/utils';
import { TrendingUp, CheckCircle2, Zap, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { subDays, format } from 'date-fns';

interface InsightsProps {
  stats: Stats;
  tasks: Task[];
}

export default function Insights({ stats, tasks }: InsightsProps) {
  const { theme } = useTheme();

  // Mock data for the last 7 days
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(new Date(), i);
    const dateStr = date.toDateString();
    const completed = tasks.filter(t => t.completed && new Date(t.createdAt).toDateString() === dateStr).length;
    return {
      name: format(date, 'EEE'),
      completed,
    };
  }).reverse();

  const cards = [
    { label: 'Completed Today', value: stats.completedToday, icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Total Tasks', value: tasks.length, icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Success Rate', value: `${stats.productivityScore}%`, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Lifetime Done', value: stats.totalCompleted, icon: CheckCircle2, color: 'text-violet-500', bg: 'bg-violet-50' },
  ];

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={cn("p-6 rounded-3xl border shadow-sm", theme.card, theme.border)}
            >
              <div className={cn("p-3 rounded-2xl w-fit mb-4", card.bg, card.color)}>
                <Icon size={24} />
              </div>
              <p className="text-sm opacity-50 font-medium">{card.label}</p>
              <h3 className="text-3xl font-bold mt-1 tracking-tight">{card.value}</h3>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={cn("p-8 rounded-[40px] border shadow-sm", theme.card, theme.border)}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold">Activity</h3>
            <p className="text-sm opacity-50 mt-1 font-medium">Your task completion history for the past week</p>
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, opacity: 0.5 }}
                dy={10}
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className={cn("p-3 rounded-xl border shadow-xl", theme.card, theme.border)}>
                        <p className="text-sm font-bold">{payload[0].value} Tasks Done</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="completed" radius={[10, 10, 10, 10]}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    className={cn("transition-all duration-300", index === chartData.length - 1 ? theme.accent.replace('bg-', 'fill-') : 'fill-zinc-200 dark:fill-zinc-800')}
                    fill={index === chartData.length - 1 ? undefined : '#f4f4f5'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
