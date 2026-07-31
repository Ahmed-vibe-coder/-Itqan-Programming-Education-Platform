import React from 'react';
import { Target, Award, CheckCircle2, Flame, Clock } from 'lucide-react';

export const MissionsPage: React.FC = () => {
  const missions = [
    { id: 'm1', title: 'أكمل 3 دروس برمجية', current: 2, target: 3, xp: 50, status: 'in_progress' },
    { id: 'm2', title: 'حل تمرينين عمليين في Code Lab', current: 2, target: 2, xp: 40, status: 'completed' },
    { id: 'm3', title: 'حافظ على استمرار التعلم لـ 3 أيام', current: 3, target: 3, xp: 60, status: 'completed' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-bdr pb-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-amber-500" />
          <h1 className="text-xl font-bold text-txt-primary">المهمات الأسبوعية التحفيزية (Weekly Missions)</h1>
        </div>
      </div>

      <div className="space-y-4">
        {missions.map((m) => (
          <div key={m.id} className="p-5 rounded-2xl border border-bdr bg-surface space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-txt-primary">{m.title}</h3>
              <span className="font-mono font-bold text-xs text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-md">
                +{m.xp} XP
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-txt-muted">
                <span>التقدم</span>
                <span className="font-mono font-bold">{m.current} / {m.target}</span>
              </div>
              <div className="w-full h-2 bg-surface-secondary rounded-full overflow-hidden border border-bdr">
                <div
                  className="h-full bg-brand-primary rounded-full transition-all"
                  style={{ width: `${(m.current / m.target) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
