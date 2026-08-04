import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, KeyRound, CheckCircle, Trophy, ShieldCheck, Terminal, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-bg pt-8 pb-16 lg:py-24 border-b border-bdr">
      {/* Ambient Decorative Background Glows */}
      <div className="absolute top-1/4 right-10 w-[420px] h-[420px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[380px] h-[380px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[580px]">
          
          {/* Right Column: Hero Copy & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-right">
            
            {/* Small Trusted Label */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs sm:text-sm font-extrabold mb-6 shadow-sm backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
              <span>المنصة التعليمية الأولى للتطبيق والإتقان العملي</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-txt-primary leading-[1.25] tracking-tight mb-6 max-w-3xl">
              تعلّم البرمجة والعلوم بأسلوب <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                يصنع منك خبيرًا حقيقيًا
              </span>
            </h1>

            {/* Supporting Paragraph */}
            <p className="text-base sm:text-lg text-txt-secondary leading-[1.8] mb-8 max-w-2xl">
              مسارات تعليمية منظمة، دروس تطبيقية سينمائية، محرر أكواد تفاعلي مباشر، بنك أسئلة متطور واختبارات قياس إتقان حقيقية تمنحك شهادات موثوقة.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-8">
              <Link to="/register">
                <Button variant="primary" size="lg" fullWidth leftIcon={<KeyRound className="w-5 h-5" />} rightIcon={<ArrowLeft className="w-5 h-5" />}>
                  ابدأ رحلة التعلم مجانًا
                </Button>
              </Link>

              <a href="#paths">
                <Button variant="secondary" size="lg" fullWidth>
                  استكشف الكورسات والمسارات
                </Button>
              </a>
            </div>

            {/* Trust Line */}
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-txt-muted">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-500" />
              <span>تعلم برمجيات حقيقية • تطبيقات مباشرة • متابعة دقيقة من المعلم</span>
            </div>
          </div>

          {/* Left Column: High Quality Platform UI Preview */}
          <div className="lg:col-span-5 relative w-full flex justify-center">
            <div className="relative w-full max-w-[520px]">
              
              {/* Main Window Frame: Code Editor Preview */}
              <div className="bg-card border border-bdr rounded-itqan-card shadow-itqan-soft overflow-hidden">
                
                {/* Header Bar */}
                <div className="px-4 py-3 bg-surface border-b border-bdr flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-surface-secondary text-[11px] font-mono text-txt-muted border border-bdr-soft">
                    <Terminal className="w-3.5 h-3.5 text-orange-500" />
                    <span>itqan_mastery.js — محرر إتقان التفاعلي</span>
                  </div>
                  <div className="w-8" />
                </div>

                {/* Code Window Body */}
                <div className="p-5 font-mono text-xs sm:text-sm text-left dir-ltr space-y-2 bg-slate-950 text-slate-100">
                  <div className="text-slate-500">// مشروع: بطاقة إتقان المطور التفاعلية</div>
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
                  <div className="flex items-center gap-2 text-emerald-500 font-bold">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>النتيجة: تم تشغيل الكود بنجاح 100%</span>
                  </div>
                  <span className="text-txt-muted text-[10px]">JS / React / HTML</span>
                </div>
              </div>

              {/* Floating Badge 1: Lesson Progress */}
              <div className="absolute -top-5 -right-2 sm:-right-6 bg-surface border border-bdr p-3.5 rounded-itqan-card shadow-xl flex items-center gap-3 animate-bounce-subtle">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 border border-orange-500/20">
                  <Code2 className="w-5 h-5" />
                </div>
                <div className="text-right">
                  <div className="text-xs font-extrabold text-txt-primary">درس تفاعلي مكتمل</div>
                  <div className="text-[11px] text-orange-500 font-bold">+50 XP نقاط إتقان</div>
                </div>
              </div>

              {/* Floating Badge 2: Quiz Result */}
              <div className="absolute -bottom-6 -left-2 sm:-left-6 bg-surface border border-bdr p-3.5 rounded-itqan-card shadow-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/20">
                  <Trophy className="w-5 h-5" />
                </div>
                <div className="text-right">
                  <div className="text-xs font-extrabold text-txt-primary">اختبار إتقان الشامل</div>
                  <div className="text-[11px] text-emerald-500 font-bold">اجتياز ممتاز 100% 🏆</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
