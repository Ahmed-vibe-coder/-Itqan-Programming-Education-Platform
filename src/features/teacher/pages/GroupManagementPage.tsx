import React, { useState } from 'react';
import { Users, Plus, KeyRound, Settings, CheckCircle2 } from 'lucide-react';

export const GroupManagementPage: React.FC = () => {
  const [groups, setGroups] = useState([
    { id: 'g1', name: 'المجموعة الأولى (أبطال HTML)', code: 'GRP-HTML-1', membersCount: 8, leaderboard: true },
    { id: 'g2', name: 'مجموعة الموهوبين', code: 'GRP-VIP-2026', membersCount: 3, leaderboard: true },
  ]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between border-b border-bdr pb-4">
        <div>
          <h1 className="text-xl font-bold text-txt-primary">إدارة المجموعات الدراسية</h1>
          <p className="text-xs text-txt-muted">إنشاء مجموعات الطلاب وإسناد المناهج والتحكم بجدول الترتيب</p>
        </div>
        <button
          onClick={() => alert('إنشاء مجموعة جديدة')}
          className="px-4 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>مجموعة جديدة</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map((g) => (
          <div key={g.id} className="p-5 rounded-2xl border border-bdr bg-surface space-y-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-base text-txt-primary">{g.name}</h3>
                <span className="text-xs font-mono text-brand-primary" dir="ltr">{g.code}</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold">
                {g.membersCount} طلاب
              </span>
            </div>

            <div className="pt-3 border-t border-bdr flex items-center justify-between text-xs">
              <span className="text-txt-muted">جدول الترتيب: مفعّل</span>
              <button
                onClick={() => alert(`تعديل إعدادات المجموعة: ${g.name}`)}
                className="px-3 py-1 bg-surface-secondary border border-bdr rounded-lg text-txt-secondary font-bold hover:text-txt-primary"
              >
                تعديل الإعدادات
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
