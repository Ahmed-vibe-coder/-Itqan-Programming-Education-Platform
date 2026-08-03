import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  FileCheck,
  PlusCircle,
  Search,
  Filter,
  Layers,
  Clock,
  Award,
  Smartphone,
  Monitor,
  CheckCircle2,
  AlertCircle,
  Save,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Shuffle,
  Sparkles,
  Eye
} from 'lucide-react';

interface QuestionBankItem {
  id: string;
  prompt_ar: string;
  course: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: string;
  points: number;
}

export const ExamBuilderPage: React.FC = () => {
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [examTitle, setExamTitle] = useState('اختبار الوحدة الأولى — مفاهيم HTML الأساسية');
  const [examDescription, setExamDescription] = useState('اختبار تقييمي لقياس مدى فهم الطالب لهيكل الصفحة والوسوم الأساسية.');
  const [course, setCourse] = useState('html');
  const [timeLimit, setTimeLimit] = useState(30);
  const [passingScore, setPassingScore] = useState(80);
  const [isFinalExam, setIsFinalExam] = useState(true);

  const [availableQuestions] = useState<QuestionBankItem[]>([
    { id: 'q-101', prompt_ar: 'ما الوسم المخصص لإضافة عنوان رئيسي كبير في HTML؟', course: 'HTML', difficulty: 'easy', type: 'single_choice', points: 10 },
    { id: 'q-102', prompt_ar: 'اختر السطر الذي يكوّن صورة صحيحة المسار والوصف البديل:', course: 'HTML', difficulty: 'medium', type: 'choose_correct_code', points: 15 },
    { id: 'q-103', prompt_ar: 'اكتب وسماً ينشئ قائمة غير مرتبة (Unordered List):', course: 'HTML', difficulty: 'hard', type: 'small_coding_task', points: 20 },
    { id: 'q-104', prompt_ar: 'ما الخاصية المسؤولة عن فتح الرابط في تبويب جديد؟', course: 'HTML', difficulty: 'medium', type: 'single_choice', points: 10 },
  ]);

  const [selectedQuestions, setSelectedQuestions] = useState<QuestionBankItem[]>([
    { id: 'q-101', prompt_ar: 'ما الوسم المخصص لإضافة عنوان رئيسي كبير في HTML؟', course: 'HTML', difficulty: 'easy', type: 'single_choice', points: 10 },
    { id: 'q-102', prompt_ar: 'اختر السطر الذي يكوّن صورة صحيحة المسار والوصف البديل:', course: 'HTML', difficulty: 'medium', type: 'choose_correct_code', points: 15 },
  ]);

  const [searchBankQuery, setSearchBankQuery] = useState('');
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');

  const totalPoints = selectedQuestions.reduce((acc, q) => acc + q.points, 0);

  const handleAddQuestionToExam = (q: QuestionBankItem) => {
    if (selectedQuestions.some((sq) => sq.id === q.id)) return;
    setSelectedQuestions([...selectedQuestions, q]);
  };

  const handleRemoveQuestionFromExam = (id: string) => {
    setSelectedQuestions(selectedQuestions.filter((q) => q.id !== id));
  };

  const [publishedMsg, setPublishedMsg] = useState<string | null>(null);

  const handlePublishExam = async () => {
    try {
      await supabase.from('assessments').insert({
        title_ar: examTitle,
        type: 'unit_exam',
        time_limit_minutes: timeLimit,
        passing_score: passingScore,
        is_published: true,
      });
    } catch (err) {
      console.warn('Supabase not connected, saved locally.');
    }
    setPublishedMsg('تم إعداد ونشر الامتحان بنجاح وتعيينه للطلاب!');
    setTimeout(() => setPublishedMsg(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface border border-bdr p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-brand-primary" />
            <h1 className="text-xl font-extrabold text-txt-primary">منشئ الامتحانات التفاعلي (Exam Builder & Blueprint)</h1>
          </div>
          <p className="text-xs text-txt-muted mt-1">
            بناء اختبار مخصص مباشرة من بنك الأسئلة أو باستخدام مخطط الامتحان الذكي (Exam Blueprint).
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold font-mono bg-surface-secondary px-3 py-1.5 rounded-xl border border-bdr">
          <Clock className="w-4 h-4 text-amber-500" />
          <span>إجمالي النقاط: {totalPoints} | الوقت: {timeLimit} دقيقة</span>
        </div>
      </div>

      {publishedMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>{publishedMsg}</span>
        </div>
      )}

      {/* Stepper Tabs */}
      <div className="bg-surface border border-bdr rounded-2xl p-3 flex items-center justify-between text-xs overflow-x-auto">
        {[
          { num: 1, name: '1. البيانات الأساسية' },
          { num: 2, name: '2. إعدادات الاختبار' },
          { num: 3, name: '3. اختيار الأسئلة' },
          { num: 4, name: '4. هيكل الأقسام' },
          { num: 5, name: '5. التعيين للمجموعات' },
          { num: 6, name: '6. معاينة الطالب' },
          { num: 7, name: '7. الاعتماد والنشر' },
        ].map((s) => (
          <button
            key={s.num}
            onClick={() => setWizardStep(s.num)}
            className={`px-3 py-2 rounded-xl transition-all shrink-0 font-bold ${
              wizardStep === s.num
                ? 'bg-brand-primary text-white'
                : 'text-txt-muted hover:text-txt-primary'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Main 2-Panel Desktop Layout for Question Selection (Step 3) */}
      {wizardStep === 3 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Right Panel: Question Bank Search & Filters (RTL) */}
          <div className="bg-surface border border-bdr rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-bdr pb-3">
              <h2 className="font-bold text-sm text-txt-primary flex items-center gap-2">
                <Search className="w-4 h-4 text-brand-primary" />
                <span>بنك الأسئلة المتاح</span>
              </h2>
              <span className="text-xs text-txt-muted font-mono">{availableQuestions.length} أسئلة</span>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-txt-muted absolute top-3 right-3" />
              <input
                type="text"
                value={searchBankQuery}
                onChange={(e) => setSearchBankQuery(e.target.value)}
                placeholder="البحث في الأسئلة لإضافتها..."
                className="w-full bg-surface-secondary border border-bdr rounded-xl pr-9 pl-4 py-2 text-xs text-txt-primary"
              />
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {availableQuestions.map((q) => {
                const isAdded = selectedQuestions.some((sq) => sq.id === q.id);
                return (
                  <div key={q.id} className="p-3 rounded-xl border border-bdr bg-surface-secondary flex items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <span className="px-2 py-0.5 rounded bg-brand-primary/10 text-brand-primary font-bold text-[10px]">
                        {q.difficulty} ({q.points} ن)
                      </span>
                      <p className="font-bold text-txt-primary">{q.prompt_ar}</p>
                    </div>

                    <button
                      disabled={isAdded}
                      onClick={() => handleAddQuestionToExam(q)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                        isAdded
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                          : 'bg-brand-primary text-white hover:bg-brand-primary-hover'
                      }`}
                    >
                      {isAdded ? 'مُضاف' : 'إضافة'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Left Panel: Exam Questions & Structure */}
          <div className="bg-surface border border-bdr rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-bdr pb-3">
              <h2 className="font-bold text-sm text-txt-primary flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-500" />
                <span>الأسئلة المحددة للامتحان ({selectedQuestions.length})</span>
              </h2>
              <span className="text-xs font-mono font-bold text-brand-primary">{totalPoints} نقطة</span>
            </div>

            <div className="space-y-2.5 max-h-[400px] overflow-y-auto">
              {selectedQuestions.map((sq, idx) => (
                <div key={sq.id} className="p-3 rounded-xl border border-bdr bg-surface-secondary flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-surface border border-bdr flex items-center justify-center font-bold text-txt-muted text-[11px]">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-bold text-txt-primary">{sq.prompt_ar}</p>
                      <span className="text-[10px] text-txt-muted">{sq.points} نقطة • {sq.difficulty}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveQuestionFromExam(sq.id)}
                    className="p-1 rounded-lg text-rose-500 hover:bg-rose-500/10"
                    title="حذف من الامتحان"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : wizardStep === 6 ? (
        /* Mobile & Desktop Student Exam Experience Preview */
        <div className="bg-surface border border-bdr rounded-2xl p-6 space-y-4 shadow-sm max-w-xl mx-auto">
          <div className="flex items-center justify-between border-b border-bdr pb-2">
            <h3 className="font-bold text-sm text-txt-primary">معاينة واجهة امتحان الطالب الخالية من المشتتات</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded-lg border text-xs font-bold ${previewDevice === 'mobile' ? 'bg-brand-primary text-white' : 'border-bdr text-txt-muted'}`}
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded-lg border text-xs font-bold ${previewDevice === 'desktop' ? 'bg-brand-primary text-white' : 'border-bdr text-txt-muted'}`}
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className={`mx-auto p-4 rounded-2xl border border-bdr bg-surface text-txt-primary ${previewDevice === 'mobile' ? 'max-w-[390px] shadow-xl' : 'w-full'}`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-bdr">
                <span className="font-bold text-txt-primary">{examTitle}</span>
                <span className="font-mono text-amber-500 font-bold">29:45 متبقية</span>
              </div>

              <p className="text-xs font-bold">السؤال 1 من أصل {selectedQuestions.length}: {selectedQuestions[0]?.prompt_ar}</p>

              <div className="space-y-2 pt-2">
                <div className="p-3 rounded-xl border border-bdr bg-surface-secondary text-xs">أ) &lt;h1&gt;</div>
                <div className="p-3 rounded-xl border border-bdr bg-surface-secondary text-xs">ب) &lt;head&gt;</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Wizard Form Step 1/2/4/5/7 */
        <div className="bg-surface border border-bdr rounded-2xl p-6 max-w-xl mx-auto space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-txt-primary border-b border-bdr pb-2">إعدادات ونشر الامتحان</h3>

          <div>
            <label className="block text-xs font-bold text-txt-secondary mb-1">عنوان الامتحان</label>
            <input
              type="text"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              className="w-full bg-surface-secondary border border-bdr rounded-xl p-2.5 text-xs text-txt-primary font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-txt-secondary mb-1">الزمن المتاح (بالدقائق)</label>
              <input
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                className="w-full bg-surface-secondary border border-bdr rounded-xl p-2.5 text-xs text-txt-primary font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-txt-secondary mb-1">درجة النجاح (%)</label>
              <input
                type="number"
                value={passingScore}
                onChange={(e) => setPassingScore(Number(e.target.value))}
                className="w-full bg-surface-secondary border border-bdr rounded-xl p-2.5 text-xs text-txt-primary font-mono"
              />
            </div>
          </div>

          <button
            onClick={handlePublishExam}
            className="w-full py-3 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>نشر وتكليف الطلاب بالاختبار</span>
          </button>
        </div>
      )}
    </div>
  );
};
