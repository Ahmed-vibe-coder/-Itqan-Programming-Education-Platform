import React from 'react';
import { FileText, Edit3, Trash2, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentNotesPage: React.FC = () => {
  const notes = [
    {
      id: 'n1',
      lessonTitle: 'هيكل مستند HTML الأساسي',
      lessonId: 'l1030000-0000-0000-0000-000000000003',
      content: 'الفرق الرئيسي بين head و body أن الأول محتوى خفي للبيانات والترويسة، بينما body محتوى مرئي على الشاشة.',
      updatedAt: 'اليوم',
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-bdr pb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-brand-primary" />
          <h1 className="text-xl font-bold text-txt-primary">ملاحظاتي الدراسية الشخصية</h1>
        </div>
      </div>

      <div className="space-y-4">
        {notes.map((note) => (
          <div key={note.id} className="p-5 rounded-2xl border border-bdr bg-surface space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-bdr pb-2">
              <span className="font-bold text-xs text-brand-primary">{note.lessonTitle}</span>
              <span className="text-[11px] text-txt-muted">{note.updatedAt}</span>
            </div>
            <p className="text-xs text-txt-secondary leading-relaxed">{note.content}</p>
            <div className="pt-2 flex justify-end">
              <Link
                to={`/app/lessons/${note.lessonId}`}
                className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>الذهاب للدرس</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
