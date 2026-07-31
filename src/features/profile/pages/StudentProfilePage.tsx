import React, { useState } from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import { User, Shield, KeyRound, Sparkles, CheckCircle2 } from 'lucide-react';

const AVATARS = [
  { id: 'av_1', label: 'صقر البرمجة', emoji: '🦅' },
  { id: 'av_2', label: 'فضاء الأكواد', emoji: '🚀' },
  { id: 'av_3', label: 'عبقري الحاسوب', emoji: '💻' },
  { id: 'av_4', label: 'نجم البرمجة', emoji: '⭐' },
  { id: 'av_5', label: 'بطل الخوارزميات', emoji: '🛡️' },
  { id: 'av_6', label: 'مستكشف الحلول', emoji: '🔍' },
];

export const StudentProfilePage: React.FC = () => {
  const { profile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || 'طالب نواة');
  const [selectedAvatar, setSelectedAvatar] = useState(profile?.avatar_url || 'av_1');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-surface border border-bdr rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-4 border-b border-bdr pb-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 text-brand-primary font-bold flex items-center justify-center text-3xl shrink-0">
            🦅
          </div>
          <div>
            <h1 className="text-xl font-bold text-txt-primary">{profile?.full_name || 'الملف الشخصي'}</h1>
            <p className="text-xs text-txt-muted">@{profile?.username || 'student'}</p>
          </div>
        </div>

        {saved && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>تم حفظ تعديلات الملف الشخصي بنجاح!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-txt-secondary mb-2 flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>الصورة الرمزية (Avatar)</span>
            </label>
            <div className="grid grid-cols-6 gap-2">
              {AVATARS.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => setSelectedAvatar(av.id)}
                  title={av.label}
                  className={`h-12 rounded-xl flex items-center justify-center text-2xl border transition-all ${
                    selectedAvatar === av.id
                      ? 'border-brand-primary bg-brand-primary/10 ring-2 ring-brand-primary/30 scale-105'
                      : 'border-bdr bg-surface-secondary hover:border-bdr-strong'
                  }`}
                >
                  {av.emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-txt-secondary mb-1.5">الاسم الظاهر</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-surface-secondary border border-bdr rounded-xl px-4 py-2.5 text-xs text-txt-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-xs rounded-xl transition-all shadow-sm"
          >
            حفظ التغييرات
          </button>
        </form>
      </div>
    </div>
  );
};
