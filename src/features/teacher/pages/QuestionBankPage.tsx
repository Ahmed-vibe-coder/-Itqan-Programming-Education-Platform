import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { QuestionEditorModal } from '@/features/teacher/components/QuestionEditorModal';
import {
  HelpCircle,
  PlusCircle,
  Search,
  Filter,
  Eye,
  Edit,
  Copy,
  Archive,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Bot,
  Sparkles,
  Layers,
  ChevronDown
} from 'lucide-react';

interface QuestionItem {
  id: string;
  type: string;
  prompt_ar: string;
  course?: string;
  module?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  status: 'draft' | 'published' | 'archived';
  version: number;
  attempts_count?: number;
  correct_percentage?: number;
  created_at: string;
}

export const QuestionBankPage: React.FC = () => {
  const [questions, setQuestions] = useState<QuestionItem[]>([
    {
      id: 'q-1',
      type: 'single_choice',
      prompt_ar: 'ما الوسم المخصص لإضافة رابط تشعبي لصفحة أخرى؟',
      course: 'HTML',
      difficulty: 'easy',
      points: 10,
      status: 'published',
      version: 1,
      attempts_count: 14,
      correct_percentage: 92,
      created_at: '2026-07-28',
    },
    {
      id: 'q-2',
      type: 'choose_correct_code',
      prompt_ar: 'اختر السطر البرمجي الصحيح الذي يغيّر لون النص للون الأزرق في CSS:',
      course: 'CSS',
      difficulty: 'medium',
      points: 15,
      status: 'published',
      version: 1,
      attempts_count: 8,
      correct_percentage: 75,
      created_at: '2026-07-29',
    },
    {
      id: 'q-3',
      type: 'predict_output',
      prompt_ar: 'ما النتيجة المتوقعة لطباعة التعبير 5 + "5" في لغة JavaScript؟',
      course: 'JavaScript',
      difficulty: 'hard',
      points: 20,
      status: 'draft',
      version: 1,
      attempts_count: 2,
      correct_percentage: 50,
      created_at: '2026-07-30',
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [selectedAnalyticsQuestion, setSelectedAnalyticsQuestion] = useState<QuestionItem | null>(null);

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('questions').select('*').limit(50);
        if (data && data.length > 0) {
          const mapped: QuestionItem[] = data.map((q: any) => ({
            id: q.id,
            type: q.type || 'single_choice',
            prompt_ar: q.prompt_ar,
            course: q.course || 'HTML',
            difficulty: q.difficulty || 'medium',
            points: q.points || 10,
            status: q.status || 'published',
            version: q.version || 1,
            attempts_count: 12,
            correct_percentage: 85,
            created_at: q.created_at || '2026-07-30',
          }));
          setQuestions(mapped);
        }
      } catch (err) {
        console.error('Error fetching questions:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, []);

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.prompt_ar.includes(searchQuery);
    const matchesCourse = selectedCourse === 'all' || q.course?.toLowerCase() === selectedCourse;
    const matchesDiff = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
    const matchesStatus = selectedStatus === 'all' || q.status === selectedStatus;
    return matchesSearch && matchesCourse && matchesDiff && matchesStatus;
  });

  const handleToggleSelect = (id: string) => {
    setSelectedQuestions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSaveQuestionFromModal = (newQuestionData: any) => {
    const newQ: QuestionItem = {
      id: `q-${Date.now()}`,
      type: newQuestionData.type,
      prompt_ar: newQuestionData.prompt_ar,
      course: newQuestionData.course?.toUpperCase() || 'HTML',
      difficulty: newQuestionData.difficulty,
      points: newQuestionData.points,
      status: newQuestionData.status,
      version: 1,
      attempts_count: 0,
      correct_percentage: 0,
      created_at: new Date().toISOString().split('T')[0],
    };
    setQuestions([newQ, ...questions]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface border border-bdr p-6 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-brand-primary" />
            <h1 className="text-xl font-extrabold text-txt-primary">بنك الأسئلة الموحد (Question Bank)</h1>
          </div>
          <p className="text-xs text-txt-muted mt-1">
            إدارة كافة الأسئلة والأنواع الـ 15 المتخصصة وتصنيفها حسب الكورس والوحدة والإصدار ومتابعة التحليلات.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingQuestion(null);
              setIsEditorOpen(true);
            }}
            className="px-4 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>إنشاء سؤال جديد</span>
          </button>
        </div>
      </div>

      {/* Search and Multi-tier Filters Bar */}
      <div className="bg-surface border border-bdr rounded-2xl p-4 space-y-3 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-txt-muted absolute top-3 right-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="البحث في نص الأسئلة أو المفاهيم..."
              className="w-full bg-surface-secondary border border-bdr rounded-xl pr-9 pl-4 py-2 text-xs text-txt-primary"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="bg-surface-secondary border border-bdr rounded-xl px-3 py-2 text-xs text-txt-primary"
            >
              <option value="all">كل الكورسات</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="javascript">JavaScript</option>
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-surface-secondary border border-bdr rounded-xl px-3 py-2 text-xs text-txt-primary"
            >
              <option value="all">كل المستويات</option>
              <option value="easy">سهل</option>
              <option value="medium">متوسط</option>
              <option value="hard">صعب</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-surface-secondary border border-bdr rounded-xl px-3 py-2 text-xs text-txt-primary"
            >
              <option value="all">كل الحالات</option>
              <option value="published">منشور</option>
              <option value="draft">مسودة</option>
              <option value="archived">مؤرشف</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Bar */}
        {selectedQuestions.length > 0 && (
          <div className="p-3 bg-brand-primary/10 border border-brand-primary/30 rounded-xl flex items-center justify-between text-xs animate-in fade-in">
            <span className="font-bold text-brand-primary">تم تحديد {selectedQuestions.length} سؤالاً</span>
            <div className="flex items-center gap-2">
              <button className="px-2.5 py-1 bg-brand-primary text-white rounded-lg font-bold text-[11px]">نشر التحديد</button>
              <button className="px-2.5 py-1 bg-surface border border-bdr rounded-lg font-bold text-[11px]">أرشفة</button>
              <button className="px-2.5 py-1 bg-surface border border-bdr rounded-lg font-bold text-[11px]">إضافة للامتحان</button>
            </div>
          </div>
        )}
      </div>

      {/* Questions Table / Cards List */}
      <div className="bg-surface border border-bdr rounded-2xl overflow-hidden shadow-sm">
        <div className="divide-y divide-bdr">
          {filteredQuestions.map((q) => (
            <div key={q.id} className="p-4 hover:bg-surface-secondary/50 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selectedQuestions.includes(q.id)}
                  onChange={() => handleToggleSelect(q.id)}
                  className="mt-1 w-4 h-4 text-brand-primary rounded"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md bg-brand-primary/10 text-brand-primary text-[11px] font-bold">
                      {q.course}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-surface-secondary border border-bdr text-[11px] font-bold text-txt-secondary">
                      {q.type}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                      q.difficulty === 'easy' ? 'bg-emerald-500/10 text-emerald-600' :
                      q.difficulty === 'medium' ? 'bg-amber-500/10 text-amber-600' : 'bg-rose-500/10 text-rose-600'
                    }`}>
                      {q.difficulty} ({q.points} نقطة)
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      q.status === 'published' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                    }`}>
                      {q.status === 'published' ? 'منشور' : 'مسودة'}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-txt-primary">{q.prompt_ar}</p>
                </div>
              </div>

              {/* Stats & Actions */}
              <div className="flex items-center gap-4 text-xs shrink-0 self-end md:self-center">
                <div className="text-left">
                  <span className="text-[11px] text-txt-muted block">المحاولات: {q.attempts_count || 0}</span>
                  <span className="text-[11px] text-emerald-500 font-bold block">
                    {(q.attempts_count || 0) < 5 ? 'البيانات غير كافية للحكم' : `نسبة النجاح: %${q.correct_percentage}`}
                  </span>
                </div>

                <div className="flex items-center gap-1 border-r border-bdr pr-3">
                  <button
                    onClick={() => setSelectedAnalyticsQuestion(q)}
                    className="p-1.5 rounded-lg text-txt-muted hover:text-brand-primary hover:bg-surface-secondary"
                    title="تحليلات السؤال"
                  >
                    <BarChart3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingQuestion(q);
                      setIsEditorOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-txt-muted hover:text-brand-primary hover:bg-surface-secondary"
                    title="تعديل السؤال"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics Modal */}
      {selectedAnalyticsQuestion && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-bdr rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-bdr pb-3">
              <h3 className="font-bold text-sm text-txt-primary">تحليلات السؤال الإحصائية</h3>
              <button onClick={() => setSelectedAnalyticsQuestion(null)} className="text-txt-muted hover:text-txt-primary">
                &times;
              </button>
            </div>

            <p className="text-xs text-txt-secondary font-bold">{selectedAnalyticsQuestion.prompt_ar}</p>

            {(selectedAnalyticsQuestion.attempts_count || 0) < 5 ? (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center space-y-2">
                <AlertCircle className="w-6 h-6 text-amber-500 mx-auto" />
                <span className="text-xs font-bold text-amber-600 block">البيانات غير كافية للحكم</span>
                <p className="text-[11px] text-txt-muted">يلزم وجود 5 محاولات إجابة على الأقل لإظهار الإحصائيات الدقيقة للمشتتات.</p>
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span>عدد المحاولات:</span><span className="font-mono font-bold">{selectedAnalyticsQuestion.attempts_count}</span></div>
                <div className="flex justify-between"><span>نسبة الإجابة الصحيحة:</span><span className="font-mono font-bold text-emerald-500">%{selectedAnalyticsQuestion.correct_percentage}</span></div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Visual Question Editor Modal */}
      <QuestionEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveQuestionFromModal}
        initialData={editingQuestion}
      />
    </div>
  );
};
