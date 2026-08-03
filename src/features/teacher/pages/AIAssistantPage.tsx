import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Bot,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Save,
  Trash2,
  Edit3,
  Layers,
  Copy,
  AlertTriangle,
  Loader2
} from 'lucide-react';

export const AIAssistantPage: React.FC = () => {
  const [course, setCourse] = useState('html');
  const [module, setModule] = useState('الموديل الأول');
  const [lesson, setLesson] = useState('هيكل صفحة HTML');
  const [skillLevel, setSkillLevel] = useState('مبتدئ');
  const [difficulty, setDifficulty] = useState('medium');
  const [questionType, setQuestionType] = useState('single_choice');
  const [count, setCount] = useState(3);
  const [promptInstructions, setPromptInstructions] = useState('');

  const [jobStatus, setJobStatus] = useState<'idle' | 'generating' | 'completed' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [generatedDrafts, setGeneratedDrafts] = useState<any[]>([]);

  const handleGenerateQuestions = async (e: React.FormEvent) => {
    e.preventDefault();
    setJobStatus('generating');
    setErrorMessage('');

    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-questions', {
        body: {
          course,
          module,
          lesson,
          skillLevel,
          difficulty,
          questionType,
          count,
          promptInstructions
        }
      });

      if (error) {
        throw new Error(error.message || 'حدث خطأ أثناء التواصل مع خادم الذكاء الاصطناعي');
      }

      if (data?.error) {
        setErrorMessage(data.error);
        setJobStatus('error');
        return;
      }

      setGeneratedDrafts(data?.questions || []);
      setJobStatus('completed');
    } catch (err: any) {
      console.warn('Fallback to local AI simulator:', err);
      // Client-side fallback with strict warning
      setErrorMessage('تنبيه: يجب إعداد مزود الذكاء الاصطناعي من إعدادات المنصة.');
      setJobStatus('error');
    }
  };

  const handleApproveQuestion = async (idx: number) => {
    const q = generatedDrafts[idx];
    try {
      await supabase.from('questions').insert({
        prompt_ar: q.prompt_ar,
        supporting_text_ar: q.supporting_text_ar,
        code_snippet: q.code_snippet,
        type: q.type,
        difficulty: q.difficulty,
        points: q.points,
        options: q.options,
        correct_answer: q.correct_answer,
        explanation_ar: q.explanation_ar,
        status: 'draft',
      });
      setGeneratedDrafts(prev => prev.filter((_, i) => i !== idx));
    } catch (err) {
      console.error('Error saving AI draft:', err);
    }
  };

  const handleRejectQuestion = (idx: number) => {
    setGeneratedDrafts(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface border border-bdr p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-brand-primary" />
            <h1 className="text-xl font-extrabold text-txt-primary font-mono">مساعد المعلم بالذكاء الاصطناعي (AI Question Generator)</h1>
          </div>
          <p className="text-xs text-txt-muted mt-1">
            توليد أسئلة تفاعلية ومناسبة لمختلف مستويات التعلّم ومحفوظة كمسودات (Drafts) لمراجعة المعلم.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>مراجعة المعلم إجبارية</span>
        </span>
      </div>

      {/* Generator Form & Output Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Panel */}
        <div className="bg-surface border border-bdr rounded-2xl p-6 space-y-4 shadow-sm">
          <h2 className="text-sm font-bold text-txt-primary border-b border-bdr pb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-primary" />
            <span>إعدادات التوليد الآلي</span>
          </h2>

          <form onSubmit={handleGenerateQuestions} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-txt-secondary mb-1">المادة / الكورس</label>
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full bg-surface-secondary border border-bdr rounded-xl p-2.5 text-xs text-txt-primary"
              >
                <option value="html">HTML الأساسي</option>
                <option value="css">CSS التنسيق</option>
                <option value="js">JavaScript التفاعلي</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-txt-secondary mb-1">مستوى التعلّم</label>
                <select
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value)}
                  className="w-full bg-surface-secondary border border-bdr rounded-xl p-2 text-xs text-txt-primary"
                >
                  <option value="مبتدئ">مبتدئ</option>
                  <option value="متوسط">متوسط</option>
                  <option value="متقدم">متقدم</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-txt-secondary mb-1">عدد الأسئلة</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full bg-surface-secondary border border-bdr rounded-xl p-2 text-xs text-txt-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-txt-secondary mb-1">تعليمات المعلم الخاصة</label>
              <textarea
                rows={3}
                value={promptInstructions}
                onChange={(e) => setPromptInstructions(e.target.value)}
                placeholder="أنشئ 3 أسئلة اختيار من متعدد لدرس هيكل صفحة HTML لمستوى المبتدئين مع الشرح..."
                className="w-full bg-surface-secondary border border-bdr rounded-xl p-2.5 text-xs text-txt-primary"
              />
            </div>

            <button
              type="submit"
              disabled={jobStatus === 'generating'}
              className="w-full py-3 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {jobStatus === 'generating' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري التوليد والتحقق من JSON...</span>
                </>
              ) : (
                <>
                  <Bot className="w-4 h-4" />
                  <span>توليد الأسئلة الآن</span>
                </>
              )}
            </button>
          </form>

          {errorMessage && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-600 dark:text-amber-400 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Review Generated Drafts Panel */}
        <div className="lg:col-span-2 bg-surface border border-bdr rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-bdr pb-3">
            <h3 className="font-bold text-sm text-txt-primary flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-500" />
              <span>المسودات المولدة بانتظار الاعتماد ({generatedDrafts.length})</span>
            </h3>
          </div>

          {generatedDrafts.length === 0 ? (
            <div className="text-center py-12 space-y-2 text-txt-muted">
              <Bot className="w-10 h-10 mx-auto text-brand-primary/30" />
              <p className="text-xs">لم يتم توليد مسودات أسئلة بعد. استخدم اللوحة الجانبية للبدء.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {generatedDrafts.map((q, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-bdr bg-surface-secondary space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 font-bold text-[11px]">
                      مسودة الذكاء الاصطناعي (Draft)
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApproveQuestion(idx)}
                        className="px-3 py-1 bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>اعتماد في بنك الأسئلة</span>
                      </button>
                      <button
                        onClick={() => handleRejectQuestion(idx)}
                        className="p-1 rounded-lg text-rose-500 hover:bg-rose-500/10"
                        title="حذف المسودة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs font-bold text-txt-primary">{q.prompt_ar}</p>

                  {q.code_snippet && (
                    <pre dir="ltr" className="p-3 bg-slate-950 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto">
                      {q.code_snippet}
                    </pre>
                  )}

                  <div className="p-2.5 rounded-lg bg-surface border border-bdr text-[11px] text-txt-muted space-y-1">
                    <div><span className="font-bold text-txt-primary">الشرح:</span> {q.explanation_ar}</div>
                    <div><span className="font-bold text-emerald-500">الإجابة الصحيحة:</span> {q.correct_answer}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
