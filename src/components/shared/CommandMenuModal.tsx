import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Users, FolderKanban, BookOpen, HelpCircle, FileCheck, Award, Plus, Sparkles, Command } from 'lucide-react';

interface CommandMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandMenuModal: React.FC<CommandMenuModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickActions = [
    { label: 'إنشاء سؤال جديد', path: '/teacher/questions/new', icon: Plus },
    { label: 'منشئ الامتحانات', path: '/teacher/assessments/builder', icon: FileCheck },
    { label: 'توليد أسئلة بالذكاء الاصطناعي', path: '/teacher/questions/ai', icon: Sparkles },
    { label: 'إدارة الشهادات', path: '/teacher/certificates', icon: Award },
    { label: 'دليل الطلاب', path: '/teacher/students', icon: Users },
    { label: 'الكورسات والمحتوى', path: '/teacher/courses', icon: FolderKanban },
  ];

  const filteredActions = quickActions.filter(a => a.label.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 z-50 p-4">
      <div className="bg-surface border border-bdr rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden space-y-3 p-4">
        {/* Search Header */}
        <div className="flex items-center gap-3 border-b border-bdr pb-3 px-2">
          <Search className="w-5 h-5 text-brand-primary shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن طالب، درس، سؤال، امتحان، شهادة أو أمر سريع... (Ctrl+K)"
            className="w-full bg-transparent border-none outline-none text-xs text-txt-primary placeholder:text-txt-muted"
          />
          <button onClick={onClose} className="p-1 text-txt-muted hover:text-txt-primary rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results / Quick Actions */}
        <div className="space-y-1 max-h-[300px] overflow-y-auto">
          <span className="text-[11px] font-bold text-txt-muted block px-2 mb-1">الأوامر والإجراءات السريعة</span>
          {filteredActions.length > 0 ? (
            filteredActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(action.path)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-surface-secondary text-right transition-colors text-xs font-bold text-txt-primary group"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-brand-primary group-hover:scale-110 transition-transform" />
                    <span>{action.label}</span>
                  </div>
                  <span className="text-[10px] text-txt-muted font-mono bg-surface-secondary px-2 py-0.5 rounded border border-bdr">
                    انتقال ↵
                  </span>
                </button>
              );
            })
          ) : (
            <div className="p-4 text-center text-xs text-txt-muted">لا توجد نتائج مطابقة للبحث ({query})</div>
          )}
        </div>
      </div>
    </div>
  );
};
