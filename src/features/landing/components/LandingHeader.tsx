import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/shared/Logo';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { KeyRound, Menu, X, ArrowLeft, LogIn, GraduationCap } from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';
import { Button } from '@/components/ui/Button';

export const LandingHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const navLinks = [
    { label: 'الرئيسية', href: '#' },
    { label: 'المسارات التعليمية', href: '#paths' },
    { label: 'مميزات إتقان', href: '#features' },
    { label: 'آلية العمل', href: '#how-it-works' },
    { label: 'الشهادات المعتمدة', href: '#certificates' },
    { label: 'اختبار HTML 🎓', href: '/html-exam', isRouterLink: true },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      setMobileMenuOpen(false);
      if (href === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-surface/85 backdrop-blur-xl border-b border-bdr/70 transition-all duration-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Right side: Logo & Desktop Navigation */}
        <div className="flex items-center gap-6 lg:gap-10">
          <Link to="/" className="flex items-center shrink-0">
            <Logo size="md" showTagline />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {navLinks.map((link) =>
              link.isRouterLink ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-xs font-bold text-orange-500 hover:text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 px-3 py-1.5 rounded-full border border-orange-500/25 transition-all flex items-center gap-1 shrink-0 ml-1 shadow-xs"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-sm font-semibold text-txt-secondary hover:text-orange-500 hover:bg-orange-500/5 px-3 py-2 rounded-lg transition-all"
                >
                  {link.label}
                </a>
              )
            )}
          </nav>
        </div>

        {/* Left side: Actions & Theme toggle */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {user ? (
            <Link to="/app">
              <Button variant="primary" size="md" rightIcon={<ArrowLeft className="w-4 h-4" />}>
                لوحة التحكم
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="md" leftIcon={<LogIn className="w-4 h-4" />}>
                  تسجيل الدخول
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="md" leftIcon={<KeyRound className="w-4 h-4" />}>
                  ابدأ التعلم الآن
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-2">
          {!user && (
            <Link to="/register">
              <Button variant="primary" size="sm" leftIcon={<KeyRound className="w-3.5 h-3.5" />}>
                ابدأ الان
              </Button>
            </Link>
          )}
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-itqan-btn text-txt-secondary hover:text-txt-primary hover:bg-surface-secondary border border-bdr transition-colors flex items-center justify-center min-h-[44px] min-w-[44px]"
            aria-label="القائمة الرئيسية"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-20 bg-surface/98 backdrop-blur-xl border-b border-bdr shadow-2xl transition-all z-40 text-right">
          <div className="px-6 py-6 space-y-6">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) =>
                link.isRouterLink ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-itqan-btn text-base font-bold text-orange-500 bg-orange-500/10 hover:bg-orange-500/20 transition-colors flex items-center justify-between"
                  >
                    <span>{link.label}</span>
                    <GraduationCap className="w-5 h-5" />
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="px-4 py-3 rounded-itqan-btn text-base font-semibold text-txt-primary hover:bg-orange-500/10 hover:text-orange-500 transition-colors"
                  >
                    {link.label}
                  </a>
                )
              )}
            </nav>

            <div className="pt-4 border-t border-bdr flex flex-col gap-3">
              {user ? (
                <Link to="/app" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="lg" fullWidth rightIcon={<ArrowLeft className="w-5 h-5" />}>
                    الذهاب للوحة التحكم
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" size="lg" fullWidth leftIcon={<KeyRound className="w-5 h-5" />}>
                      ابدأ التعلم الآن
                    </Button>
                  </Link>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="secondary" size="lg" fullWidth leftIcon={<LogIn className="w-5 h-5" />}>
                      تسجيل الدخول
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

