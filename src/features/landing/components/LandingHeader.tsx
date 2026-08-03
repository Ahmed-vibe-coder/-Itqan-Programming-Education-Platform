import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/shared/Logo';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { KeyRound, Menu, X, ArrowLeft, LogIn } from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';

export const LandingHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const navLinks = [
    { label: 'الرئيسية', href: '#' },
    { label: 'المسارات', href: '#paths' },
    { label: 'الاختبارات', href: '#preview' },
    { label: 'عن إتقان', href: '#why-us' },
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
    <header className="sticky top-0 z-50 w-full bg-[#07111F]/90 dark:bg-[#07111F]/90 backdrop-blur-md border-b border-[#94A3B8]/15 transition-all">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 h-[76px] flex items-center justify-between gap-6">
        
        {/* Right side: Logo & Desktop Navigation */}
        <div className="flex items-center gap-8 lg:gap-10">
          <Link to="/" className="flex items-center shrink-0 group">
            <Logo size="md" showTagline />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm font-medium text-txt-secondary hover:text-txt-primary transition-colors py-1 relative after:absolute after:bottom-0 after:right-0 after:w-0 after:h-0.5 after:bg-brand-primary hover:after:w-full after:transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Left side: Actions & Theme toggle */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {user ? (
            <Link
              to="/student"
              className="min-h-[44px] px-5 py-2.5 text-sm font-bold text-white bg-brand-primary hover:bg-brand-primary-hover active:bg-brand-primary-active rounded-xl shadow-md hover:shadow-brand-primary/20 transition-all flex items-center gap-2"
            >
              <span>لوحة التحكم</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="min-h-[44px] px-4 py-2.5 text-sm font-semibold text-txt-secondary hover:text-txt-primary hover:bg-white/5 rounded-xl transition-all flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4" />
                <span>تسجيل الدخول</span>
              </Link>
              <Link
                to="/register"
                className="min-h-[44px] px-5 py-2.5 text-sm font-bold text-white bg-brand-primary hover:bg-brand-primary-hover active:bg-brand-primary-active rounded-xl shadow-md hover:shadow-brand-primary/20 transition-all flex items-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>ابدأ بكود الدعوة</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Actions: Primary CTA + Toggle button */}
        <div className="flex md:hidden items-center gap-2">
          {!user && (
            <Link
              to="/register"
              className="min-h-[40px] px-3.5 py-2 text-xs font-bold text-white bg-brand-primary hover:bg-brand-primary-hover rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>كود الدعوة</span>
            </Link>
          )}
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="min-h-[40px] min-w-[40px] p-2 rounded-xl text-txt-secondary hover:text-txt-primary hover:bg-white/10 border border-[#94A3B8]/20 transition-colors flex items-center justify-center"
            aria-label="القائمة الرئيسية"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[76px] bg-[#07111F]/98 dark:bg-[#07111F]/98 backdrop-blur-xl border-b border-[#94A3B8]/20 shadow-2xl transition-all z-40">
          <div className="px-6 py-6 space-y-6">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-4 py-3 rounded-xl text-base font-semibold text-txt-primary hover:bg-brand-primary/15 hover:text-brand-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="pt-4 border-t border-[#94A3B8]/15 flex flex-col gap-3">
              {user ? (
                <Link
                  to="/student"
                  onClick={() => setMobileMenuOpen(false)}
                  className="min-h-[48px] w-full px-4 py-3 text-center text-base font-bold text-white bg-brand-primary rounded-xl shadow-md flex items-center justify-center gap-2"
                >
                  <span>الذهاب للوحة التحكم</span>
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="min-h-[48px] w-full px-4 py-3 text-center text-base font-bold text-white bg-brand-primary hover:bg-brand-primary-hover rounded-xl shadow-md flex items-center justify-center gap-2"
                  >
                    <KeyRound className="w-5 h-5" />
                    <span>ابدأ بكود الدعوة</span>
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="min-h-[48px] w-full px-4 py-3 text-center text-base font-semibold text-txt-primary bg-[#101E31] border border-[#94A3B8]/20 rounded-xl flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>تسجيل الدخول</span>
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

