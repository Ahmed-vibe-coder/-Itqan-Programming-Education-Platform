import React, { useState, useEffect } from 'react';
import { Users, Plus, KeyRound, Settings, CheckCircle2, X, Edit, Trash2, Shield, Layers } from 'lucide-react';

interface Group {
  id: string;
  name: string;
  code: string;
  membersCount: number;
  leaderboard: boolean;
  description?: string;
}

export const GroupManagementPage: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>(() => {
    const saved = localStorage.getItem('nawa_groups');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'g1', name: 'المجموعة الأولى (أبطال HTML)', code: 'GRP-HTML-1', membersCount: 8, leaderboard: true, description: 'مجموعة الطلاب المبتدئين في مسار الويب' },
      { id: 'g2', name: 'مجموعة الموهوبين (JS Core)', code: 'GRP-VIP-2026', membersCount: 3, leaderboard: true, description: 'المجموعة المتقدمة لمنطق وسيناريوهات برمجية' },
    ];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);

  // Form states
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [leaderboardEnabled, setLeaderboardEnabled] = useState(true);

  useEffect(() => {
    localStorage.setItem('nawa_groups', JSON.stringify(groups));
  }, [groups]);

  const handleSaveGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName) return;

    if (editingGroup) {
      setGroups(groups.map(g => g.id === editingGroup.id ? {
        ...g,
        name: groupName,
        description,
        leaderboard: leaderboardEnabled
      } : g));
      setEditingGroup(null);
    } else {
      const code = `GRP-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      const newGroup: Group = {
        id: `g-${Date.now()}`,
        name: groupName,
        code,
        membersCount: 0,
        leaderboard: leaderboardEnabled,
        description
      };
      setGroups([...groups, newGroup]);
    }

    setGroupName('');
    setDescription('');
    setLeaderboardEnabled(true);
    setIsModalOpen(false);
  };

  const openEditModal = (g: Group) => {
    setEditingGroup(g);
    setGroupName(g.name);
    setDescription(g.description || '');
    setLeaderboardEnabled(g.leaderboard);
    setIsModalOpen(true);
  };

  const handleDeleteGroup = (id: string) => {
    if (confirm('هل أنت تأكد من رغبتك في حذف هذه المجموعة؟')) {
      setGroups(groups.filter(g => g.id !== id));
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between border-b border-bdr pb-4">
        <div>
          <h1 className="text-xl font-bold text-txt-primary flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-primary" />
            <span>إدارة المجموعات الدراسية</span>
          </h1>
          <p className="text-xs text-txt-muted">إنشاء مجموعات الطلاب وإسناد المناهج والتحكم بجدول الترتيب</p>
        </div>
        <button
          onClick={() => {
            setEditingGroup(null);
            setGroupName('');
            setDescription('');
            setLeaderboardEnabled(true);
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>مجموعة جديدة</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map((g) => (
          <div key={g.id} className="p-5 rounded-2xl border border-bdr bg-surface space-y-4 shadow-sm hover:border-brand-primary/40 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-base text-txt-primary">{g.name}</h3>
                <span className="text-xs font-mono text-brand-primary font-bold" dir="ltr">{g.code}</span>
                {g.description && <p className="text-xs text-txt-muted mt-1">{g.description}</p>}
              </div>
              <span className="px-2.5 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold shrink-0">
                {g.membersCount} طلاب
              </span>
            </div>

            <div className="pt-3 border-t border-bdr flex items-center justify-between text-xs">
              <span className={`font-bold text-[11px] ${g.leaderboard ? 'text-emerald-600 dark:text-emerald-400' : 'text-txt-muted'}`}>
                جدول الترتيب: {g.leaderboard ? 'مفعّل ✓' : 'معطّل'}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEditModal(g)}
                  className="px-3 py-1 bg-surface-secondary border border-bdr rounded-lg text-txt-secondary font-bold hover:text-txt-primary transition-all flex items-center gap-1 text-[11px]"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>تعديل الإعدادات</span>
                </button>
                <button
                  onClick={() => handleDeleteGroup(g.id)}
                  className="p-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white rounded-lg transition-all"
                  title="حذف المجموعة"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {groups.length === 0 && (
          <div className="col-span-full p-8 text-center bg-surface border border-bdr rounded-2xl text-txt-muted">
            لا توجد مجموعات حالياً. اضغط "مجموعة جديدة" لإنشاء أول مجموعة.
          </div>
        )}
      </div>

      {/* Create / Edit Group Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-bdr rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-bdr pb-3">
              <h3 className="font-bold text-sm text-txt-primary">
                {editingGroup ? 'تعديل إعدادات المجموعة' : 'إنشاء مجموعة دراسية جديدة'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-txt-muted hover:text-txt-primary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGroup} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-txt-secondary mb-1">اسم المجموعة</label>
                <input
                  type="text"
                  required
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="مثال: المجموعة الثالثة (CSS Pro)"
                  className="w-full bg-surface-secondary border border-bdr rounded-xl p-2.5 text-xs text-txt-primary"
                />
              </div>

              <div>
                <label className="block font-bold text-txt-secondary mb-1">الوصف المختصر</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="وصف هدف ومستوى هذه المجموعة..."
                  className="w-full bg-surface-secondary border border-bdr rounded-xl p-2.5 text-xs text-txt-primary h-20 resize-none"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-secondary border border-bdr">
                <div>
                  <span className="font-bold text-txt-primary block">تفعيل لوحة المتصدرين (Leaderboard)</span>
                  <span className="text-[11px] text-txt-muted">سماح للطلاب بمنافسة زملائهم بالنقاط داخل المجموعة</span>
                </div>
                <input
                  type="checkbox"
                  checked={leaderboardEnabled}
                  onChange={(e) => setLeaderboardEnabled(e.target.checked)}
                  className="w-4 h-4 text-brand-primary rounded"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-surface-secondary border border-bdr rounded-xl font-bold text-txt-secondary"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-primary text-white font-bold rounded-xl shadow-md"
                >
                  {editingGroup ? 'حفظ التعديلات' : 'إنشاء المجموعة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

