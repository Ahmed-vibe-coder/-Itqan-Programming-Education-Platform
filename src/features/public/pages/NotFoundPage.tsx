import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-4 text-center dir-rtl">
      <div className="max-w-md w-full bg-surface border border-bdr rounded-3xl p-8 space-y-6 shadow-xl">
        <div className="flex justify-center">
          <Logo size="md" />
        </div>

        <div className="w-20 h-20 bg-brand-primary/10 text-brand-primary rounded-3xl flex items-center justify-center mx-auto">
          <FileQuestion className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl font-extrabold font-mono text-brand-primary">404</span>
          <h1 className="text-2xl font-bold text-txt-primary">الصفحة غير موجودة</h1>
          <p className="text-xs text-txt-muted leading-relaxed">
            عذراً، الرابط الذي حاولت الوصول إليه غير موجود أو تم نقله إلى مكان آخر.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            to="/app"
            className="px-5 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>لوحة التحكم</span>
          </Link>

          <Link
            to="/"
            className="px-5 py-2.5 bg-surface-secondary border border-bdr text-txt-primary hover:text-brand-primary text-xs font-bold rounded-xl flex items-center gap-2 transition-all"
          >
            <span>الصفحة الرئيسية</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
