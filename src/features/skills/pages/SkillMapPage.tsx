import React, { useState, useEffect } from 'react';
import { skillService, ConceptSkill } from '@/services/skillService';
import { useAuth } from '@/app/providers/AuthProvider';
import { Award, CheckCircle2, AlertCircle, BookOpen, Clock } from 'lucide-react';

export const SkillMapPage: React.FC = () => {
  const { profile } = useAuth();
  const [subject, setSubject] = useState<'html' | 'css' | 'js'>('html');
  const [skills, setSkills] = useState<ConceptSkill[]>([]);

  useEffect(() => {
    if (profile?.id) {
      skillService.getStudentSkills(profile.id, subject).then(setSkills);
    }
  }, [profile?.id, subject]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-bdr pb-4">
        <div>
          <h1 className="text-xl font-bold text-txt-primary">خريطة المهارات والمفاهيم (Skill Map)</h1>
          <p className="text-xs text-txt-muted">متابعة مستوى إتقان المفاهيم البرمجية بناءً على التطبيقات والامتحانات</p>
        </div>

        <div className="flex gap-2 bg-surface-secondary p-1 rounded-xl border border-bdr">
          {(['html', 'css', 'js'] as const).map((sub) => (
            <button
              key={sub}
              onClick={() => setSubject(sub)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                subject === sub
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'text-txt-secondary hover:text-txt-primary'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((sk) => (
          <div key={sk.id} className="p-5 rounded-2xl border border-bdr bg-surface space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-brand-primary bg-brand-primary/10 px-2.5 py-0.5 rounded-md">
                {sk.category_ar}
              </span>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  sk.status === 'mastered'
                    ? 'bg-emerald-500/10 text-emerald-600'
                    : sk.status === 'learning'
                    ? 'bg-blue-500/10 text-blue-600'
                    : sk.status === 'needs_review'
                    ? 'bg-amber-500/10 text-amber-600'
                    : 'bg-surface-secondary text-txt-muted'
                }`}
              >
                {sk.status === 'mastered'
                  ? 'أتقن المفهوم'
                  : sk.status === 'learning'
                  ? 'قيد التعلم'
                  : sk.status === 'needs_review'
                  ? 'يحتاج مراجعة'
                  : 'لم يبدأ'}
              </span>
            </div>

            <h3 className="font-bold text-sm text-txt-primary">{sk.title_ar}</h3>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-txt-muted">
                <span>نسبة التمكن الضمني</span>
                <span className="font-mono font-bold">{sk.mastery_percentage}%</span>
              </div>
              <div className="w-full h-2 bg-surface-secondary rounded-full overflow-hidden border border-bdr">
                <div
                  className="h-full bg-brand-primary rounded-full transition-all duration-500"
                  style={{ width: `${sk.mastery_percentage}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
