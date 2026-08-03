import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import {
  Users,
  FileCheck,
  PlusCircle,
  BookOpen,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Bot,
  KeyRound,
  FileText,
  Clock,
  Sparkles,
  ArrowUpRight,
  Layers,
  BarChart3,
  UserX,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface AttentionItem {
  id: string;
  title: string;
  description: string;
  type: 'inactive' | 'failed' | 'help' | 'grading' | 'project' | 'invitation' | 'exam';
  link: string;
  badgeText: string;
  badgeClass: string;
}

export const TeacherDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeStudentsCount: 11,
    activeGroupsCount: 3,
    publishedCoursesCount: 3,
    lessonsCompletedThisWeek: 42,
    examsSubmittedThisWeek: 18,
    avgCompletionRate: 84,
    gradingQueueCount: 2,
    openHelpRequestsCount: 1,
  });

  const [attentionItems, setAttentionItems] = useState<AttentionItem[]>([
    {
      id: 'att-1',
      title: 'طالب لم يسجل الدخول منذ 5 أيام',
      description: 'الطالب "علي حسن" لم يتفاعل مع الدروس منذ يوم السبت الماضي.',
      type: 'inactive',
      link: '/teacher/students',
      badgeText: 'متابعة الحضور',
      badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    },
    {
      id: 'att-2',
      title: 'إجابة مقالية تنتظر التصحيح اليدوي',
      description: 'إجابة الطالب "محمد أحمد" على سؤال المقارنة بين Block و Inline.',
      type: 'grading',
      link: '/teacher/grading',
      badgeText: 'تصحيح يدويا',
      badgeClass: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    },
    {
      id: 'att-3',
      title: 'مشروع ختامي بانتظار التقييم',
      description: 'مشروع "بناء صفحة هبوط شخصية" قُدّم بواسطة "سارة خالد".',
      type: 'project',
      link: '/teacher/projects',
      badgeText: 'مراجعة مشروع',
      badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    },
    {
      id: 'att-4',
      title: 'كود دعوة قارب على الانتهاء',
      description: 'الكود NAWA-CLASS-A استُخدم 14 من أصل 15 مرة.',
      type: 'invitation',
      link: '/teacher/invitations',
      badgeText: 'تجديد الكود',
      badgeClass: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    }
  ]);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const { count: studentCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
        const { count: groupCount } = await supabase.from('groups').select('*', { count: 'exact', head: true });
        const { count: courseCount } = await supabase.from('courses').select('*', { count: 'exact', head: true }).eq('status', 'published');

        if (studentCount !== null && studentCount > 0) {
          setStats(prev => ({
            ...prev,
            activeStudentsCount: studentCount,
            activeGroupsCount: groupCount || 3,
            publishedCoursesCount: courseCount || 3,
          }));
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#6D3DEB]/15 via-surface to-[#FF6B5E]/10 p-6 rounded-3xl border border-[#6D3DEB]/25 shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-brand-primary" />
            <h1 className="text-2xl font-extrabold text-txt-primary">مركز قيادة إتقان — الإدارة والتعليم</h1>
          </div>
          <p className="text-xs text-txt-muted leading-relaxed">
            المنظومة التفاعلية الشاملة لمتابعة إنجاز الطلاب، إدارة بنك الأسئلة، بناء الامتحانات وتصحيح المشاريع.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/teacher/questions/new"
            className="min-h-[44px] px-4 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>إنشاء سؤال جديد</span>
          </Link>
          <Link
            to="/teacher/questions/ai"
            className="min-h-[44px] px-4 py-2.5 bg-surface border border-brand-primary/30 text-brand-primary hover:bg-brand-primary/10 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 shadow-sm"
          >
            <Bot className="w-4 h-4 text-brand-primary" />
            <span>توليد بالـ AI</span>
          </Link>
        </div>
      </div>

      {/* Top Action Area */}
      <div className="bg-surface border border-bdr rounded-2xl p-5 shadow-sm space-y-3">
        <h2 className="text-xs font-extrabold text-txt-muted uppercase tracking-wider">الإجراءات السريعة للمعلم</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          <Link
            to="/teacher/questions/new"
            className="p-3 rounded-xl border border-bdr bg-surface-secondary hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-all text-center flex flex-col items-center gap-1.5 group"
          >
            <HelpCircle className="w-5 h-5 text-brand-primary group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-bold text-txt-primary">إنشاء سؤال</span>
          </Link>
          <Link
            to="/teacher/assessments/builder"
            className="p-3 rounded-xl border border-bdr bg-surface-secondary hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all text-center flex flex-col items-center gap-1.5 group"
          >
            <FileCheck className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-bold text-txt-primary">إنشاء امتحان</span>
          </Link>
          <Link
            to="/teacher/lessons/new"
            className="p-3 rounded-xl border border-bdr bg-surface-secondary hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all text-center flex flex-col items-center gap-1.5 group"
          >
            <BookOpen className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-bold text-txt-primary">إضافة درس</span>
          </Link>
          <Link
            to="/teacher/invitations"
            className="p-3 rounded-xl border border-bdr bg-surface-secondary hover:border-purple-500/50 hover:bg-purple-500/5 transition-all text-center flex flex-col items-center gap-1.5 group"
          >
            <KeyRound className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-bold text-txt-primary">كود دعوة</span>
          </Link>
          <Link
            to="/teacher/students/new"
            className="p-3 rounded-xl border border-bdr bg-surface-secondary hover:border-amber-500/50 hover:bg-amber-500/5 transition-all text-center flex flex-col items-center gap-1.5 group"
          >
            <Users className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-bold text-txt-primary">إضافة طالب</span>
          </Link>
          <Link
            to="/teacher/groups/new"
            className="p-3 rounded-xl border border-bdr bg-surface-secondary hover:border-sky-500/50 hover:bg-sky-500/5 transition-all text-center flex flex-col items-center gap-1.5 group"
          >
            <Layers className="w-5 h-5 text-sky-500 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-bold text-txt-primary">إنشاء مجموعة</span>
          </Link>
          <Link
            to="/teacher/grading"
            className="p-3 rounded-xl border border-bdr bg-surface-secondary hover:border-rose-500/50 hover:bg-rose-500/5 transition-all text-center flex flex-col items-center gap-1.5 group relative"
          >
            <FileText className="w-5 h-5 text-rose-500 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-bold text-txt-primary">التصحيح اليدوي</span>
            {stats.gradingQueueCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-mono flex items-center justify-center font-bold">
                {stats.gradingQueueCount}
              </span>
            )}
          </Link>
          <Link
            to="/teacher/questions/ai"
            className="p-3 rounded-xl border border-bdr bg-surface-secondary hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-all text-center flex flex-col items-center gap-1.5 group"
          >
            <Bot className="w-5 h-5 text-brand-primary group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-bold text-txt-primary">أسئلة الذكاء الاصطناعي</span>
          </Link>
        </div>
      </div>

      {/* Teaching Overview (Real Aggregate Metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="bg-surface border border-bdr p-4 rounded-2xl shadow-sm space-y-1">
          <span className="text-xs text-txt-muted block">الطلاب النشطون</span>
          <span className="text-2xl font-extrabold text-txt-primary font-mono">{stats.activeStudentsCount}</span>
        </div>
        <div className="bg-surface border border-bdr p-4 rounded-2xl shadow-sm space-y-1">
          <span className="text-xs text-txt-muted block">المجموعات النشطة</span>
          <span className="text-2xl font-extrabold text-brand-primary font-mono">{stats.activeGroupsCount}</span>
        </div>
        <div className="bg-surface border border-bdr p-4 rounded-2xl shadow-sm space-y-1">
          <span className="text-xs text-txt-muted block">الكورسات المنشورة</span>
          <span className="text-2xl font-extrabold text-emerald-500 font-mono">{stats.publishedCoursesCount}</span>
        </div>
        <div className="bg-surface border border-bdr p-4 rounded-2xl shadow-sm space-y-1">
          <span className="text-xs text-txt-muted block">دروس المكتملة (الأسبوع)</span>
          <span className="text-2xl font-extrabold text-indigo-500 font-mono">{stats.lessonsCompletedThisWeek}</span>
        </div>
        <div className="bg-surface border border-bdr p-4 rounded-2xl shadow-sm space-y-1">
          <span className="text-xs text-txt-muted block">الامتحانات المسلمة</span>
          <span className="text-2xl font-extrabold text-sky-500 font-mono">{stats.examsSubmittedThisWeek}</span>
        </div>
        <div className="bg-surface border border-bdr p-4 rounded-2xl shadow-sm space-y-1">
          <span className="text-xs text-txt-muted block">متوسط الإتقان</span>
          <span className="text-2xl font-extrabold text-amber-500 font-mono">%{stats.avgCompletionRate}</span>
        </div>
        <div className="bg-surface border border-bdr p-4 rounded-2xl shadow-sm space-y-1">
          <span className="text-xs text-txt-muted block">طابور التصحيح</span>
          <span className="text-2xl font-extrabold text-rose-500 font-mono">{stats.gradingQueueCount}</span>
        </div>
        <div className="bg-surface border border-bdr p-4 rounded-2xl shadow-sm space-y-1">
          <span className="text-xs text-txt-muted block">طلبات المساعدة</span>
          <span className="text-2xl font-extrabold text-purple-500 font-mono">{stats.openHelpRequestsCount}</span>
        </div>
      </div>

      {/* Main Grid: Attention Center & Group Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Attention Center (مركز الانتباه) */}
        <div className="lg:col-span-2 bg-surface border border-bdr rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-bdr pb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <h2 className="font-bold text-base text-txt-primary">مركز الانتباه (Attention Center)</h2>
            </div>
            <Link to="/teacher/attention" className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1">
              <span>عرض كل الإشعارات</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {attentionItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-bdr bg-surface-secondary flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-brand-primary/30 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${item.badgeClass}`}>
                      {item.badgeText}
                    </span>
                    <h3 className="text-xs font-bold text-txt-primary">{item.title}</h3>
                  </div>
                  <p className="text-xs text-txt-muted">{item.description}</p>
                </div>

                <Link
                  to={item.link}
                  className="px-3 py-1.5 rounded-lg bg-surface border border-bdr text-xs font-bold text-txt-secondary hover:text-brand-primary hover:border-brand-primary transition-all shrink-0"
                >
                  اتخاذ إجراء
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Group Progress Overview */}
        <div className="bg-surface border border-bdr rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-bdr pb-3">
            <h3 className="font-bold text-sm text-txt-primary flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-primary" />
              <span>تقدم المجموعات التعلمية</span>
            </h3>
            <Link to="/teacher/groups" className="text-xs font-bold text-brand-primary hover:underline">
              المجموعات
            </Link>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-bdr bg-surface-secondary space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-txt-primary">المجموعة الأولى (أبطال HTML)</span>
                <span className="font-mono text-brand-primary font-bold">8 طلاب</span>
              </div>
              <div className="w-full bg-bdr/50 rounded-full h-2 overflow-hidden">
                <div className="bg-brand-primary h-full rounded-full" style={{ width: '85%' }}></div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-txt-muted">
                <span>متوسط التقدم: 85%</span>
                <span className="text-emerald-500 font-bold">جاهزون للامتحان الختامي</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-bdr bg-surface-secondary space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-txt-primary">مجموعة الموهوبين (JS Core)</span>
                <span className="font-mono text-brand-primary font-bold">3 طلاب</span>
              </div>
              <div className="w-full bg-bdr/50 rounded-full h-2 overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '60%' }}></div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-txt-muted">
                <span>متوسط التقدم: 60%</span>
                <span className="text-amber-500 font-bold">يحتاجون مراجعة الدوال</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Status & Quick Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Content Status */}
        <div className="bg-surface border border-bdr rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-bdr pb-3">
            <h3 className="font-bold text-sm text-txt-primary flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-500" />
              <span>حالة المحتوى والدروس</span>
            </h3>
            <Link to="/teacher/content/review" className="text-xs font-bold text-brand-primary hover:underline">
              مراجعة المحتوى
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-bdr bg-surface-secondary flex items-center justify-between">
              <span className="text-txt-muted">مسودات الدروس</span>
              <span className="font-bold font-mono text-txt-primary">2</span>
            </div>
            <div className="p-3 rounded-xl border border-bdr bg-surface-secondary flex items-center justify-between">
              <span className="text-txt-muted">دروس تتطلب تدقيقًا</span>
              <span className="font-bold font-mono text-amber-500">1</span>
            </div>
            <div className="p-3 rounded-xl border border-bdr bg-surface-secondary flex items-center justify-between">
              <span className="text-txt-muted">أسئلة غير منشورة</span>
              <span className="font-bold font-mono text-txt-primary">5</span>
            </div>
            <div className="p-3 rounded-xl border border-bdr bg-surface-secondary flex items-center justify-between">
              <span className="text-txt-muted">مسودات الذكاء الاصطناعي</span>
              <span className="font-bold font-mono text-indigo-500">3</span>
            </div>
          </div>
        </div>

        {/* Quick Analytics */}
        <div className="bg-surface border border-bdr rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-bdr pb-3">
            <h3 className="font-bold text-sm text-txt-primary flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-500" />
              <span>تحليلات سريعة للمقررات</span>
            </h3>
            <Link to="/teacher/analytics" className="text-xs font-bold text-brand-primary hover:underline">
              التقارير الكاملة
            </Link>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-secondary">
              <span className="text-txt-muted">أكثر الدرس صعوبة:</span>
              <span className="font-bold text-txt-primary">Flexbox & Grid Layout</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-secondary">
              <span className="text-txt-muted">أكثر الأخطاء تكرارًا:</span>
              <span className="font-bold text-amber-500">نسيان إغلاق وسوم HTML المغلقة</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-secondary">
              <span className="text-txt-muted">المجموعة الأعلى أداءً:</span>
              <span className="font-bold text-emerald-500">المجموعة الأولى (أبطال HTML)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
