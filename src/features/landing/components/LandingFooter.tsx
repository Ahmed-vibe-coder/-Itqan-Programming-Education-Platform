import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/shared/Logo';
import { BRAND } from '@/config/brand';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-[#07111F] text-[#CBD5E1] border-t border-[rgba(148,163,184,0.18)] pt-16 pb-12">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          
          {/* Col 1 & 2: Logo & Platform Description */}
          <div className="lg:col-span-2 space-y-4 text-right">
            <Logo size="md" showTagline />
            <p className="text-sm text-[#94A3B8] leading-relaxed max-w-sm">
              الأكاديمية العربية المتخصصة لتعليم البرمجة وتطوير الويب بأعلى درجات الفهم والإتقان من خلال محرر تفاعلي وبوابة اختبارات متكاملة.
            </p>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-3.5 text-right">
            <h4 className="text-sm font-bold text-[#F8FAFC] uppercase tracking-wider">روابط سريعة</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#" className="hover:text-[#4F63F6] dark:hover:text-[#6577FF] transition-colors">الرئيسية</a>
              </li>
              <li>
                <a href="#paths" className="hover:text-[#4F63F6] dark:hover:text-[#6577FF] transition-colors">المسارات التعليمية</a>
              </li>
              <li>
                <a href="#why-us" className="hover:text-[#4F63F6] dark:hover:text-[#6577FF] transition-colors">لماذا إتقان؟</a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-[#4F63F6] dark:hover:text-[#6577FF] transition-colors">كيف نعمل؟</a>
              </li>
            </ul>
          </div>

          {/* Col 4: Learning Paths */}
          <div className="space-y-3.5 text-right">
            <h4 className="text-sm font-bold text-[#F8FAFC] uppercase tracking-wider">المسارات البرمجية</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/courses/html-basics" className="hover:text-[#4F63F6] dark:hover:text-[#6577FF] transition-colors">مسار HTML5 من الصفر</Link>
              </li>
              <li>
                <Link to="/courses/css-basics" className="hover:text-[#4F63F6] dark:hover:text-[#6577FF] transition-colors">مسار CSS3 والتنسيق</Link>
              </li>
              <li>
                <Link to="/courses/javascript-basics" className="hover:text-[#4F63F6] dark:hover:text-[#6577FF] transition-colors">مسار JavaScript التفاعلي</Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Support & Legal */}
          <div className="space-y-3.5 text-right">
            <h4 className="text-sm font-bold text-[#F8FAFC] uppercase tracking-wider">الدعم والقانونية</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/privacy" className="hover:text-[#4F63F6] dark:hover:text-[#6577FF] transition-colors">سياسة الخصوصية</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#4F63F6] dark:hover:text-[#6577FF] transition-colors">الشروط والأحكام</Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-[#4F63F6] dark:hover:text-[#6577FF] transition-colors">تواصل معنا والأسئلة الشائعة</Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Terms */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94A3B8]">
          <div>
            &copy; {new Date().getFullYear()} {BRAND.fullNameAr} — {BRAND.taglineAr}
          </div>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-[#F8FAFC] transition-colors">الخصوصية</Link>
            <Link to="/terms" className="hover:text-[#F8FAFC] transition-colors">الشروط</Link>
            <Link to="/help" className="hover:text-[#F8FAFC] transition-colors">الدعم والتواصل</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

