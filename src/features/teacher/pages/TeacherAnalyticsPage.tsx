import React from 'react';
import { BarChart3, TrendingUp, Users, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const TeacherAnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between border-b border-bdr pb-4">
        <div>
          <h1 className="text-xl font-bold text-txt-primary">تقارير وأداء المجموعات والدروس</h1>
          <p className="text-xs text-txt-muted">تحليل نسب الفهم والأسئلة الأكثر خطأً وعقبات التعلم</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-surface border border-bdr rounded-2xl space-y-2">
          <span className="text-xs text-txt-muted">متوسط نسبة النجاح العامة</span>
          <span className="text-3xl font-extrabold text-brand-primary block font-mono">88%</span>
        </div>

        <div className="p-5 bg-surface border border-bdr rounded-2xl space-y-2">
          <span className="text-xs text-txt-muted">إجمالي الدروس المكتملة</span>
          <span className="text-3xl font-extrabold text-emerald-500 block font-mono">34</span>
        </div>

        <div className="p-5 bg-surface border border-bdr rounded-2xl space-y-2">
          <span className="text-xs text-txt-muted">الطلاب بحاجة لمتابعة</span>
          <span className="text-3xl font-extrabold text-amber-500 block font-mono">1</span>
        </div>
      </div>

      <div className="bg-surface border border-bdr rounded-2xl p-6 space-y-4 shadow-sm">
        <h3 className="font-bold text-sm text-txt-primary flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>المفاهيم الأكثر تسبباً للأخطاء (Bottlenecks)</span>
        </h3>
        <div className="space-y-2">
          <div className="p-3 bg-surface-secondary rounded-xl border border-bdr text-xs flex items-center justify-between">
            <span>الفرق بين الوسم &lt;head&gt; و &lt;body&gt; (HTML)</span>
            <span className="font-bold text-red-500">%30 نسبة خطأ</span>
          </div>
        </div>
      </div>
    </div>
  );
};
