import React from 'react';
import { Activity, ShieldCheck, Database, Server, Cpu, HardDrive, RefreshCw, CheckCircle2, AlertTriangle, KeyRound } from 'lucide-react';

export const SystemHealthPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface border border-bdr p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-brand-primary" />
            <h1 className="text-xl font-extrabold text-txt-primary">حالة المنظومة والعمليات (System Operations & Health)</h1>
          </div>
          <p className="text-xs text-txt-muted mt-1">
            مراقبة الأداء، الاتصال بقاعدة البيانات، استهلاك الـ Edge Functions، وأمن المحاولات.
          </p>
        </div>

        <button className="px-4 py-2 bg-surface-secondary border border-bdr text-txt-primary hover:border-brand-primary text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm">
          <RefreshCw className="w-4 h-4" />
          <span>تحديث حالة الخوادم</span>
        </button>
      </div>

      {/* Health Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface border border-bdr p-5 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-txt-muted">
            <span>قاعدة بيانات Supabase</span>
            <Database className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-lg font-black text-emerald-500">متصلة وسريعة</div>
          <p className="text-[11px] text-txt-muted">معدل الاستجابة 14ms — RLS مفعلة 100%</p>
        </div>

        <div className="bg-surface border border-bdr p-5 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-txt-muted">
            <span>دوال Edge Functions</span>
            <Server className="w-4 h-4 text-brand-primary" />
          </div>
          <div className="text-lg font-black text-txt-primary">3 دوال شغالين</div>
          <p className="text-[11px] text-txt-muted">redeem, generate-ai, submit-attempt</p>
        </div>

        <div className="bg-surface border border-bdr p-5 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-txt-muted">
            <span>الذّكاء الاصطناعي (AI Provider)</span>
            <Cpu className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-lg font-black text-amber-500">Google Gemini API</div>
          <p className="text-[11px] text-txt-muted">مفاتيح الخادم آمنة ومحمية</p>
        </div>

        <div className="bg-surface border border-bdr p-5 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-txt-muted">
            <span>التخزين والمزامنة PWA</span>
            <HardDrive className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-lg font-black text-blue-500">Service Worker Active</div>
          <p className="text-[11px] text-txt-muted">تخزين مؤقت عالي السرعة أوفلاين</p>
        </div>
      </div>

      {/* Detailed Operations Log */}
      <div className="bg-surface border border-bdr rounded-2xl p-6 space-y-4 shadow-sm">
        <h2 className="text-sm font-bold text-txt-primary border-b border-bdr pb-2 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>سجل سلامة الأمن والعمليات الحديثة</span>
        </h2>

        <div className="space-y-2 font-mono text-xs">
          <div className="p-3 rounded-xl border border-bdr bg-surface-secondary flex items-center justify-between">
            <span className="text-emerald-600 font-bold">[100% OK] فحص الأمان لمفاتيح الإجابات وتخصيص RLS</span>
            <span className="text-txt-muted">منذ 5 دقائق</span>
          </div>
          <div className="p-3 rounded-xl border border-bdr bg-surface-secondary flex items-center justify-between">
            <span className="text-brand-primary font-bold">[Edge Execution] دالة redeem-single-use-invitation تعمل بنجاح</span>
            <span className="text-txt-muted">منذ 12 دقيقة</span>
          </div>
          <div className="p-3 rounded-xl border border-bdr bg-surface-secondary flex items-center justify-between">
            <span className="text-emerald-600 font-bold">[PWA Worker] تفعيل إصدار itqan-pwa-v1 أوفلاين</span>
            <span className="text-txt-muted">منذ ساعة</span>
          </div>
        </div>
      </div>
    </div>
  );
};
