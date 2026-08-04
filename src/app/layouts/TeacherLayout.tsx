import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Logo } from '@/components/shared/Logo';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { useAuth } from '@/app/providers/AuthProvider';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  BookOpen,
  HelpCircle,
  PlusCircle,
  FileCheck,
  BarChart3,
  ShieldAlert,
  Settings,
  LogOut,
  Sparkles,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  FileText,
  KeyRound,
  MessageSquare,
  Activity,
  Layers,
  Bot,
  Award,
  Calendar,
  Database,
  History,
  Search
} from 'lucide-react';

import { CommandMenuModal } from '@/components/shared/CommandMenuModal';

interface NavGroup {
  title: string;
  items: { to: string; label: string; icon: React.FC<{ className?: string }> }[];
}

export const TeacherLayout: React.FC = () => {
  const navigate = useNavigate();
  const { profile, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    'التعليم': true,
    'الأسئلة والامتحانات': true,
    'الطلاب': true,
    'التقارير': true,
    'الإدارة والمنظومة': true,
  });

  const toggleGroup = (title: string) => {
    setOpenGroups(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const navGroups: NavGroup[] = [
    {
      title: 'التعليم',
      items: [
        { to: '/teacher/courses', label: 'الكورسات', icon: FolderKanban },
        { to: '/teacher/modules', label: 'الوحدات', icon: Layers },
        { to: '/teacher/lessons', label: 'الدروس', icon: BookOpen },
        { to: '/teacher/projects', label: 'المشاريع', icon: FileText },
        { to: '/teacher/content/review', label: 'مراجعة المحتوى', icon: FileCheck },
      ]
    },
    {
      title: 'الأسئلة والامتحانات',
      items: [
        { to: '/teacher/questions', label: 'بنك الأسئلة', icon: HelpCircle },
        { to: '/teacher/questions/new', label: 'إنشاء سؤال', icon: PlusCircle },
        { to: '/teacher/assessments', label: 'الامتحانات', icon: FileCheck },
        { to: '/teacher/assessments/builder', label: 'منشئ الامتحانات', icon: PlusCircle },
        { to: '/teacher/grading', label: 'التصحيح اليدوي', icon: FileCheck },
        { to: '/teacher/assessments/results', label: 'نتائج المحاولات', icon: BarChart3 },
      ]
    },
    {
      title: 'الطلاب',
      items: [
        { to: '/teacher/students', label: 'الطلاب', icon: Users },
        { to: '/teacher/groups', label: 'المجموعات', icon: Users },
        { to: '/teacher/invitations', label: 'الدعوات', icon: KeyRound },
        { to: '/teacher/help-requests', label: 'طلبات المساعدة', icon: MessageSquare },
        { to: '/teacher/attention', label: 'متابعة الطلاب', icon: ShieldAlert },
      ]
    },
    {
      title: 'التقارير',
      items: [
        { to: '/teacher/analytics', label: 'تحليلات الطلاب', icon: BarChart3 },
        { to: '/teacher/analytics/groups', label: 'تحليلات المجموعات', icon: BarChart3 },
        { to: '/teacher/analytics/questions', label: 'تحليلات الأسئلة', icon: HelpCircle },
        { to: '/teacher/analytics/concepts', label: 'خريطة المفاهيم', icon: Layers },
        { to: '/teacher/analytics/activity', label: 'تقارير النشاط', icon: Activity },
      ]
    },
    {
      title: 'الإدارة والمنظومة',
      items: [
        { to: '/teacher/ai', label: 'إدارة الذكاء الاصطناعي', icon: Bot },
        { to: '/teacher/certificates', label: 'إدارة الشهادات', icon: Award },
        { to: '/teacher/calendar', label: 'التقويم والأجندة', icon: Calendar },
        { to: '/teacher/content/import-export', label: 'الاستيراد والتصدير', icon: Database },
        { to: '/teacher/audit', label: 'سجل العمليات', icon: History },
        { to: '/teacher/system-health', label: 'حالة المنظومة', icon: Activity },
        { to: '/teacher/settings', label: 'إعدادات المنصة', icon: Settings },
      ]
    }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-bg text-txt-primary flex flex-col md:flex-row transition-colors duration-200">
      {/* Sidebar for Desktop */}
      <aside
        className={`hidden md:flex flex-col border-l border-bdr bg-surface transition-all duration-300 z-30 sticky top-0 h-screen overflow-hidden ${
          sidebarCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-bdr flex items-center justify-between">
          <NavLink to="/teacher" className="overflow-hidden">
            <Logo variant={sidebarCollapsed ? 'symbol' : 'compact'} size="sm" />
          </NavLink>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-lg border border-bdr text-txt-muted hover:text-txt-primary hover:bg-surface-secondary transition-colors"
            title={sidebarCollapsed ? 'توسيع القائمة' : 'طوي القائمة'}
          >
            {sidebarCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Top Home Item */}
        <div className="px-3 pt-3">
          <NavLink
            to="/teacher"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-itqan-btn font-extrabold text-xs transition-all ${
                isActive
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'text-txt-secondary hover:text-txt-primary hover:bg-surface-secondary'
              } ${sidebarCollapsed ? 'justify-center px-0' : ''}`
            }
          >
            <LayoutDashboard className="w-4.5 h-4.5 shrink-0" />
            {!sidebarCollapsed && <span>الرئيسية (مركز القيادة)</span>}
          </NavLink>
        </div>

        {/* Grouped Accordion Menu */}
        <div className="flex-1 px-3 py-2 space-y-3 overflow-y-auto">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              {!sidebarCollapsed ? (
                <button
                  onClick={() => toggleGroup(group.title)}
                  className="w-full flex items-center justify-between px-2 py-1 text-[10px] font-black text-txt-muted uppercase tracking-wider hover:text-txt-primary transition-colors text-right"
                >
                  <span>{group.title}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openGroups[group.title] ? '' : '-rotate-90'}`} />
                </button>
              ) : (
                <div className="h-px bg-bdr my-2" />
              )}

              {(sidebarCollapsed || openGroups[group.title]) && (
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === '/teacher'}
                        className={({ isActive }) =>
                          `flex items-center gap-2.5 px-3 py-2 rounded-itqan-btn text-xs font-bold transition-all ${
                            isActive
                              ? 'bg-orange-500/10 text-orange-500 font-extrabold border border-orange-500/20'
                              : 'text-txt-secondary hover:text-txt-primary hover:bg-surface-secondary'
                          } ${sidebarCollapsed ? 'justify-center px-0' : ''}`
                        }
                        title={sidebarCollapsed ? item.label : undefined}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="p-3 border-t border-bdr bg-surface-secondary/50">
          <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-xl bg-orange-500 text-white font-black flex items-center justify-center text-xs shrink-0 shadow-sm">
              أ
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0 text-right">
                <p className="text-xs font-black text-txt-primary truncate">{profile?.full_name || 'المعلم المشرف'}</p>
                <span className="text-[10px] text-orange-500 font-extrabold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>مركز القيادة</span>
                </span>
              </div>
            )}
            {!sidebarCollapsed && (
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-txt-muted hover:text-red-500 hover:bg-red-500/10 transition-colors"
                title="تسجيل الخروج"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Container Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top App Bar */}
        <header className="sticky top-0 z-20 bg-surface/90 backdrop-blur-md border-b border-bdr px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl border border-bdr text-txt-secondary hover:text-txt-primary"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="md:hidden">
              <Logo size="sm" variant="compact" />
            </div>
            <span className="hidden sm:flex items-center gap-1.5 text-xs font-black text-txt-secondary bg-surface-secondary px-3 py-1.5 rounded-xl border border-bdr">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>مركز قيادة إتقان — الإدارة والتعليم</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCommandMenuOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-itqan-btn border border-bdr bg-surface-secondary text-txt-muted hover:text-txt-primary hover:border-orange-500/30 text-xs font-extrabold transition-all"
            >
              <Search className="w-3.5 h-3.5 text-orange-500" />
              <span>بحث سريع (Ctrl+K)</span>
            </button>
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="p-2 rounded-itqan-btn text-txt-muted hover:text-red-500 hover:bg-red-500/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="تسجيل الخروج"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        <CommandMenuModal isOpen={commandMenuOpen} onClose={() => setCommandMenuOpen(false)} />

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-start animate-in fade-in duration-200">
            <div className="w-4/5 max-w-xs bg-surface h-full p-5 flex flex-col justify-between shadow-2xl border-l border-bdr text-right animate-in slide-in-from-right duration-200 overflow-y-auto">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-bdr mb-4">
                  <Logo size="sm" showTagline />
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg text-txt-muted hover:text-txt-primary min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <NavLink
                    to="/teacher"
                    end
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-itqan-btn font-extrabold text-xs bg-orange-500 text-white"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>الرئيسية (مركز القيادة)</span>
                  </NavLink>

                  {navGroups.map((group) => (
                    <div key={group.title} className="space-y-1">
                      <p className="px-2 text-[10px] font-black text-txt-muted uppercase tracking-wider">
                        {group.title}
                      </p>
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={() => setMobileMenuOpen(false)}
                            className={({ isActive }) =>
                              `flex items-center gap-3 px-3 py-2 rounded-itqan-btn text-xs font-bold ${
                                isActive ? 'bg-orange-500/10 text-orange-500 font-black' : 'text-txt-secondary'
                              }`
                            }
                          >
                            <Icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </NavLink>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-bdr mt-6">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 p-3 text-xs font-bold text-red-500 bg-red-500/10 hover:bg-red-500 hover:text-white rounded-itqan-btn transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        <footer className="border-t border-bdr bg-surface py-4 px-4 text-center text-xs text-txt-muted">
          منصة إتقان &copy; {new Date().getFullYear()} — مركز القيادة والتعليم والأسئلة.
        </footer>
      </div>
    </div>
  );
};
