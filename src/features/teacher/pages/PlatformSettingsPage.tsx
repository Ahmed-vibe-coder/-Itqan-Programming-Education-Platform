import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, Shield, Sparkles } from 'lucide-react';

export const PlatformSettingsPage: React.FC = () => {
  const [platformTitle, setPlatformTitle] = useState('إتقان');
  const [tagline, setTagline] = useState('تعلّم بعمق. طبّق بإتقان.');
  const [teacherName, setTeacherName] = useState('أ. أسامة أحمد');
  const [contactEmail, setContactEmail] = useState('support@itqan.edu');
  const [registrationMode, setRegistrationMode] = useState('invitation_only');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-surface border border-bdr rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-3 border-b border-bdr pb-4">
          <Settings className="w-6 h-6 text-brand-primary" />
          <div>
            <h1 className="text-xl font-bold text-txt-primary">إعدادات المنصة والهوية العامة</h1>
            <p className="text-xs text-txt-muted">التحكم في اسم المنصة، الشعار اللفظي، ووضع تسجيل الطلاب</p>
          </div>
        </div>

        {saved && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>تم حفظ الإعدادات سحابياً بنجاح!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-txt-secondary mb-1.5">اسم المنصة العربي</label>
              <input
                type="text"
                value={platformTitle}
                onChange={(e) => setPlatformTitle(e.target.value)}
                className="w-full bg-surface-secondary border border-bdr rounded-xl px-4 py-2.5 text-xs text-txt-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-txt-secondary mb-1.5">الشعار اللفظي (Tagline)</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-surface-secondary border border-bdr rounded-xl px-4 py-2.5 text-xs text-txt-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-txt-secondary mb-1.5">اسم المعلم المشرف الظاهر</label>
              <input
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                className="w-full bg-surface-secondary border border-bdr rounded-xl px-4 py-2.5 text-xs text-txt-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-txt-secondary mb-1.5">البريد الإلكتروني للدعم</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                dir="ltr"
                className="w-full bg-surface-secondary border border-bdr rounded-xl px-4 py-2.5 text-xs text-txt-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40 text-left"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-txt-secondary mb-1.5">وضع تسجيل الطلاب الخصوصي</label>
            <select
              value={registrationMode}
              onChange={(e) => setRegistrationMode(e.target.value)}
              className="w-full bg-surface-secondary border border-bdr rounded-xl px-4 py-2.5 text-xs text-txt-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
            >
              <option value="invitation_only">بالدعوات الحصرية فقط (افتراضي ومستحسن)</option>
              <option value="teacher_created">إنشاء مباشر من المعلم فقط</option>
              <option value="open_registration">تسجيل مفتوح عام</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>حفظ وتحديث الإعدادات</span>
          </button>
        </form>
      </div>
    </div>
  );
};
