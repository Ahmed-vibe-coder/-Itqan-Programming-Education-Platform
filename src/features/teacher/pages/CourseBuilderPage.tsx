import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { LessonBlockEditor, LessonBlockData } from '@/features/teacher/components/LessonBlockEditor';
import {
  FolderKanban,
  BookOpen,
  Plus,
  Save,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Monitor,
  Eye,
  Layers,
  FileCheck
} from 'lucide-react';

export const CourseBuilderPage: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState('html');
  const [lessonTitle, setLessonTitle] = useState('درس هيكل صفحة HTML');
  const [lessonBlocks, setLessonBlocks] = useState<LessonBlockData[]>([
    { id: 'blk-1', type: 'heading', content: { text: 'مقدمة في هيكل صفحة HTML5' } },
    { id: 'blk-2', type: 'paragraph', content: { text: 'تتكون كل صفحة ويب من وسم الهيكل الأساسي doctype ووسم html وhead وbody.' } },
    { id: 'blk-3', type: 'code', content: { code: '<!DOCTYPE html>\n<html>\n  <head><title>صفحتي</title></head>\n  <body></body>\n</html>' } },
    { id: 'blk-4', type: 'mastery_gate', content: { text: 'بوابة الإتقان: الإجابة على سؤالين حول الوسوم الأساسية.' } }
  ]);

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isPublished, setIsPublished] = useState(false);

  const handleValidateLesson = () => {
    const errors: string[] = [];
    if (!lessonTitle.trim()) errors.push('عنوان الدرس مطلوب.');
    if (lessonBlocks.length === 0) errors.push('يجب إضافة كتلة تعليمية واحدة على الأقل.');
    const hasCode = lessonBlocks.some((b) => b.type === 'code');
    if (!hasCode) errors.push('يجب إدراج نموذج كود برمجي واحد على الأقل.');
    const hasMastery = lessonBlocks.some((b) => b.type === 'mastery_gate');
    if (!hasMastery) errors.push('يجب تفعيل بوابة الإتقان (Mastery Gate) بنهاية الدرس.');

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handlePublishLesson = async () => {
    if (!handleValidateLesson()) return;
    try {
      await supabase.from('lessons').insert({
        title_ar: lessonTitle,
        slug: lessonTitle.toLowerCase().replace(/\s+/g, '-'),
        status: 'published',
      });
      setIsPublished(true);
      alert('تم الاعتماد والنشر بنجاح!');
    } catch (err) {
      console.error('Error publishing lesson:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface border border-bdr p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-brand-primary" />
            <h1 className="text-xl font-extrabold text-txt-primary">إدارة المحتوى ومحرر الدروس البصري (Course & Lesson CMS)</h1>
          </div>
          <p className="text-xs text-txt-muted mt-1">
            إنشاء الكورسات والوحدات وتحرير الكتل التعليمية بصريًا واختبار شروط النشر والاعتماد.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleValidateLesson}
            className="px-4 py-2.5 bg-surface-secondary border border-bdr text-txt-primary text-xs font-bold rounded-xl hover:bg-surface-secondary/80 flex items-center gap-1.5"
          >
            <FileCheck className="w-4 h-4 text-brand-primary" />
            <span>فحص صحة الدرس (Validation)</span>
          </button>
          <button
            onClick={handlePublishLesson}
            className="px-4 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>اعتماد ونشر الدرس</span>
          </button>
        </div>
      </div>

      {/* Validation Alert Area */}
      {validationErrors.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 space-y-1 text-xs font-bold">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="w-4 h-4" />
            <span>توجد أخطاء تمنع نشر الدرس:</span>
          </div>
          <ul className="list-disc pr-5 space-y-0.5 font-normal">
            {validationErrors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Lesson Metadata Inputs */}
      <div className="bg-surface border border-bdr rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-txt-secondary mb-1">الكورس</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full bg-surface-secondary border border-bdr rounded-xl p-2.5 text-xs text-txt-primary"
            >
              <option value="html">HTML الأساسي</option>
              <option value="css">CSS التنسيق</option>
              <option value="js">JavaScript التفاعلي</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-txt-secondary mb-1">عنوان الدرس</label>
            <input
              type="text"
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
              className="w-full bg-surface-secondary border border-bdr rounded-xl p-2.5 text-xs text-txt-primary font-bold"
            />
          </div>
        </div>
      </div>

      {/* Block Editor Component */}
      <LessonBlockEditor blocks={lessonBlocks} onChange={setLessonBlocks} />
    </div>
  );
};
