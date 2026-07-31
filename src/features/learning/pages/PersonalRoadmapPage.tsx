import React from 'react';
import { Link } from 'react-router-dom';
import { Play, CheckCircle2, Lock, BookOpen, AlertCircle, ArrowLeft } from 'lucide-react';

export const PersonalRoadmapPage: React.FC = () => {
  const roadmapNodes = [
    { id: 'l1', title: 'ما هو هيكل صفحة الويب؟', status: 'completed', duration: '10 دقائق', badge: 'مكتمل' },
    { id: 'l2', title: 'كتابة أول مستند HTML5', status: 'completed', duration: '12 دقيقة', badge: 'مكتمل' },
    { id: 'l1030000-0000-0000-0000-000000000003', title: 'هيكل مستند HTML الأساسي', status: 'in_progress', duration: '15 دقيقة', badge: 'قيد التعلم الآن' },
    { id: 'l4', title: 'العناوين الفقرات <h1..h6>', status: 'locked', duration: '15 دقيقة', badge: 'محجوب حتى الإتقان' },
    { id: 'l5', title: 'الروابط والمسارات <a>', status: 'locked', duration: '20 دقيقة', badge: 'محجوب' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-bdr pb-4">
        <div>
          <h1 className="text-xl font-bold text-txt-primary">خريطة التعلم الشخصية (Personal Roadmap)</h1>
          <p className="text-xs text-txt-muted">تتبع تقدمك في دروس الوحدة الحالية وافتح المحطات المتتابعة</p>
        </div>
      </div>

      <div className="relative pl-6 space-y-6 border-r-2 border-brand-primary/30 mr-4">
        {roadmapNodes.map((node, i) => (
          <div key={node.id} className="relative pr-6 flex items-start justify-between group">
            {/* Node Status Pin */}
            <div
              className={`absolute -right-3.5 top-1.5 w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                node.status === 'completed'
                  ? 'border-emerald-500 bg-emerald-500 text-white'
                  : node.status === 'in_progress'
                  ? 'border-brand-primary bg-brand-primary text-white ring-4 ring-brand-primary/20 animate-pulse'
                  : 'border-bdr bg-surface-secondary text-txt-muted'
              }`}
            >
              {node.status === 'completed' ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : node.status === 'in_progress' ? (
                <Play className="w-3.5 h-3.5 fill-white" />
              ) : (
                <Lock className="w-3.5 h-3.5" />
              )}
            </div>

            <div className="p-5 rounded-2xl border border-bdr bg-surface flex-1 mr-2 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    node.status === 'completed'
                      ? 'bg-emerald-500/10 text-emerald-600'
                      : node.status === 'in_progress'
                      ? 'bg-brand-primary/10 text-brand-primary'
                      : 'bg-surface-secondary text-txt-muted'
                  }`}
                >
                  {node.badge}
                </span>
                <span className="text-[11px] text-txt-muted font-medium">{node.duration}</span>
              </div>

              <h3 className="font-bold text-sm text-txt-primary">{node.title}</h3>

              {node.status !== 'locked' ? (
                <div className="pt-2 flex justify-end">
                  <Link
                    to={`/app/lessons/${node.id}`}
                    className="px-4 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>{node.status === 'completed' ? 'إعادة الدرس' : 'متابعة الدرس'}</span>
                  </Link>
                </div>
              ) : (
                <p className="text-[11px] text-txt-muted">يتطلب اجتياز بوابة إتقان الدرس السابق بنسبة 100%.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
