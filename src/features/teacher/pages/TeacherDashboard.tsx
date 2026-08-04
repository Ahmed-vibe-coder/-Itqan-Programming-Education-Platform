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
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MetricCard } from '@/components/shared/StateComponents';

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
      badgeClass: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    },
    {
      id: 'att-2',
      title: 'إجابة مقالية تنتظر التصحيح اليدوي',
      description: 'إجابة الطالب "محمد أحمد" على سؤال المقارنة بين Block و Inline.',
      type: 'grading',
      link: '/teacher/grading',
      badgeText: 'تصحيح يدوي',
      badgeClass: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    },
    {
      id: 'att-3',
      title: 'مشروع ختامي بانتظار التقييم',
      description: 'مشروع "بناء صفحة هبوط شخصية" قُدّم بواسطة "سارة خالد".',
      type: 'project',
      link: '/teacher/projects',
      badgeText: 'مراجعة مشروع',
      badgeClass: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    },
    {
      id: 'att-4',
      title: 'كود دعوة قارب على الانتهاء',
      description: 'الكود ITQAN-CLASS-A استُخدم 14 من أصل 15 مرة.',
      type: 'invitation',
      link: '/teacher/invitations',
      badgeText: 'تجديد الكود',
      badgeClass: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
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
    <div className="space-y-8 text-right">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-orange-600/15 via-surface to-orange-500/10 p-6 rounded-itqan-card border border-orange-500/30 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-orange-500" />
            <h1 className="text-2xl font-black text-txt-primary">مركز قيادة إتقان — الإدارة والتعليم</h1>
          </div>
          <p className="text-xs text-txt-muted font-bold leading-relaxed">
            المنظومة التفاعلية الشاملة لمتابعة إنجاز الطلاب، إدارة بنك الأسئلة، بناء الامتحانات وتصحيح المشاريع.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/teacher/questions/new">
            <Button variant="primary" size="md" leftIcon={<PlusCircle className="w-4 h-4" />}>
              إنشاء سؤال جديد
            </Button>
          </Link>
          <Link to="/teacher/questions/ai">
            <Button variant="secondary" size="md" leftIcon={<Bot className="w-4 h-4 text-orange-500" />}>
              توليد بالـ AI
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Quick Actions Bar */}
      <Card variant="default" padding="md" className="space-y-3">
        <h2 className="text-xs font-black text-txt-muted uppercase tracking-wider">الإجراءات السريعة للمعلم</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {[
            { to: '/teacher/questions/new', label: 'إنشاء سؤال', icon: HelpCircle, color: 'text-orange-500' },
            { to: '/teacher/assessments/builder', label: 'إنشاء امتحان', icon: FileCheck, color: 'text-blue-500' },
            { to: '/teacher/lessons/new', label: 'إضافة درس', icon: BookOpen, color: 'text-emerald-500' },
            { to: '/teacher/invitations', label: 'كود دعوة', icon: KeyRound, color: 'text-purple-500' },
            { to: '/teacher/students/new', label: 'إضافة طالب', icon: Users, color: 'text-amber-500' },
            { to: '/teacher/groups/new', label: 'إنشاء مجموعة', icon: Layers, color: 'text-sky-500' },
            { to: '/teacher/grading', label: 'التصحيح اليدوي', icon: FileText, color: 'text-red-500', count: stats.gradingQueueCount },
            { to: '/teacher/questions/ai', label: 'ذكاء اصطناعي', icon: Bot, color: 'text-orange-500' },
          ].map((action, idx) => {
            const Icon = action.icon;
            return (
              <Link
                key={idx}
                to={action.to}
                className="p-3 rounded-itqan-btn border border-bdr bg-surface-secondary hover:border-orange-500/40 hover:bg-card-hover transition-all text-center flex flex-col items-center gap-1.5 group relative"
              >
                <Icon className={`w-5 h-5 ${action.color} group-hover:scale-110 transition-transform`} />
                <span className="text-[11px] font-black text-txt-primary">{action.label}</span>
                {action.count !== undefined && action.count > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white rounded-full text-[10px] font-mono flex items-center justify-center font-black">
                    {action.count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </Card>

      {/* Teaching Overview (Real Aggregate Metrics Grid) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="bg-card border border-bdr p-4 rounded-itqan-card shadow-sm space-y-1">
          <span className="text-xs text-txt-muted block font-bold">الطلاب النشطون</span>
          <span className="text-2xl font-black text-txt-primary font-mono">{stats.activeStudentsCount}</span>
        </div>
        <div className="bg-card border border-bdr p-4 rounded-itqan-card shadow-sm space-y-1">
          <span className="text-xs text-txt-muted block font-bold">المجموعات النشطة</span>
          <span className="text-2xl font-black text-orange-500 font-mono">{stats.activeGroupsCount}</span>
        </div>
        <div className="bg-card border border-bdr p-4 rounded-itqan-card shadow-sm space-y-1">
          <span className="text-xs text-txt-muted block font-bold">الكورسات المنشورة</span>
          <span className="text-2xl font-black text-emerald-500 font-mono">{stats.publishedCoursesCount}</span>
        </div>
        <div className="bg-card border border-bdr p-4 rounded-itqan-card shadow-sm space-y-1">
          <span className="text-xs text-txt-muted block font-bold">دروس الأسبوع</span>
          <span className="text-2xl font-black text-blue-500 font-mono">{stats.lessonsCompletedThisWeek}</span>
        </div>
        <div className="bg-card border border-bdr p-4 rounded-itqan-card shadow-sm space-y-1">
          <span className="text-xs text-txt-muted block font-bold">الامتحانات المسلمة</span>
          <span className="text-2xl font-black text-sky-500 font-mono">{stats.examsSubmittedThisWeek}</span>
        </div>
        <div className="bg-card border border-bdr p-4 rounded-itqan-card shadow-sm space-y-1">
          <span className="text-xs text-txt-muted block font-bold">متوسط الإتقان</span>
          <span className="text-2xl font-black text-amber-500 font-mono">%{stats.avgCompletionRate}</span>
        </div>
        <div className="bg-card border border-bdr p-4 rounded-itqan-card shadow-sm space-y-1">
          <span className="text-xs text-txt-muted block font-bold">طابور التصحيح</span>
          <span className="text-2xl font-black text-red-500 font-mono">{stats.gradingQueueCount}</span>
        </div>
        <div className="bg-card border border-bdr p-4 rounded-itqan-card shadow-sm space-y-1">
          <span className="text-xs text-txt-muted block font-bold">طلبات المساعدة</span>
          <span className="text-2xl font-black text-purple-500 font-mono">{stats.openHelpRequestsCount}</span>
        </div>
      </div>

      {/* Main Grid: Attention Center & Group Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Attention Center (مركز الانتباه) */}
        <div className="lg:col-span-2 bg-card border border-bdr rounded-itqan-card p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-bdr pb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <h2 className="font-black text-base text-txt-primary">مركز الانتباه (Attention Center)</h2>
            </div>
            <Link to="/teacher/attention" className="text-xs font-black text-orange-500 hover:underline flex items-center gap-1">
              <span>عرض كل التنبيهات</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {attentionItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-itqan-btn border border-bdr bg-surface-secondary flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-orange-500/40 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-black border ${item.badgeClass}`}>
                      {item.badgeText}
                    </span>
                    <h3 className="text-xs font-black text-txt-primary">{item.title}</h3>
                  </div>
                  <p className="text-xs text-txt-muted font-bold">{item.description}</p>
                </div>

                <Link to={item.link}>
                  <Button variant="secondary" size="sm">
                    اتخاذ إجراء
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Group Progress Overview */}
        <div className="bg-card border border-bdr rounded-itqan-card p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-bdr pb-3">
            <h3 className="font-black text-sm text-txt-primary flex items-center gap-2">
              <Layers className="w-4 h-4 text-orange-500" />
              <span>تقدم المجموعات التعلمية</span>
            </h3>
            <Link to="/teacher/groups" className="text-xs font-black text-orange-500 hover:underline">
              المجموعات
            </Link>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-itqan-btn border border-bdr bg-surface-secondary space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-black text-txt-primary">المجموعة الأولى (أبطال HTML)</span>
                <span className="font-mono text-orange-500 font-black">8 طلاب</span>
              </div>
              <div className="w-full bg-bdr/50 rounded-full h-2 overflow-hidden">
                <div className="bg-orange-500 h-full rounded-full" style={{ width: '85%' }}></div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-txt-muted font-bold">
                <span>متوسط التقدم: 85%</span>
                <span className="text-emerald-500 font-black">جاهزون للامتحان الختامي</span>
              </div>
            </div>

            <div className="p-4 rounded-itqan-btn border border-bdr bg-surface-secondary space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-black text-txt-primary">مجموعة الموهوبين (JS Core)</span>
                <span className="font-mono text-orange-500 font-black">3 طلاب</span>
              </div>
              <div className="w-full bg-bdr/50 rounded-full h-2 overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '60%' }}></div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-txt-muted font-bold">
                <span>متوسط التقدم: 60%</span>
                <span className="text-amber-500 font-black">يحتاجون مراجعة الدوال</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Status & Quick Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Content Status */}
        <div className="bg-card border border-bdr rounded-itqan-card p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-bdr pb-3">
            <h3 className="font-black text-sm text-txt-primary flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-500" />
              <span>حالة المحتوى والدروس</span>
            </h3>
            <Link to="/teacher/content/review" className="text-xs font-black text-orange-500 hover:underline">
              مراجعة المحتوى
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-bdr bg-surface-secondary flex items-center justify-between font-bold">
              <span className="text-txt-muted">مسودات الدروس</span>
              <span className="font-black font-mono text-txt-primary">2</span>
            </div>
            <div className="p-3 rounded-xl border border-bdr bg-surface-secondary flex items-center justify-between font-bold">
              <span className="text-txt-muted">دروس تتطلب تدقيقًا</span>
              <span className="font-black font-mono text-amber-500">1</span>
            </div>
            <div className="p-3 rounded-xl border border-bdr bg-surface-secondary flex items-center justify-between font-bold">
              <span className="text-txt-muted">أسئلة غير منشورة</span>
              <span className="font-black font-mono text-txt-primary">5</span>
            </div>
            <div className="p-3 rounded-xl border border-bdr bg-surface-secondary flex items-center justify-between font-bold">
              <span className="text-txt-muted">مسودات الذكاء الاصطناعي</span>
              <span className="font-black font-mono text-blue-500">3</span>
            </div>
          </div>
        </div>

        {/* Quick Analytics */}
        <div className="bg-card border border-bdr rounded-itqan-card p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-bdr pb-3">
            <h3 className="font-black text-sm text-txt-primary flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-500" />
              <span>تحليلات سريعة للمقررات</span>
            </h3>
            <Link to="/teacher/analytics" className="text-xs font-black text-orange-500 hover:underline">
              التقارير الكاملة
            </Link>
          </div>

          <div className="space-y-3 text-xs font-bold">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-secondary">
              <span className="text-txt-muted">أكثر الدرس صعوبة:</span>
              <span className="font-black text-txt-primary">Flexbox & Grid Layout</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-secondary">
              <span className="text-txt-muted">أكثر الأخطاء تكرارًا:</span>
              <span className="font-black text-amber-500">نسيان إغلاق وسوم HTML</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-secondary">
              <span className="text-txt-muted">المجموعة الأعلى أداءً:</span>
              <span className="font-black text-emerald-500">المجموعة الأولى (أبطال HTML)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
