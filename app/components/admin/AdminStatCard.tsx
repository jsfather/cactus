import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

type Tone = 'blue' | 'emerald' | 'violet' | 'amber' | 'rose' | 'cyan';

const tones: Record<Tone, { icon: string; glow: string; bar: string }> = {
  blue: { icon: 'bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300', glow: 'bg-blue-400/15', bar: 'from-blue-500 to-cyan-400' },
  emerald: { icon: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300', glow: 'bg-emerald-400/15', bar: 'from-emerald-500 to-teal-400' },
  violet: { icon: 'bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300', glow: 'bg-violet-400/15', bar: 'from-violet-500 to-fuchsia-400' },
  amber: { icon: 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300', glow: 'bg-amber-400/15', bar: 'from-amber-500 to-orange-400' },
  rose: { icon: 'bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300', glow: 'bg-rose-400/15', bar: 'from-rose-500 to-pink-400' },
  cyan: { icon: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-300', glow: 'bg-cyan-400/15', bar: 'from-cyan-500 to-sky-400' },
};

interface AdminStatCardProps {
  label: string;
  value: ReactNode;
  icon: LucideIcon;
  tone?: Tone;
  hint?: string;
}

export default function AdminStatCard({ label, value, icon: Icon, tone = 'blue', hint }: AdminStatCardProps) {
  const palette = tones[tone];
  return (
    <div className="group relative min-h-36 overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-gray-800/80">
      <div className={`absolute -left-8 -top-8 h-24 w-24 rounded-full blur-2xl ${palette.glow}`} />
      <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-l ${palette.bar}`} />
      <div className="relative flex h-full flex-col justify-between gap-5">
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
          <span className={`rounded-xl p-2.5 ring-1 ring-inset ring-black/5 transition-transform duration-300 group-hover:scale-110 ${palette.icon}`}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
        </div>
        <div>
          <p className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">{value}</p>
          {hint && <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{hint}</p>}
        </div>
      </div>
    </div>
  );
}
