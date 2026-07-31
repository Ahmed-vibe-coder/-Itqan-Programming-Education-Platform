import React from 'react';
import { Trophy, Award, Medal, ShieldCheck, Flame, Zap } from 'lucide-react';

export const LeaderboardPage: React.FC = () => {
  const leaderboardData = [
    { rank: 1, name: 'أحمد م.', avatar: '🚀', xp: 340, streak: 5, isCurrentUser: false },
    { rank: 2, name: 'سارة ع.', avatar: '💻', xp: 280, streak: 4, isCurrentUser: false },
    { rank: 3, name: 'طالب نواة (أنت)', avatar: '🦅', xp: 250, streak: 3, isCurrentUser: true },
    { rank: 4, name: 'يوسف ك.', avatar: '⭐', xp: 210, streak: 2, isCurrentUser: false },
    { rank: 5, name: 'مريم ح.', avatar: '🛡️', xp: 190, streak: 2, isCurrentUser: false },
    { rank: 6, name: 'عمر ف.', avatar: '🔍', xp: 150, streak: 1, isCurrentUser: false },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Title */}
      <div className="bg-surface border border-bdr rounded-3xl p-6 shadow-sm text-center space-y-3">
        <div className="w-14 h-14 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mx-auto">
          <Trophy className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold text-txt-primary">جدول ترتيب المجموعة الأولى</h1>
        <p className="text-xs text-txt-muted max-w-md mx-auto">
          ترتيب تنافسي تحفيزي يعتمد على النقاط اليومية والالتزام دون الإفصاح عن البيانات الشخصية.
        </p>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-surface border border-bdr rounded-3xl overflow-hidden shadow-sm divide-y divide-bdr">
        {leaderboardData.map((item) => (
          <div
            key={item.rank}
            className={`p-4 flex items-center justify-between transition-all ${
              item.isCurrentUser
                ? 'bg-brand-primary/10 border-r-4 border-r-brand-primary font-bold'
                : 'hover:bg-surface-secondary'
            }`}
          >
            <div className="flex items-center gap-4">
              {/* Rank Badge */}
              <div className="w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0">
                {item.rank === 1 ? (
                  <span className="text-amber-500 text-lg">🥇</span>
                ) : item.rank === 2 ? (
                  <span className="text-slate-400 text-lg">🥈</span>
                ) : item.rank === 3 ? (
                  <span className="text-amber-700 text-lg">🥉</span>
                ) : (
                  <span className="text-txt-muted font-mono">#{item.rank}</span>
                )}
              </div>

              {/* Avatar & Name */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-secondary border border-bdr flex items-center justify-center text-xl shrink-0">
                  {item.avatar}
                </div>
                <div>
                  <span className={`text-sm block ${item.isCurrentUser ? 'text-brand-primary font-bold' : 'text-txt-primary font-semibold'}`}>
                    {item.name}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] text-txt-muted">
                    <span className="flex items-center gap-0.5 text-amber-500">
                      <Flame className="w-3 h-3 fill-current" />
                      <span>{item.streak} أيام</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Score */}
            <div className="flex items-center gap-1.5 text-brand-primary font-mono font-extrabold text-sm bg-brand-primary/10 px-3 py-1.5 rounded-xl">
              <Zap className="w-4 h-4 fill-brand-primary" />
              <span>{item.xp} XP</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
