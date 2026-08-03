import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, KeyRound, CheckCircle, Trophy, ShieldCheck, Terminal, Code2 } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-[#07111F] pt-8 pb-16 lg:py-20 border-b border-[#94A3B8]/15">
      {/* Ambient Decorative Background Glows */}
      <div className="absolute top-1/4 right-10 w-[420px] h-[420px] bg-[#4F63F6]/12 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[380px] h-[380px] bg-[#39C6D8]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.03)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[580px] lg:min-h-[640px]">
          
          {/* Right Column: Hero Copy & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-right">
            
            {/* Small Trusted Label */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4F63F6]/12 border border-[#4F63F6]/25 text-[#4F63F6] dark:text-[#6577FF] text-xs sm:text-sm font-semibold mb-6 shadow-sm backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-[#4F63F6] animate-pulse" />
              <span>منصة عربية متكاملة لتعلّم البرمجة</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-[34px] md:text-[44px] lg:text-[56px] font-extrabold text-[#F8FAFC] leading-[1.2] tracking-tight mb-6 max-w-[760px]">
              تعلّم البرمجة بطريقة عملية <br className="hidden sm:inline" />
              <span className="text-[#4F63F6] dark:text-[#6577FF]">
                تصنع منك مطورًا حقيقيًا
              </span>
            </h1>

            {/* Supporting Paragraph */}
            <p className="text-base sm:text-lg text-[#CBD5E1] leading-[1.8] mb-8 max-w-[680px]">
              مسارات تعليمية منظمة، دروس تطبيقية، محرر أكواد مباشر، اختبارات تفاعلية وشهادات إنجاز تساعدك على الانتقال من التعلم إلى التطبيق بثقة.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-6">
              <Link
                to="/register"
                className="min-h-[48px] px-8 py-3.5 text-base font-bold text-white bg-[#4F63F6] hover:bg-[#6577FF] active:bg-[#3B4ED8] rounded-xl shadow-lg hover:shadow-[#4F63F6]/25 transition-all flex items-center justify-center gap-2.5 group"
              >
                <KeyRound className="w-5 h-5" />
                <span>ابدأ بكود الدعوة</span>
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </Link>

              <a
                href="#paths"
                className="min-h-[48px] px-7 py-3.5 text-base font-semibold text-[#F8FAFC] bg-[#101E31] border border-[rgba(148,163,184,0.18)] hover:border-[#4F63F6]/40 hover:bg-[#14243A] rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <span>استكشف المسارات</span>
              </a>
            </div>

            {/* Trust Line */}
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#94A3B8]">
              <ShieldCheck className="w-4 h-4 text-[#39C6D8]" />
              <span>تعلم منظم • تطبيق عملي • متابعة مستمرة</span>
            </div>
          </div>

          {/* Left Column: High Quality Platform UI Preview */}
          <div className="lg:col-span-5 relative w-full flex justify-center">
            <div className="relative w-full max-w-[540px]">
              
              {/* Main Window Frame: Code Editor Preview */}
              <div className="bg-[#0B1728] border border-[#14243A] rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
                
                {/* Header Bar */}
                <div className="px-4 py-3 bg-[#07111F] border-b border-[#14243A] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-[#101E31] text-[11px] font-mono text-[#CBD5E1] border border-white/5">
                    <Terminal className="w-3.5 h-3.5 text-[#4F63F6]" />
                    <span>app.js — محرر إتقان التفاعلي</span>
                  </div>
                  <div className="w-12" />
                </div>

                {/* Code Window Body */}
                <div className="p-4 sm:p-5 font-mono text-xs sm:text-sm text-left dir-ltr space-y-2 bg-[#07111F]/95">
                  <div className="text-gray-500">// مشروع: بطاقة المطور التفاعلية</div>
                  <div>
                    <span className="text-purple-400">const</span>{' '}
                    <span className="text-yellow-300">student</span> = {'{'}
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
                    console.log(<span className="text-emerald-300">'تم اجتياز التحدي بنجاح! 🚀'</span>);
                  </div>
                  <div>{'}'}</div>
                </div>

                {/* Live Console Footer */}
                <div className="px-4 py-2.5 bg-[#0B1728] border-t border-[#14243A] flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>النتيجة: تم تشغيل الكود وتطبيقه 100%</span>
                  </div>
                  <span className="text-gray-400 text-[10px]">HTML/CSS/JS</span>
                </div>
              </div>

              {/* Floating Badge 1: Lesson Progress */}
              <div className="absolute -top-5 -right-2 sm:-right-6 bg-[#101E31]/95 backdrop-blur-md border border-[rgba(148,163,184,0.18)] p-3.5 rounded-xl shadow-xl flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 rounded-lg bg-[#4F63F6]/15 text-[#4F63F6] flex items-center justify-center shrink-0">
                  <Code2 className="w-5 h-5" />
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-[#F8FAFC]">تطبيق مباشر على Flexbox</div>
                  <div className="text-[11px] text-[#39C6D8] font-semibold">درس مكتمل (+50 نقطة)</div>
                </div>
              </div>

              {/* Floating Badge 2: Quiz Result */}
              <div className="absolute -bottom-6 -left-2 sm:-left-6 bg-[#101E31]/95 backdrop-blur-md border border-[rgba(148,163,184,0.18)] p-3.5 rounded-xl shadow-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
                  <Trophy className="w-5 h-5" />
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-[#F8FAFC]">اختبار إتقان البرمجي</div>
                  <div className="text-[11px] text-emerald-400 font-semibold">اجتياز كامل 100% 🏆</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

