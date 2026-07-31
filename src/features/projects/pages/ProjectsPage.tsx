import React, { useState } from 'react';
import { FolderGit2, Code, Play, CheckCircle2, Upload, MessageSquare } from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const [projects] = useState([
    {
      id: 'p1',
      title: 'مشروع الصفحة الشخصية الأولى (HTML Profile)',
      description: 'قم بإنشاء صفحة ويب تعريفية متكاملة تحتوي على عناوين وقوائم وصورة شخصية ورابط.',
      status: 'submitted',
      feedback: 'عمل ممتاز جداً! أحييك على التنظيم والدقة في الوسوم.',
    },
    {
      id: 'p2',
      title: 'بطاقة تعريفية متجانسة بـ CSS (Profile Card)',
      description: 'استخدم خائص الالوان والـ Box Model وتحديد الأبعاد لبناء بطاقة شخصية متناسقة.',
      status: 'in_progress',
      feedback: null,
    },
  ]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-bdr pb-4">
        <div className="flex items-center gap-2">
          <FolderGit2 className="w-5 h-5 text-brand-primary" />
          <h1 className="text-xl font-bold text-txt-primary">المشاريع التطبيقية التراكمية (Projects)</h1>
        </div>
      </div>

      <div className="space-y-4">
        {projects.map((proj) => (
          <div key={proj.id} className="p-6 rounded-2xl border border-bdr bg-surface space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-bdr pb-3">
              <h3 className="font-bold text-base text-txt-primary">{proj.title}</h3>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  proj.status === 'submitted'
                    ? 'bg-blue-500/10 text-blue-600'
                    : proj.status === 'approved'
                    ? 'bg-emerald-500/10 text-emerald-600'
                    : 'bg-amber-500/10 text-amber-600'
                }`}
              >
                {proj.status === 'submitted' ? 'تم التسليم وفي انتظار التقييم' : 'جاري العمل عليه'}
              </span>
            </div>

            <p className="text-xs text-txt-secondary leading-relaxed">{proj.description}</p>

            {proj.feedback && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-2">
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span>ملاحظات المعلم المشرف: {proj.feedback}</span>
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => alert(`متابعة العمل على مشروع: ${proj.title}`)}
                className="px-4 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                <Code className="w-4 h-4" />
                <span>فتح محرر المشروع</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
