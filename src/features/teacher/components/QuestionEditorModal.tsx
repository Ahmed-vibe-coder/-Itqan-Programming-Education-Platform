import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Code,
  Smartphone,
  Monitor,
  Sparkles,
  Save,
  ArrowRight,
  ArrowLeft,
  Eye,
  Plus,
  Trash2,
  Copy,
  FileText
} from 'lucide-react';

interface QuestionEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (questionData: any) => void;
  initialData?: any;
}

export const QUESTION_TYPES = [
  { id: 'single_choice', label: '1. اختيار من متعدد (إجابة واحدة)' },
  { id: 'multiple_choice', label: '2. اختيار من متعدد (عدة إجابات)' },
  { id: 'true_false', label: '3. صواب أم خطأ' },
  { id: 'fill_blank', label: '4. إكمال الفراغ' },
  { id: 'fill_multiple_blanks', label: '5. إكمال الفراغات المتعددة' },
  { id: 'word_bank_completion', label: '6. إكمال بنك الكلمات' },
  { id: 'drag_words', label: '7. سحب الكلمات في الفراغات' },
  { id: 'short_answer', label: '8. إجابة قصيرة' },
  { id: 'essay', label: '9. سؤال مقالي' },
  { id: 'matching', label: '10. مطابقة الأزواج' },
  { id: 'ordering', label: '11. ترتيب بالسحب والإفلات' },
  { id: 'arrange_code', label: '12. ترتيب أسطر الكود البرمجي' },
  { id: 'predict_output', label: '13. التنبؤ بنتيجة الكود' },
  { id: 'choose_correct_code', label: '14. اختيار الكود الصحيح' },
  { id: 'find_error', label: '15. اكتشاف الخطأ في الكود' },
  { id: 'correct_error', label: '16. تصحيح الخطأ البرمجي' },
  { id: 'complete_code', label: '17. إكمال الكود المفقود' },
  { id: 'small_coding_task', label: '18. مهمة برمجية صغيرة' },
  { id: 'visual_result_matching', label: '19. مطابقة النتيجة البصرية' },
  { id: 'select_rendered_output', label: '20. اختيار الخرج المرسوم الصحيح' },
  { id: 'categorization', label: '21. تصنيف المكونات البرمجية' },
  { id: 'flashcard_review', label: '22. بطاقة مراجعة تفاعلية (Flashcard)' },
  { id: 'timed_rapid', label: '23. سؤال السريعة الزمني' },
  { id: 'multi_step', label: '24. سؤال متعدد الخطوات' },
];

