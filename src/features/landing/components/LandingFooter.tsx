import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/shared/Logo';
import { BRAND } from '@/config/brand';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-surface text-txt-secondary border-t border-bdr pt-16 pb-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-bdr">
          
          {/* Col 1 & 2: Logo & Platform Description */}
          <div className="lg:col-span-2 space-y-4 text-right">
            <Logo size="md" showTagline />
            <p className="text-sm text-txt-muted leading-relaxed max-w-sm">
              المنصة التعليمية الحديثة لاكتساب المهارات والتطبيق العملي واجتياز الاختبارات بإتقان كامل من خلال محرر تفاعلي وبوابة قياس أداء متكاملة.
            </p>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-3.5 text-right">
            <h4 className="text-sm font-black text-txt-primary uppercase tracking-wider">روابط سريعة</h4>
            <ul className="space-y-2.5 text-sm font-bold">
              <li>
                <a href="#" className="hover:text-orange-500 transition-colors">الرئيسية</a>
              </li>
              <li>
                <a href="#paths" className="hover:text-orange-500 transition-colors">المسارات التعليمية</a>
              </li>
              <li>
                <a href="#features" className="hover:text-orange-500 transition-colors">مميزات المنصة</a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-orange-500 transition-colors">كيف نعمل؟</a>
              </li>
            </ul>
          </div>

          {/* Col 4: Learning Paths */}
          <div className="space-y-3.5 text-right">
            <h4 className="text-sm font-black text-txt-primary uppercase tracking-wider">المسارات البرمجية</h4>
            <ul className="space-y-2.5 text-sm font-bold">
              <li>
                <Link to="/app/courses/html-basics" className="hover:text-orange-500 transition-colors">مسار HTML5 الأساسي</Link>
              </li>
              <li>
                <Link to="/app/courses/css-basics" className="hover:text-orange-500 transition-colors">مسار CSS3 والتصميم</Link>
              </li>
              <li>
                <Link to="/app/courses/javascript-basics" className="hover:text-orange-500 transition-colors">مسار JavaScript التفاعلي</Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Support & Legal */}
          <div className="space-y-3.5 text-right">
            <h4 className="text-sm font-black text-txt-primary uppercase tracking-wider">الدعم والقانونية</h4>
            <ul className="space-y-2.5 text-sm font-bold">
              <li>
                <Link to="/privacy" className="hover:text-orange-500 transition-colors">سياسة الخصوصية</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-orange-500 transition-colors">الشروط والأحكام</Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-orange-500 transition-colors">تواصل معنا والأسئلة الشائعة</Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Terms */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-txt-muted font-medium">
          <div>
            &copy; {new Date().getFullYear()} {BRAND.fullNameAr} — {BRAND.taglineAr}
          </div>
          <div className="flex items-center gap-6 font-bold">
            <Link to="/privacy" className="hover:text-txt-primary transition-colors">الخصوصية</Link>
            <Link to="/terms" className="hover:text-txt-primary transition-colors">الشروط</Link>
            <Link to="/help" className="hover:text-txt-primary transition-colors">الدعم والتواصل</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
