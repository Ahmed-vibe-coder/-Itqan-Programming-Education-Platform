import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Logo } from '@/components/shared/Logo';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { useAuth } from '@/app/providers/AuthProvider';
import {
  Home,
  BookOpen,
  Code2,
  FileCheck2,
  User,
  LogOut,
  Bell,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Flame,
  Zap,
  Bookmark,
  FileText,
  Trophy,
  LineChart,
  Settings,
  Sparkles
} from 'lucide-react';

export const StudentLayout: React.FC = () => {
  const navigate = useNavigate();
  const { profile, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileSheetOpen, setProfileSheetOpen] = useState(false);

  const mainBottomNav = [
    { to: '/app', label: 'الرئيسية', icon: Home },
    { to: '/app/courses', label: 'الكورسات', icon: BookOpen },
    { to: '/app/practice', label: 'التدريب', icon: Code2 },
    { to: '/app/exams', label: 'الامتحانات', icon: FileCheck2 },
    { to: '/app/profile', label: 'حسابي', icon: User },
  ];

  const sidebarNavItems = [
    { to: '/app', label: 'الرئيسية', icon: Home },
    { to: '/app/courses', label: 'الكورسات والتعلّم', icon: BookOpen },
    { to: '/app/roadmap', label: 'خريطة التعلم', icon: LineChart },
    { to: '/app/skills', label: 'خريطة المهارات', icon: LineChart },
    { to: '/app/practice', label: 'التدريب والمختبر', icon: Code2 },
    { to: '/app/exams', label: 'الامتحانات والتقييم', icon: FileCheck2 },
    { to: '/app/projects', label: 'المشاريع التطبيقية', icon: Code2 },
    { to: '/app/mistakes', label: 'دفتر أخطائي', icon: Bookmark },
    { to: '/app/review-center', label: 'مركز المراجعة', icon: LineChart },
    { to: '/app/missions', label: 'المهمات والأوسمة', icon: Trophy },
  ];

  const profileSheetItems = [
    { to: '/app/achievements', label: 'الإنجازات والأوسمة', icon: Trophy },
    { to: '/app/progress', label: 'التقدم التعليمي', icon: LineChart },
    { to: '/app/leaderboard', label: 'لوحة الأوائل والصدارة', icon: Trophy },
    { to: '/app/notes', label: 'الملاحظات الشخصية', icon: FileText },
    { to: '/app/bookmarks', label: 'المحفوظات', icon: Bookmark },
    { to: '/app/settings', label: 'الإعدادات', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-bg text-txt-primary flex flex-col md:flex-row pb-[env(safe-area-inset-bottom)] transition-colors duration-200">
      {/* Desktop Collapsible Sidebar */}
      <aside
        className={`hidden md:flex flex-col border-l border-bdr bg-surface transition-all duration-300 z-30 sticky top-0 h-screen ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="p-4 border-b border-bdr flex items-center justify-between">
          <NavLink to="/app" className="overflow-hidden">
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

        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {sidebarNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/app'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-itqan-btn font-extrabold text-xs transition-all ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                      : 'text-txt-secondary hover:text-txt-primary hover:bg-surface-secondary'
                  } ${sidebarCollapsed ? 'justify-center px-0' : ''}`
                }
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon className="w-4.5 h-4.5 shrink-0" />
                {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-bdr bg-surface-secondary/50">
          <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 font-black flex items-center justify-center text-sm shrink-0 border border-orange-500/20">
              🦅
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0 text-right">
                <p className="text-xs font-black text-txt-primary truncate">{profile?.full_name || 'طالب إتقان'}</p>
                <p className="text-[11px] font-mono text-txt-muted truncate">@{profile?.username || 'student'}</p>
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
        {/* Mobile Safe Top App Bar */}
        <header className="sticky top-0 z-20 bg-surface/95 backdrop-blur-md border-b border-bdr px-4 py-3 flex items-center justify-between pt-[max(0.75rem,env(safe-area-inset-top))]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setProfileSheetOpen(true)}
              className="md:hidden p-1.5 rounded-xl border border-bdr text-txt-secondary hover:text-txt-primary min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <Menu className="w-5 h-5" />
            </button>
            <NavLink to="/app" className="md:hidden">
              <Logo size="sm" variant="compact" />
            </NavLink>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-black font-mono">
              <Flame className="w-4 h-4 fill-orange-500 animate-pulse" />
              <span>3 أيام</span>
            </div>

            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-black font-mono">
              <Zap className="w-4 h-4 fill-amber-500" />
              <span>250 XP</span>
            </div>

            <ThemeToggle />

            <NavLink
              to="/app/notifications"
              className="p-2 rounded-itqan-btn border border-bdr text-txt-secondary hover:text-txt-primary hover:border-orange-500/40 relative min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-orange-500 rounded-full ring-2 ring-surface"></span>
            </NavLink>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto pb-28 md:pb-8">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-bdr px-2 py-2 flex items-center justify-around pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {mainBottomNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/app'}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition-all min-h-[44px] min-w-[44px] justify-center ${
                    isActive ? 'text-orange-500' : 'text-txt-muted hover:text-txt-primary'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Mobile Profile & Drawer Sheet */}
        {profileSheetOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-start animate-in fade-in duration-200">
            <div className="w-4/5 max-w-xs bg-surface h-full p-5 flex flex-col justify-between shadow-2xl border-l border-bdr text-right animate-in slide-in-from-right duration-200 overflow-y-auto">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-bdr mb-6">
                  <Logo size="sm" showTagline />
                  <button
                    onClick={() => setProfileSheetOpen(false)}
                    className="p-2 rounded-lg text-txt-muted hover:text-txt-primary min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-1">
                  <p className="px-2 text-[10px] font-black text-txt-muted uppercase tracking-wider mb-2">المزيد والأقسام المتقدمة</p>
                  {profileSheetItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={() => setProfileSheetOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-3 rounded-itqan-btn text-xs font-bold transition-all ${
                            isActive
                              ? 'bg-orange-500 text-white'
                              : 'text-txt-secondary hover:bg-surface-secondary'
                          }`
                        }
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-bdr mt-6">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 p-3 text-xs font-bold text-red-500 bg-red-500/10 hover:bg-red-500 hover:text-white rounded-itqan-btn transition-colors min-h-[44px]"
                >
                  <LogOut className="w-4 h-4" />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
