import { Theme } from './types';

export const THEMES: Theme[] = [
  {
    id: 'clarity',
    name: 'Clarity (Default)',
    bg: 'bg-zinc-50',
    card: 'bg-white',
    accent: 'bg-indigo-600',
    text: 'text-zinc-900',
    muted: 'text-zinc-500',
    border: 'border-zinc-200',
  },
  {
    id: 'sakura',
    name: 'Sakura',
    bg: 'bg-[#fff5f7]',
    card: 'bg-white',
    accent: 'bg-rose-400',
    text: 'text-rose-950',
    muted: 'text-rose-300',
    border: 'border-rose-100',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    bg: 'bg-[#f0f9ff]',
    card: 'bg-white',
    accent: 'bg-sky-500',
    text: 'text-sky-950',
    muted: 'text-sky-300',
    border: 'border-sky-100',
  },
  {
    id: 'midnight',
    name: 'Midnight',
    bg: 'bg-zinc-950',
    card: 'bg-zinc-900',
    accent: 'bg-violet-500',
    text: 'text-zinc-50',
    muted: 'text-zinc-500',
    border: 'border-zinc-800',
  },
  {
    id: 'forest',
    name: 'Forest',
    bg: 'bg-[#f7fee7]',
    card: 'bg-white',
    accent: 'bg-emerald-600',
    text: 'text-emerald-950',
    muted: 'text-emerald-300',
    border: 'border-emerald-100',
  }
];

export const PRIORITIES = {
  low: { color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-400' },
  medium: { color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-400' },
  high: { color: 'bg-rose-100 text-rose-700', dot: 'bg-rose-400' },
};

export const CATEGORIES = [
  'Personal',
  'Work',
  'Health',
  'Learning',
  'Finance',
];
