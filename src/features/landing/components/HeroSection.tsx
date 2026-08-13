import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, KeyRound, CheckCircle, Trophy, ShieldCheck, Terminal, Code2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-bg pt-10 pb-20 lg:py-24 border-b border-bdr">
      {/* Ambient Decorative Background Glows */}
      <div className="absolute top-1/4 right-10 w-[460px] h-[460px] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[580px]">
          
          {/* Right Column: Hero Copy & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-right">
            
            {/* Small Trusted Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-500 text-xs sm:text-sm font-bold mb-6 shadow-xs backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-orange-500 animate-pulse shrink-0" />
              <span>المنصة التعليمية الأولى للتطبيق والإتقان العملي</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-txt-primary leading-[1.22] tracking-tight mb-6 max-w-3xl">
              تعلّم البرمجة والتطبيق العملي <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 bg-clip-text text-transparent">
                بأسلوب يصنع منك خبيرًا حقيقيًا
              </span>
            </h1>

            {/* Supporting Paragraph */}
            <p className="text-base sm:text-lg text-txt-secondary leading-[1.85] mb-8 max-w-2xl font-normal">
              مسارات تعليمية منظمة، دروس تطبيقية سينمائية، محرر أكواد مباشر في المتصفح، واختبارات إتقان حقيقية تمنحك شهادات معتمدة وموثوقة.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-8">
              <Link to="/register">
                <Button variant="primary" size="lg" fullWidth leftIcon={<KeyRound className="w-5 h-5" />} rightIcon={<ArrowLeft className="w-5 h-5" />}>
                  انضم للمنصة وابدأ الآن
                </Button>
              </Link>

              <Link to="/html-exam">
                <Button variant="secondary" size="lg" fullWidth leftIcon={<Trophy className="w-5 h-5 text-amber-500" />}>
                  اختبار شهادة HTML المعتمد 🎓
                </Button>
              </Link>
            </div>

            {/* Trust Badges Bar */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm font-semibold text-txt-muted pt-2 border-t border-bdr/60 w-full">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>تعلم برمجيات حقيقية</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-500 shrink-0" />
                <span>تطبيق أسبوعي مباشر</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>متابعة دقيقة وتطوير مستمر</span>
              </div>
            </div>

          </div>

          {/* Left Column: High Quality Platform UI Preview */}
          <div className="lg:col-span-5 relative w-full flex justify-center pt-6 lg:pt-0">
            <div className="relative w-full max-w-[520px]">
              
              {/* Floating Badge 1: Top Right Progress (Positioned safely above code box) */}
              <div className="absolute -top-6 -right-2 sm:-right-4 z-20 bg-surface/95 backdrop-blur-md border border-bdr p-3 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce-subtle">
                <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 border border-orange-500/20">
                  <Code2 className="w-4.5 h-4.5" />
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-txt-primary">درس تفاعلي مكتمل</div>
                  <div className="text-[11px] text-orange-500 font-extrabold">+50 XP نقاط إتقان</div>
                </div>
              </div>

              {/* Main Window Frame: Code Editor Preview */}
              <div className="bg-card border border-bdr rounded-2xl shadow-2xl overflow-hidden relative z-10">
                
                {/* Header Bar */}
                <div className="px-4 py-3 bg-surface-secondary/80 border-b border-bdr flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-surface text-[11px] font-mono text-txt-muted border border-bdr-soft">
                    <Terminal className="w-3.5 h-3.5 text-orange-500" />
                    <span>itqan_mastery.js — محرر إتقان</span>
                  </div>
                  <div className="w-6" />
                </div>

                {/* Code Window Body */}
                <div className="p-5 font-mono text-xs sm:text-sm text-left dir-ltr space-y-2 bg-[#090E17] text-slate-100">
                  <div className="text-slate-500 text-[11px]">// مشروع: بطاقة إتقان المطور التفاعلية</div>
                  <div>
                    <span className="text-orange-400">const</span>{' '}
                    <span className="text-amber-300">student</span> = {'{'}
                  </div>
                  <div className="pl-4">
                    <span className="text-cyan-300">name</span>: <span className="text-emerald-300">'أحمد سعيد'</span>,
                  </div>
                  <div className="pl-4">
                    <span className="text-cyan-300">track</span>: <span className="text-emerald-300">'تطوير الويب الشامل'</span>,
                  </div>
                  <div className="pl-4">
                    <span className="text-cyan-300">completedLessons</span>: <span className="text-amber-400">18</span>,
                  </div>
                  <div className="pl-4">
                    <span className="text-cyan-300">masteryScore</span>: <span className="text-emerald-400">98%</span>
                  </div>
                  <div>{'};'}</div>
                  <div className="pt-1 text-purple-400">
                    <span>function</span> <span className="text-blue-400">runMasteryCode</span>() {'{'}
                  </div>
                  <div className="pl-4 text-emerald-400">
                    console.log(<span className="text-emerald-300">'تم اجتياز الاختبار بالإتقان الكامل! 🚀'</span>);
                  </div>
                  <div>{'}'}</div>
                </div>

                {/* Live Console Footer */}
                <div className="px-4 py-2.5 bg-surface border-t border-bdr flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 text-emerald-500 font-bold text-[11px]">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>النتيجة: تم تشغيل الكود بنجاح 100%</span>
                  </div>
                  <span className="text-txt-muted text-[10px] bg-surface-secondary px-2 py-0.5 rounded">JS / React / HTML</span>
                </div>
              </div>

              {/* Floating Badge 2: Bottom Left Quiz Result */}
              <div className="absolute -bottom-6 -left-2 sm:-left-4 z-20 bg-surface/95 backdrop-blur-md border border-bdr p-3 rounded-2xl shadow-xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/20">
                  <Trophy className="w-4.5 h-4.5" />
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-txt-primary">اختبار إتقان الشامل</div>
                  <div className="text-[11px] text-emerald-500 font-extrabold">اجتياز ممتاز 100% 🏆</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
