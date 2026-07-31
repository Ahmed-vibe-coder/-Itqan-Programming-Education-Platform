import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Code,
  Type,
  HelpCircle,
  FileText,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  GripVertical,
  Play,
  Eye,
  Save
} from 'lucide-react';

export interface LessonBlockData {
  id: string;
  type: string;
  content: any;
}

export const BLOCK_TYPES = [
  { id: 'heading', label: 'عنوان رئيسي / فرعي', icon: Type },
  { id: 'paragraph', label: 'فقرة نصية شرح', icon: FileText },
  { id: 'definition', label: 'تعريف مصطلح برمجي', icon: Lightbulb },
  { id: 'analogy', label: 'تشبيه / تقريب ملموس', icon: Lightbulb },
  { id: 'note', label: 'ملاحظة تعليمية', icon: Lightbulb },
  { id: 'tip', label: 'نصيحة برمجية', icon: CheckCircle2 },
  { id: 'warning', label: 'تحذير من خطأ شائع', icon: AlertTriangle },
  { id: 'code', label: 'كتلة كود مصدري (LTR)', icon: Code },
  { id: 'playground', label: 'مختبر تفاعلي حي (Playground)', icon: Play },
  { id: 'practice', label: 'تمرين عملي تطبيقي', icon: Play },
  { id: 'summary', label: 'ملخص الدرس', icon: FileText },
  { id: 'mastery_gate', label: 'بوابة الإتقان (Mastery Gate)', icon: CheckCircle2 },
];

interface LessonBlockEditorProps {
  blocks: LessonBlockData[];
  onChange: (updatedBlocks: LessonBlockData[]) => void;
}

export const LessonBlockEditor: React.FC<LessonBlockEditorProps> = ({ blocks, onChange }) => {
  const [activeBlockType, setActiveBlockType] = useState('paragraph');

  const handleAddBlock = (type: string) => {
    const newBlock: LessonBlockData = {
      id: `blk-${Date.now()}`,
      type,
      content: type === 'code' ? { code: '<!-- اكتب الكود هنا -->', lang: 'html' } : { text: 'محتوى الكتلة الجديد...' },
    };
    onChange([...blocks, newBlock]);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const copy = [...blocks];
    const temp = copy[index - 1];
    copy[index - 1] = copy[index];
    copy[index] = temp;
    onChange(copy);
  };

  const handleMoveDown = (index: number) => {
    if (index === blocks.length - 1) return;
    const copy = [...blocks];
    const temp = copy[index + 1];
    copy[index + 1] = copy[index];
    copy[index] = temp;
    onChange(copy);
  };

  const handleDelete = (index: number) => {
    onChange(blocks.filter((_, i) => i !== index));
  };

  const handleUpdateContent = (index: number, newContent: any) => {
    const copy = [...blocks];
    copy[index].content = newContent;
    onChange(copy);
  };

  return (
    <div className="space-y-6">
      {/* Block Controls Toolbar */}
      <div className="bg-surface border border-bdr rounded-2xl p-4 space-y-3 shadow-sm">
        <h3 className="text-xs font-extrabold text-txt-muted uppercase tracking-wider">إضافة كتلة تعليمية جديدة</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          {BLOCK_TYPES.map((bt) => {
            const Icon = bt.icon;
            return (
              <button
                key={bt.id}
                onClick={() => handleAddBlock(bt.id)}
                className="p-2.5 rounded-xl border border-bdr bg-surface-secondary hover:border-brand-primary hover:bg-brand-primary/5 transition-all text-center flex flex-col items-center gap-1 group text-xs font-bold text-txt-primary"
              >
                <Icon className="w-4 h-4 text-brand-primary group-hover:scale-110 transition-transform" />
                <span className="text-[11px] truncate">{bt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Blocks List */}
      <div className="space-y-4">
        {blocks.map((b, idx) => (
          <div key={b.id} className="p-4 rounded-2xl border border-bdr bg-surface shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-bdr pb-2 text-xs">
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-txt-muted cursor-grab" />
                <span className="font-bold text-brand-primary uppercase font-mono">{b.type} (#{idx + 1})</span>
              </div>

              {/* Accessibility Reordering & Delete Controls */}
              <div className="flex items-center gap-1">
                <button
                  disabled={idx === 0}
                  onClick={() => handleMoveUp(idx)}
                  className="p-1 rounded border border-bdr text-txt-muted hover:text-txt-primary disabled:opacity-30"
                  title="تحريك لأعلى"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  disabled={idx === blocks.length - 1}
                  onClick={() => handleMoveDown(idx)}
                  className="p-1 rounded border border-bdr text-txt-muted hover:text-txt-primary disabled:opacity-30"
                  title="تحريك لأسفل"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(idx)}
                  className="p-1 rounded border border-bdr text-rose-500 hover:bg-rose-500/10"
                  title="حذف الكتلة"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Block Body Editing */}
            {b.type === 'code' ? (
              <textarea
                rows={4}
                value={b.content.code || ''}
                onChange={(e) => handleUpdateContent(idx, { ...b.content, code: e.target.value })}
                dir="ltr"
                className="w-full bg-slate-950 text-emerald-400 font-mono border border-bdr rounded-xl p-3 text-xs"
              />
            ) : (
              <textarea
                rows={3}
                value={b.content.text || ''}
                onChange={(e) => handleUpdateContent(idx, { ...b.content, text: e.target.value })}
                className="w-full bg-surface-secondary border border-bdr rounded-xl p-3 text-xs text-txt-primary"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
