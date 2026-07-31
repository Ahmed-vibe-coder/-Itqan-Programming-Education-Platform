import React from 'react';
import { LessonBlock } from '@/types/database';
import {
  Lightbulb,
  AlertTriangle,
  Info,
  CheckCircle2,
  HelpCircle,
  Code2,
  BookOpen,
  ArrowLeft
} from 'lucide-react';
import { CodePlayground } from '@/features/playground/components/CodePlayground';

interface LessonBlockRendererProps {
  blocks: LessonBlock[];
  onMasteryComplete?: () => void;
}

export const LessonBlockRenderer: React.FC<LessonBlockRendererProps> = ({
  blocks,
  onMasteryComplete,
}) => {
  return (
    <div className="space-y-8">
      {blocks.map((block) => {
        const { id, block_type, content } = block;

        switch (block_type) {
          case 'heading':
            return (
              <h2 key={id} className="text-xl md:text-2xl font-bold text-txt-primary mt-8 mb-4 border-r-4 border-brand-primary pr-3">
                {content.text_ar || content.title_ar}
              </h2>
            );

          case 'rich_text':
            return (
              <p key={id} className="text-base text-txt-primary leading-relaxed">
                {content.text_ar || content.text}
              </p>
            );

          case 'analogy':
            return (
              <div key={id} className="p-5 rounded-2xl bg-brand-primary/5 border border-brand-primary/20 space-y-2">
                <div className="flex items-center gap-2 text-brand-primary font-bold text-sm">
                  <Lightbulb className="w-5 h-5" />
                  <span>{content.title_ar || 'تشبيه بسيط للفهم'}</span>
                </div>
                <p className="text-sm text-txt-primary leading-relaxed">
                  {content.text_ar}
                </p>
              </div>
            );

          case 'note':
            return (
              <div key={id} className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-900 dark:text-blue-200 text-sm flex items-start gap-3">
                <Info className="w-5 h-5 shrink-0 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-bold mb-1">{content.title_ar || 'ملاحظة مهمة'}</h4>
                  <p className="leading-relaxed">{content.text_ar}</p>
                </div>
              </div>
            );

          case 'warning':
            return (
              <div key={id} className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-sm flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500 mt-0.5" />
                <div>
                  <h4 className="font-bold mb-1">{content.title_ar || 'انتبه!'}</h4>
                  <p className="leading-relaxed">{content.text_ar}</p>
                </div>
              </div>
            );

          case 'steps':
            return (
              <div key={id} className="space-y-3 my-4">
                {content.title_ar && <h3 className="font-bold text-sm text-txt-primary">{content.title_ar}</h3>}
                <ol className="space-y-2">
                  {(content.items_ar || []).map((step: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-txt-primary">
                      <span className="w-6 h-6 rounded-full bg-brand-primary text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            );

          case 'code':
            return (
              <div key={id} className="my-6 rounded-2xl overflow-hidden border border-bdr bg-slate-900 text-slate-100 shadow-sm">
                {content.caption_ar && (
                  <div className="bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-400 border-b border-slate-700 flex items-center justify-between">
                    <span>{content.caption_ar}</span>
                    <span className="font-mono text-[10px] uppercase text-brand-primary">{content.language || 'html'}</span>
                  </div>
                )}
                <pre className="p-4 text-sm overflow-x-auto code-block font-mono leading-relaxed" dir="ltr">
                  <code>{content.code}</code>
                </pre>
              </div>
            );

          case 'code_explanation':
            return (
              <div key={id} className="my-6 space-y-4">
                <div className="rounded-xl overflow-hidden border border-bdr bg-slate-900 text-slate-100">
                  <pre className="p-4 text-sm font-mono overflow-x-auto code-block" dir="ltr">
                    <code>{content.code}</code>
                  </pre>
                </div>
                <div className="bg-surface-secondary border border-bdr rounded-xl p-4 space-y-2">
                  <h4 className="font-bold text-xs text-txt-secondary">شرح أسطر الكود:</h4>
                  <ul className="space-y-1.5 text-xs text-txt-muted">
                    {(content.lines || []).map((item: any, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="font-mono font-bold text-brand-primary" dir="ltr">
                          سطر {item.line}:
                        </span>
                        <span>{item.explanation_ar}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );

          case 'live_playground':
            return (
              <div key={id} className="my-8">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-bold text-txt-primary text-sm flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-brand-primary" />
                    <span>تطبيق عملي حي</span>
                  </h3>
                  <span className="text-xs text-txt-muted">محرر الأكواد المعزول والآمن</span>
                </div>
                <CodePlayground
                  initialHtml={content.initialHtml || ''}
                  initialCss={content.initialCss || ''}
                  initialJs={content.initialJs || ''}
                />
              </div>
            );

          case 'vocabulary':
            return (
              <div key={id} className="my-6 border border-bdr rounded-2xl overflow-hidden">
                <div className="bg-surface-secondary px-4 py-3 border-b border-bdr font-bold text-xs text-txt-primary flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-brand-primary" />
                  <span>المصطلحات البرمجية المستخدمة في هذا الدرس</span>
                </div>
                <div className="divide-y divide-bdr bg-surface">
                  {(content.terms || []).map((term: any, idx: number) => (
                    <div key={idx} className="p-3.5 flex items-center justify-between text-xs">
                      <span className="font-bold text-txt-primary">{term.ar}</span>
                      <span className="font-mono text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-md" dir="ltr">
                        {term.en}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );

          case 'summary':
            return (
              <div key={id} className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-950 dark:text-emerald-200 space-y-3">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>ملخص ما تعلمناه اليوم</span>
                </div>
                <ul className="space-y-1.5 text-xs leading-relaxed list-disc list-inside">
                  {(content.points_ar || []).map((pt: string, idx: number) => (
                    <li key={idx}>{pt}</li>
                  ))}
                </ul>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
};
