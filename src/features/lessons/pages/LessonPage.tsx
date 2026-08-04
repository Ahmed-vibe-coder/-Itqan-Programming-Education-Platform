import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { LessonBlockRenderer } from '@/features/lessons/components/LessonBlockRenderer';
import { MasteryGate } from '@/features/lessons/components/MasteryGate';
import {
  BookOpen,
  ChevronRight,
  Bookmark,
  FileText,
  Clock,
  Lock,
  CheckCircle2,
  Menu,
  X,
  Play,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { LessonBlock } from '@/types/database';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/FormControls';

export const LessonPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();

  const [bookmarked, setBookmarked] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [curriculumDrawerOpen, setCurriculumDrawerOpen] = useState(false);

  const [lessonStatus, setLessonStatus] = useState<'locked' | 'in_progress' | 'completed'>('in_progress');

  // Mock Lesson Data
  const lessonData = {
    id: lessonId || 'l1030000-0000-0000-0000-000000000003',
    title_ar: 'هيكل مستند HTML الأساسي',
    course_title: 'HTML من الصفر إلى الإتقان',
    module_title: 'الوحدة الأولى: أساسيات بناء الصفحات',
    estimated_minutes: 15,
    blocks: [
      {
        id: 'b1',
        lesson_id: 'l1',
        block_type: 'heading',
        content: { text_ar: 'ما هو هيكل صفحة الويب؟' },
        order_index: 1,
      },
      {
        id: 'b2',
        lesson_id: 'l1',
        block_type: 'analogy',
        content: {
          title_ar: 'تأطير اللوحة البرمجية',
          text_ar: 'تخيل أن صفحة الويب مثل الورقة البيضاء في برواز: يحتوي البرواز على معلومات خفية عن الصفحة مثل عنوانها ولغتها، وداخل البرواز توجد الرسوم والمحتوى الذي يراه الزائر.',
        },
        order_index: 2,
      },
      {
        id: 'b3',
        lesson_id: 'l1',
        block_type: 'rich_text',
        content: {
          text_ar: 'يتكون مستند HTML الأساسي من وسوم رئيسية لا يمكن الاستغناء عنها لتعريف المتصفح بأساسيات الصفحة.',
        },
        order_index: 3,
      },
      {
        id: 'b4',
        lesson_id: 'l1',
        block_type: 'code',
        content: {
          language: 'html',
          caption_ar: 'الهيكل القياسي لمستند HTML5',
          code: `<!DOCTYPE html>\n<html lang="ar" dir="rtl">\n  <head>\n    <meta charset="UTF-8">\n    <title>صفحتي الأولى — إتقان</title>\n  </head>\n  <body>\n    <h1>أهلاً بكم في موقعي!</h1>\n  </body>\n</html>`,
        },
        order_index: 4,
      },
      {
        id: 'b5',
        lesson_id: 'l1',
        block_type: 'live_playground',
        content: {
          initialHtml: `<!DOCTYPE html>\n<html lang="ar" dir="rtl">\n  <head>\n    <title>تجربتي المباشرة</title>\n  </head>\n  <body>\n    <h1 style="color: #F97316">أول عنوان لي!</h1>\n    <p>هذه أول فقرة أقوم بتعديلها بنفسي في إتقان.</p>\n  </body>\n</html>`,
          initialCss: `body { padding: 16px; font-family: system-ui, sans-serif; }`,
          initialJs: `console.log("تم تحميل الهيكل بنجاح!");`,
        },
        order_index: 5,
      },
      {
        id: 'b6',
        lesson_id: 'l1',
        block_type: 'vocabulary',
        content: {
          terms: [
            { ar: 'إعلان نوع المستند', en: '<!DOCTYPE html>' },
            { ar: 'جذر الصفحة', en: '<html>' },
            { ar: 'رأس المستند خفي البيانات', en: '<head>' },
            { ar: 'جسم الصفحة المرئي', en: '<body>' },
          ],
        },
        order_index: 6,
      },
      {
        id: 'b7',
        lesson_id: 'l1',
        block_type: 'summary',
        content: {
          points_ar: [
            'الوسم DOCTYPE يخبر المتصفح أن الصفحة مكتوبة بلغة HTML5 الحديثة.',
            'جميع عناصر الصفحة تقع داخل الوسم الجذر <html>.',
            'المعلومات والعناوين الخفية توضع في <head> والمحتوى المرئي يوضع في <body>.',
          ],
        },
        order_index: 7,
      },
    ] as LessonBlock[],
    masteryQuestions: [
      {
        id: 'mq1',
        prompt_ar: 'أين نضع المحتوى المرئي (مثل النصوص والصور) الذي يراه زائر الموقع؟',
        options: [
          { id: 'opt1', text_ar: 'داخل وسم <head>', code: '' },
          { id: 'opt2', text_ar: 'داخل وسم <body>', code: '' },
          { id: 'opt3', text_ar: 'داخل وسم <title>', code: '' },
        ],
        correct_id: 'opt2',
        explanation_ar: 'العنصر <body> هو المخصص لاحتواء كافة العناصر المرئية للزائر على الشاشة.',
      },
      {
        id: 'mq2',
        prompt_ar: 'ما فضل الوسم <!DOCTYPE html> في بداية الملف؟',
        options: [
          { id: 'opt1', text_ar: 'تلوين الصفحة باللون البرتقالي', code: '' },
          { id: 'opt2', text_ar: 'إعلام المتصفح أن المستند مكتوب بلغة HTML5', code: '' },
          { id: 'opt3', text_ar: 'إضافة زر لتسجيل الدخول', code: '' },
        ],
        correct_id: 'opt2',
        explanation_ar: 'إعلان DOCTYPE هو أول سطر يخبر المتصفح بالمعيار القياسي المستخدم.',
      },
    ],
  };

  const curriculumLessons = [
    { id: 'l101', title: 'الإنترنت ومواقع الويب', status: 'completed' },
    { id: 'l102', title: 'الملفات وأول صفحة', status: 'completed' },
    { id: 'l103', title: 'هيكل مستند HTML الأساسي', status: 'in_progress' },
    { id: 'l104', title: 'النصوص والعناوين', status: 'locked' },
    { id: 'l105', title: 'الروابط والمسارات', status: 'locked' },
  ];

  const handleMasteryPass = () => {
    setLessonStatus('completed');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 text-right">
      {/* Sidebar Curriculum (Desktop) */}
      <aside className="hidden lg:block w-72 shrink-0 space-y-4 sticky top-20 h-[calc(100vh-6rem)] overflow-y-auto pl-2">
        <Card variant="default" padding="sm" className="space-y-3">
          <h3 className="font-black text-sm text-txt-primary flex items-center gap-2 pb-2 border-b border-bdr">
            <BookOpen className="w-4 h-4 text-orange-500" />
            <span>منهج الوحدة الأولى</span>
          </h3>

          <div className="space-y-1">
            {curriculumLessons.map((item, idx) => (
              <div
                key={item.id}
                className={`p-3 rounded-itqan-btn text-xs font-extrabold flex items-center justify-between transition-all ${
                  item.id === lessonData.id
                    ? 'bg-orange-500 text-white shadow-sm'
                    : item.status === 'completed'
                    ? 'bg-emerald-500/10 text-emerald-500'
                    : 'text-txt-muted opacity-60'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] shrink-0 font-mono">
                    {idx + 1}
                  </span>
                  <span className="truncate">{item.title}</span>
                </div>
                {item.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                {item.status === 'locked' && <Lock className="w-3.5 h-3.5 shrink-0" />}
              </div>
            ))}
          </div>
        </Card>
      </aside>

      {/* Main Reading & Workspace Area */}
      <div className="flex-1 max-w-4xl min-w-0 space-y-6">
        {/* Breadcrumb Header */}
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-txt-muted pb-2 border-b border-bdr font-bold">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link to="/app/courses" className="hover:text-orange-500 transition-colors">
              {lessonData.course_title}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 rotate-180" />
            <span>{lessonData.module_title}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-orange-500" />
              <span>{lessonData.estimated_minutes} دقيقة</span>
            </div>

            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`p-2 rounded-itqan-btn border transition-colors ${
                bookmarked ? 'border-amber-500 bg-amber-500/10 text-amber-500' : 'border-bdr text-txt-muted hover:text-txt-primary'
              }`}
              title="حفظ الدرس للمفضلة"
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>

            <button
              onClick={() => setNoteOpen(true)}
              className="p-2 rounded-itqan-btn border border-bdr text-txt-muted hover:text-txt-primary hover:border-orange-500/40 transition-colors"
              title="تدوين ملاحظة خاصة"
            >
              <FileText className="w-4 h-4" />
            </button>

            {/* Mobile Curriculum Trigger */}
            <button
              onClick={() => setCurriculumDrawerOpen(true)}
              className="lg:hidden p-2 rounded-itqan-btn border border-bdr text-txt-muted hover:text-txt-primary"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Lesson Title */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-black text-txt-primary">{lessonData.title_ar}</h1>
        </div>

        {/* Lesson Block Renderer */}
        <LessonBlockRenderer blocks={lessonData.blocks} />

        {/* Mastery Gate */}
        <MasteryGate
          questions={lessonData.masteryQuestions}
          onPassed={handleMasteryPass}
        />

        {/* Footer Lesson Controls */}
        <div className="pt-8 border-t border-bdr flex items-center justify-between">
          <Link to="/app/lessons/l1020000-0000-0000-0000-000000000002">
            <Button variant="secondary" size="md" leftIcon={<ArrowRight className="w-4 h-4" />}>
              الدرس السابق
            </Button>
          </Link>

          <Button
            disabled={lessonStatus !== 'completed'}
            onClick={() => navigate('/app/lessons/l1040000-0000-0000-0000-000000000004')}
            variant="primary"
            size="md"
            rightIcon={<ArrowLeft className="w-4 h-4" />}
          >
            الدرس التالي
          </Button>
        </div>
      </div>

      {/* Student Private Notes Modal */}
      <Modal isOpen={noteOpen} onClose={() => setNoteOpen(false)} title="ملاحظة خاصة بالدرس">
        <div className="space-y-4">
          <Textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="اكتب ملاحظاتك الشخصية للتذكر لاحقاً..."
            rows={4}
          />
          <div className="flex justify-end gap-2">
            <Button variant="primary" size="sm" onClick={() => setNoteOpen(false)}>
              حفظ الملاحظة
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
