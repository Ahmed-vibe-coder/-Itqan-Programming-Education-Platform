import React from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, LogIn, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const FinalCTASection: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Glow Container */}
        <div className="relative rounded-itqan-card bg-gradient-to-br from-card via-surface-secondary to-card border border-orange-500/30 p-8 sm:p-12 lg:p-16 text-center shadow-itqan-soft overflow-hidden">
          
          {/* Ambient Background Lighting */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-black">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>انضم الآن إلى منصة إتقان التعليمية</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-txt-primary tracking-tight leading-tight">
              ابدأ رحلتك التعليمية اليوم وتعلّم بإتقان
            </h2>

            <p className="text-base sm:text-lg text-txt-secondary leading-relaxed max-w-2xl mx-auto">
              سجل حسابك الآن وابدأ المسارات التعليمية بخطوات واضحة، دروس تطبيقية، واختبارات تفاعلية حقيقية.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button variant="primary" size="lg" leftIcon={<KeyRound className="w-5 h-5" />} rightIcon={<ArrowLeft className="w-5 h-5" />}>
                  ابدأ التعلم مجانًا
                </Button>
              </Link>

              <Link to="/login">
                <Button variant="secondary" size="lg" leftIcon={<LogIn className="w-5 h-5" />}>
                  تسجيل الدخول
                </Button>
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
