import React from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, LogIn, ArrowLeft, Sparkles } from 'lucide-react';

export const FinalCTASection: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-[#07111F] relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16">
        
        {/* Glow Container */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#0B1728] via-[#101E31] to-[#14243A] border border-[#4F63F6]/30 p-8 sm:p-12 lg:p-16 text-center shadow-2xl overflow-hidden">
          
          {/* Ambient Background Lighting */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#4F63F6]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#39C6D8]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4F63F6]/12 border border-[#4F63F6]/25 text-[#4F63F6] dark:text-[#6577FF] text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-[#4F63F6]" />
              <span>انضم الآن لأكاديمية إتقان</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F8FAFC] tracking-tight leading-tight">
              ابدأ رحلتك التعليمية مع إتقان
            </h2>

            <p className="text-base sm:text-lg text-[#CBD5E1] leading-relaxed max-w-2xl mx-auto">
              استخدم كود الدعوة الخاص بك وابدأ مسارك التعليمي بخطوات واضحة وتطبيقات عملية.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto min-h-[48px] px-8 py-4 text-base font-bold text-white bg-[#4F63F6] hover:bg-[#6577FF] active:bg-[#3B4ED8] rounded-xl shadow-lg hover:shadow-[#4F63F6]/30 transition-all flex items-center justify-center gap-2 group"
              >
                <KeyRound className="w-5 h-5" />
                <span>ابدأ بكود الدعوة</span>
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/login"
                className="w-full sm:w-auto min-h-[48px] px-8 py-4 text-base font-semibold text-white bg-white/10 border border-white/20 hover:bg-white/20 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                <span>تسجيل الدخول</span>
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

