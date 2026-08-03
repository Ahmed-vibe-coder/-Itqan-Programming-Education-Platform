import React, { useState } from 'react';
import { FolderGit2, Code, Play, CheckCircle2, Upload, MessageSquare, X, Eye, Sparkles } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  status: 'in_progress' | 'submitted' | 'approved';
  feedback: string | null;
  codeHtml: string;
  codeCss: string;
}

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 'p1',
      title: 'مشروع الصفحة الشخصية الأولى (HTML Profile)',
      description: 'قم بإنشاء صفحة ويب تعريفية متكاملة تحتوي على عناوين وقوائم وصورة شخصية ورابط.',
      status: 'submitted',
      feedback: 'عمل ممتاز جداً! أحييك على التنظيم والدقة في الوسوم.',
      codeHtml: `<!DOCTYPE html>\n<html lang="ar" dir="rtl">\n  <head><title>صفحتي الشخصية</title></head>\n  <body>\n    <h1>أهلاً، أنا مبرمج المستقبل!</h1>\n    <p>أتعلم برمجة الويب في منصة إتقان.</p>\n  </body>\n</html>`,
      codeCss: `body { font-family: sans-serif; padding: 20px; background-color: #f8fafc; }`,
    },
    {
      id: 'p2',
      title: 'بطاقة تعريفية متجانسة بـ CSS (Profile Card)',
      description: 'استخدم خصائص الألوان والـ Box Model وتحديد الأبعاد لبناء بطاقة شخصية متناسقة.',
      status: 'in_progress',
      feedback: null,
      codeHtml: `<div className="card">\n  <h2>سارة علي</h2>\n  <p>مطورة صفحات ويب واعده</p>\n</div>`,
      codeCss: `.card { background: white; padding: 15px; border-radius: 12px; font-family: sans-serif; }`,
    },
  ]);

  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [submittedStatus, setSubmittedStatus] = useState(false);

  const handleOpenEditor = (proj: Project) => {
    setActiveProject(proj);
    setHtmlCode(proj.codeHtml);
    setCssCode(proj.codeCss);
    setSubmittedStatus(proj.status === 'submitted' || proj.status === 'approved');
  };

  const handleSubmitProject = () => {
    if (!activeProject) return;
    setProjects(projects.map(p => p.id === activeProject.id ? { ...p, status: 'submitted', codeHtml: htmlCode, codeCss: cssCode } : p));
    setSubmittedStatus(true);
  };

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
          <div key={proj.id} className="p-6 rounded-2xl border border-bdr bg-surface space-y-4 shadow-sm hover:border-brand-primary/40 transition-all">
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
                {proj.status === 'submitted' ? 'تم التسليم وفي انتظار التقييم' : proj.status === 'approved' ? 'مكتمل ومعتمد ✓' : 'جاري العمل عليه'}
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
                onClick={() => handleOpenEditor(proj)}
                className="px-4 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Code className="w-4 h-4" />
                <span>فتح محرر المشروع</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Project Interactive Editor Modal */}
      {activeProject && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-bdr rounded-3xl p-6 w-full max-w-3xl space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-bdr pb-3">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-brand-primary" />
                <h3 className="font-bold text-sm text-txt-primary">{activeProject.title}</h3>
              </div>
              <button onClick={() => setActiveProject(null)} className="text-txt-muted hover:text-txt-primary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* HTML Editor */}
              <div>
                <label className="block text-xs font-bold text-txt-secondary mb-1">كود HTML:</label>
                <textarea
                  value={htmlCode}
                  onChange={(e) => setHtmlCode(e.target.value)}
                  dir="ltr"
                  rows={8}
                  className="w-full bg-slate-900 text-slate-100 font-mono text-xs p-3 rounded-xl border border-bdr text-left"
                />
              </div>

              {/* CSS Editor */}
              <div>
                <label className="block text-xs font-bold text-txt-secondary mb-1">كود CSS:</label>
                <textarea
                  value={cssCode}
                  onChange={(e) => setCssCode(e.target.value)}
                  dir="ltr"
                  rows={8}
                  className="w-full bg-slate-900 text-slate-100 font-mono text-xs p-3 rounded-xl border border-bdr text-left"
                />
              </div>
            </div>

            {/* Live Preview */}
            <div>
              <label className="block text-xs font-bold text-txt-secondary mb-1">المعاينة المباشرة (Live Preview):</label>
              <div className="w-full h-36 bg-white rounded-xl border border-bdr overflow-hidden p-2">
                <iframe
                  title="project-preview"
                  srcDoc={`<style>${cssCode}</style>${htmlCode}`}
                  className="w-full h-full border-none"
                />
              </div>
            </div>

            {submittedStatus && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>تم تسليم هذا المشروع بنجاح إلى معلمك المشرف. يمكنك الاستمرار بتحديث كودك في أي وقت.</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-bdr">
              <button
                onClick={() => setActiveProject(null)}
                className="px-4 py-2 bg-surface-secondary border border-bdr text-xs font-bold rounded-xl text-txt-secondary"
              >
                إغلاق
              </button>
              <button
                onClick={handleSubmitProject}
                className="px-5 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>تسليم المشروع للمعلم</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