export const QuestionEditorModal: React.FC<QuestionEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [step, setStep] = useState<number>(1);
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light');

  // Form State
  const [course, setCourse] = useState(initialData?.course || 'html');
  const [module, setModule] = useState(initialData?.module || 'الموديل الأول');
  const [lesson, setLesson] = useState(initialData?.lesson || 'هيكل صفحة HTML');
  const [type, setType] = useState(initialData?.type || 'single_choice');
  const [difficulty, setDifficulty] = useState(initialData?.difficulty || 'medium');
  const [points, setPoints] = useState(initialData?.points || 10);

  const [promptAr, setPromptAr] = useState(initialData?.prompt_ar || '');
  const [supportingTextAr, setSupportingTextAr] = useState(initialData?.supporting_text_ar || '');
  const [codeSnippet, setCodeSnippet] = useState(initialData?.code_snippet || '');

  // Options State for Single/Multiple Choice
  const [options, setOptions] = useState<string[]>(initialData?.options?.choices || ['<a>', '<link>', '<p>', '<div>']);
  const [correctAnswer, setCorrectAnswer] = useState<any>(initialData?.correct_answer || '<a>');

  const [explanationAr, setExplanationAr] = useState(initialData?.explanation_ar || '');
  const [hints, setHints] = useState<string[]>(initialData?.hints || ['تذكر الوسم الخاص بالروابط التشعبية']);
  const [newHint, setNewHint] = useState('');

  const [autoSaveStatus, setAutoSaveStatus] = useState<string>('تم الحفظ التلقائي المسودة');

  if (!isOpen) return null;

  const handleNext = () => setStep(prev => Math.min(prev + 1, 6));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

  const handleAddHint = () => {
    if (!newHint.trim()) return;
    setHints([...hints, newHint.trim()]);
    setNewHint('');
  };

  const handleRemoveHint = (idx: number) => {
    setHints(hints.filter((_, i) => i !== idx));
  };

  const handleSaveQuestion = (status: 'draft' | 'published') => {
    const questionObj = {
      course,
      module,
      lesson,
      type,
      difficulty,
      points,
      prompt_ar: promptAr,
      supporting_text_ar: supportingTextAr,
      code_snippet: codeSnippet,
      options: { choices: options },
      correct_answer: correctAnswer,
      explanation_ar: explanationAr,
      hints,
      status,
      version: 1
    };
    onSave(questionObj);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-surface border border-bdr rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-bdr flex items-center justify-between bg-surface-secondary/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold">
              {step}
            </div>
            <div>
              <h2 className="text-base font-extrabold text-txt-primary">محرر الأسئلة البصري (الممرحل)</h2>
              <span className="text-xs text-txt-muted flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{autoSaveStatus}</span>
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-txt-muted hover:text-txt-primary hover:bg-surface-secondary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Steps Stepper */}
        <div className="px-6 py-3 border-b border-bdr bg-surface flex items-center justify-between text-xs overflow-x-auto">
          {[
            { num: 1, name: 'المعلومات الأساسية' },
            { num: 2, name: 'محتوى السؤال' },
            { num: 3, name: 'الإجابات والشروط' },
            { num: 4, name: 'التغذية والتلميحات' },
            { num: 5, name: 'المعاينة والإتاحة' },
            { num: 6, name: 'الحفظ والنشر' },
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => setStep(s.num)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all shrink-0 ${
                step === s.num
                  ? 'bg-brand-primary text-white font-bold'
                  : step > s.num
                  ? 'text-emerald-500 font-bold bg-emerald-500/10'
                  : 'text-txt-muted hover:text-txt-primary'
              }`}
            >
              <span>{s.num}.</span>
              <span>{s.name}</span>
            </button>
          ))}
        </div>

        {/* Step Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4 max-w-xl mx-auto">
              <h3 className="text-sm font-bold text-txt-primary border-b border-bdr pb-2">الخطوة 1: تحديد السياق والمستوى</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-txt-secondary mb-1">الكورس / المادة</label>
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

                <div>
                  <label className="block text-xs font-bold text-txt-secondary mb-1">نوع السؤال (15 نوعًا)</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-surface-secondary border border-bdr rounded-xl p-2.5 text-xs text-txt-primary"
                  >
                    {QUESTION_TYPES.map((qt) => (
                      <option key={qt.id} value={qt.id}>
                        {qt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-txt-secondary mb-1">مستوى الصعوبة</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full bg-surface-secondary border border-bdr rounded-xl p-2.5 text-xs text-txt-primary"
                  >
                    <option value="easy">سهل (Easy)</option>
                    <option value="medium">متوسط (Medium)</option>
                    <option value="hard">صعب (Hard)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-txt-secondary mb-1">النقاط المستحقة</label>
                  <input
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(Number(e.target.value))}
                    className="w-full bg-surface-secondary border border-bdr rounded-xl p-2.5 text-xs text-txt-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Content */}
          {step === 2 && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <h3 className="text-sm font-bold text-txt-primary border-b border-bdr pb-2">الخطوة 2: صياغة السؤال والكود الداعم</h3>

              <div>
                <label className="block text-xs font-bold text-txt-secondary mb-1">نص السؤال الرئيسي (بالعربية)</label>
                <textarea
                  rows={3}
                  required
                  value={promptAr}
                  onChange={(e) => setPromptAr(e.target.value)}
                  placeholder="مثال: ما الوسم المخصص لإضافة رابط تشعبي لصفحة أخرى؟"
                  className="w-full bg-surface-secondary border border-bdr rounded-xl p-3 text-xs text-txt-primary focus:ring-2 focus:ring-brand-primary/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-txt-secondary mb-1">نص توضيحي/مساند (اختياري)</label>
                <input
                  type="text"
                  value={supportingTextAr}
                  onChange={(e) => setSupportingTextAr(e.target.value)}
                  placeholder="ملاحظة توضيحية تظهر للطالب أسفل السؤال..."
                  className="w-full bg-surface-secondary border border-bdr rounded-xl p-2.5 text-xs text-txt-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-txt-secondary mb-1 flex items-center justify-between">
                  <span>كود داعم (LTR)</span>
                  <span className="text-[10px] text-txt-muted">HTML / CSS / JS</span>
                </label>
                <textarea
                  rows={4}
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  placeholder="<a href='https://itqan.edu'>زيارة المنصة</a>"
                  dir="ltr"
                  className="w-full bg-slate-950 text-emerald-400 font-mono border border-bdr rounded-xl p-3 text-xs focus:ring-2 focus:ring-brand-primary/40"
                />
              </div>
            </div>
          )}

          {/* Step 3: Answers & Rules */}
          {step === 3 && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <h3 className="text-sm font-bold text-txt-primary border-b border-bdr pb-2">الخطوة 3: إدخال الخيارات وتحديد الإجابة الصحيحة</h3>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-txt-secondary">الخيارات المتاحة</label>
                {options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correct_opt"
                      checked={correctAnswer === opt}
                      onChange={() => setCorrectAnswer(opt)}
                      className="w-4 h-4 text-brand-primary"
                    />
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...options];
                        newOpts[idx] = e.target.value;
                        setOptions(newOpts);
                        if (correctAnswer === opt) setCorrectAnswer(e.target.value);
                      }}
                      dir="ltr"
                      className="flex-1 bg-surface-secondary border border-bdr rounded-xl p-2 text-xs font-mono text-txt-primary"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Feedback & Hints */}
          {step === 4 && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <h3 className="text-sm font-bold text-txt-primary border-b border-bdr pb-2">الخطوة 4: الشرح والتلميحات المتدرجة</h3>

              <div>
                <label className="block text-xs font-bold text-txt-secondary mb-1">شرح الإجابة النموذجية (يظهر بعد الحل)</label>
                <textarea
                  rows={3}
                  value={explanationAr}
                  onChange={(e) => setExplanationAr(e.target.value)}
                  placeholder="الشرح التعليمي الذي يشرح سبب صحة الإجابة..."
                  className="w-full bg-surface-secondary border border-bdr rounded-xl p-3 text-xs text-txt-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-txt-secondary mb-1">التلميحات المتدرجة (Progressive Hints)</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newHint}
                    onChange={(e) => setNewHint(e.target.value)}
                    placeholder="إضافة تلميح مساعدة للطالب..."
                    className="flex-1 bg-surface-secondary border border-bdr rounded-xl p-2 text-xs text-txt-primary"
                  />
                  <button
                    onClick={handleAddHint}
                    className="px-3 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl"
                  >
                    إضافة
                  </button>
                </div>

                <div className="space-y-1.5">
                  {hints.map((h, i) => (
                    <div key={i} className="p-2.5 rounded-xl border border-bdr bg-surface-secondary flex items-center justify-between text-xs">
                      <span>{i + 1}. {h}</span>
                      <button onClick={() => handleRemoveHint(i)} className="text-rose-500 hover:text-rose-600">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Mobile & Accessibility Preview */}
          {step === 5 && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-between border-b border-bdr pb-2">
                <h3 className="text-sm font-bold text-txt-primary">الخطوة 5: معاينة الجوال والديسكتوب واختبار الإتاحة</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    className={`p-2 rounded-lg border text-xs font-bold flex items-center gap-1 ${
                      previewDevice === 'mobile' ? 'bg-brand-primary text-white border-brand-primary' : 'border-bdr text-txt-muted'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>موبايل (390px)</span>
                  </button>
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className={`p-2 rounded-lg border text-xs font-bold flex items-center gap-1 ${
                      previewDevice === 'desktop' ? 'bg-brand-primary text-white border-brand-primary' : 'border-bdr text-txt-muted'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>شاشة كبيرة</span>
                  </button>
                </div>
              </div>

              {/* Student Experience Mock Container */}
              <div className={`mx-auto p-4 rounded-2xl border border-bdr ${previewTheme === 'dark' ? 'bg-slate-900 text-white' : 'bg-surface text-txt-primary'} ${previewDevice === 'mobile' ? 'max-w-[390px] shadow-xl' : 'w-full'}`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-txt-muted">
                    <span>سؤال اختباري ({points} نقاط)</span>
                    <span className="px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary font-bold">{difficulty}</span>
                  </div>

                  <h4 className="text-sm font-bold">{promptAr || 'نص السؤال المعاين هنا...'}</h4>

                  {codeSnippet && (
                    <pre dir="ltr" className="p-3 bg-slate-950 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto">
                      {codeSnippet}
                    </pre>
                  )}

                  <div className="space-y-2 pt-2">
                    {options.map((opt, i) => (
                      <div key={i} className="p-3 rounded-xl border border-bdr bg-surface-secondary text-xs flex items-center gap-2 cursor-pointer hover:border-brand-primary">
                        <div className="w-4 h-4 rounded-full border border-bdr flex items-center justify-center text-[10px]">
                          {i + 1}
                        </div>
                        <span dir="ltr" className="font-mono">{opt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Save & Publish */}
          {step === 6 && (
            <div className="space-y-6 max-w-md mx-auto text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-txt-primary">جاهز لحفظ السؤال!</h3>
                <p className="text-xs text-txt-muted mt-1">اختر حفظ السؤال كمسودة لمراجعته لاحقًا أو نشره فورًا في بنك الأسئلة.</p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleSaveQuestion('published')}
                  className="w-full py-3 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>اعتماد ونشر في بنك الأسئلة</span>
                </button>
                <button
                  onClick={() => handleSaveQuestion('draft')}
                  className="w-full py-3 bg-surface-secondary border border-bdr hover:bg-surface-secondary/80 text-txt-primary text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>حفظ كمسودة (Draft)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-bdr bg-surface-secondary/50 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={step === 1}
            className="px-4 py-2 rounded-xl border border-bdr text-xs font-bold disabled:opacity-50 flex items-center gap-1"
          >
            <ArrowRight className="w-4 h-4" />
            <span>السابق</span>
          </button>

          <span className="text-xs text-txt-muted font-bold font-mono">الخطوة {step} من 6</span>

          {step < 6 ? (
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl flex items-center gap-1"
            >
              <span>التالي</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 border border-bdr text-xs font-bold rounded-xl"
            >
              إلغاء
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
