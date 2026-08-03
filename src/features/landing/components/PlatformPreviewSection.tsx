import React, { useState } from 'react';
import { Terminal, LayoutDashboard, CheckSquare, Award, Play, CheckCircle2, FileCode2 } from 'lucide-react';

export const PlatformPreviewSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'editor' | 'dashboard' | 'quiz' | 'certificate'>('editor');

  const tabs = [
    { id: 'editor', label: 'محرر الأكواد المباشر', icon: Terminal },
    { id: 'dashboard', label: 'لوحة التحكم والتقدم', icon: LayoutDashboard },
    { id: 'quiz', label: 'بوابة الاختبارات والتحديات', icon: CheckSquare },
    { id: 'certificate', label: 'شهادات الإنجاز الموثقة', icon: Award },
  ] as const;

  return (
    <section id="preview" className="py-20 lg:py-28 bg-[#0B1728] border-y border-[#94A3B8]/15">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#4F63F6] dark:text-[#6577FF] bg-[#4F63F6]/10 px-3.5 py-1.5 rounded-full inline-block mb-3 border border-[#4F63F6]/20">
            تجربة المستخدم
          </span>
          <h2 className="text-3xl lg:text-[40px] font-extrabold text-[#F8FAFC] mb-4 tracking-tight leading-snug">
            بيئة تفاعلية صُممت بأعلى المعايير
          </h2>
          <p className="text-base sm:text-lg text-[#CBD5E1] leading-[1.8]">
            استكشف واجهة المنصة، محرر الأكواد، وأنظمة التقييم التفاعلية مباشرة قبل البدء
          </p>
        </div>

        {/* Tab Buttons Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`min-h-[44px] px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2.5 transition-all ${
                  isActive
                    ? 'bg-[#4F63F6] text-white shadow-lg shadow-[#4F63F6]/20 scale-105'
                    : 'bg-[#101E31] text-[#CBD5E1] hover:text-[#F8FAFC] border border-[rgba(148,163,184,0.18)] hover:border-[#4F63F6]/30'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Mockup Display Window */}
        <div className="max-w-[1000px] mx-auto bg-[#07111F] border border-[#14243A] rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl transition-all">
          
          {/* Window Header Bar */}
          <div className="px-5 py-3.5 bg-[#0B1728] border-b border-[#14243A] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <div className="text-xs font-mono text-[#CBD5E1] bg-[#101E31] px-4 py-1 rounded-md border border-white/5 flex items-center gap-2">
              <FileCode2 className="w-3.5 h-3.5 text-[#4F63F6]" />
              <span>itqan-workspace // {tabs.find(t => t.id === activeTab)?.label}</span>
            </div>
            <div className="w-16" />
          </div>

          {/* Tab Content Panels */}
          <div className="p-6 sm:p-8 min-h-[420px] flex items-center justify-center">
            
            {/* 1. Code Editor Tab Preview */}
            {activeTab === 'editor' && (
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 text-right">
                {/* Code Panel */}
                <div className="bg-[#0B1728] p-5 rounded-xl border border-[#14243A] font-mono text-xs sm:text-sm text-left dir-ltr space-y-2">
                  <div className="text-gray-500 font-sans text-right dir-rtl text-xs mb-2 pb-2 border-b border-white/5">
                    📄 index.html — محرر HTML المباشر
                  </div>
                  <div><span className="text-purple-400">&lt;div</span> <span className="text-yellow-300">class</span>=<span className="text-emerald-300">"hero-card"</span><span className="text-purple-400">&gt;</span></div>
                  <div className="pl-4"><span className="text-purple-400">&lt;h1</span> <span className="text-yellow-300">class</span>=<span className="text-emerald-300">"title"</span><span className="text-purple-400">&gt;</span>أهلاً بك في إتقان<span className="text-purple-400">&lt;/h1&gt;</span></div>
                  <div className="pl-4"><span className="text-purple-400">&lt;p&gt;</span>تعلّم البرمجة وتطوير الويب بالإتقان الكامل.<span className="text-purple-400">&lt;/p&gt;</span></div>
                  <div className="pl-4"><span className="text-purple-400">&lt;button</span> <span className="text-yellow-300">onclick</span>=<span className="text-emerald-300">"start()"</span><span className="text-purple-400">&gt;</span>ابدأ التعلم<span className="text-purple-400">&lt;/button&gt;</span></div>
                  <div><span className="text-purple-400">&lt;/div&gt;</span></div>
                </div>

                {/* Live Output Panel */}
                <div className="bg-[#101E31] text-[#F8FAFC] p-6 rounded-xl border border-[#14243A] flex flex-col justify-between shadow-inner">
                  <div>
                    <div className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                      <span>المعاينة المباشرة (Live Output)</span>
                    </div>
                    <div className="p-5 rounded-xl bg-[#07111F] text-white space-y-3 border border-white/5">
                      <h1 className="text-2xl font-bold text-emerald-400">أهلاً بك في إتقان</h1>
                      <p className="text-sm text-slate-300">تعلّم البرمجة وتطوير الويب بالإتقان الكامل.</p>
                      <button className="px-4 py-2 bg-[#4F63F6] text-white text-xs font-bold rounded-lg shadow">
                        ابدأ التعلم
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#14243A] text-xs text-[#94A3B8] flex items-center justify-between">
                    <span>حالة المعاينة: محدّثة تلقائياً</span>
                    <span className="font-semibold text-emerald-400">✓ بدون أخطاء</span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Dashboard Tab Preview */}
            {activeTab === 'dashboard' && (
              <div className="w-full space-y-6 text-right">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#0B1728] p-5 rounded-xl border border-[#14243A]">
                    <div className="text-xs text-[#94A3B8] mb-1">المسارات النشطة</div>
                    <div className="text-2xl font-bold text-[#4F63F6] dark:text-[#6577FF]">2 مسار</div>
                  </div>
                  <div className="bg-[#0B1728] p-5 rounded-xl border border-[#14243A]">
                    <div className="text-xs text-[#94A3B8] mb-1">الدروس المكتملة</div>
                    <div className="text-2xl font-bold text-emerald-400">24 درس</div>
                  </div>
                  <div className="bg-[#0B1728] p-5 rounded-xl border border-[#14243A]">
                    <div className="text-xs text-[#94A3B8] mb-1">معدل الإتقان العام</div>
                    <div className="text-2xl font-bold text-[#F4B740]">96%</div>
                  </div>
                </div>

                <div className="bg-[#0B1728] p-6 rounded-xl border border-[#14243A]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-sm text-[#F8FAFC]">مسار HTML & CSS</span>
                    <span className="text-xs font-semibold text-[#4F63F6] dark:text-[#6577FF]">85% مكتمل</span>
                  </div>
                  <div className="w-full h-3 bg-[#101E31] rounded-full overflow-hidden p-0.5 border border-white/5">
                    <div className="h-full bg-gradient-to-r from-[#4F63F6] to-[#39C6D8] rounded-full w-[85%]" />
                  </div>
                </div>
              </div>
            )}

            {/* 3. Quiz Tab Preview */}
            {activeTab === 'quiz' && (
              <div className="w-full max-w-xl mx-auto bg-[#0B1728] p-6 sm:p-7 rounded-xl border border-[#14243A] text-right space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-xs font-bold text-[#F4B740] bg-[#F4B740]/10 px-3 py-1 rounded-md border border-[#F4B740]/20">
                    سؤال إتقان #4
                  </span>
                  <span className="text-xs text-[#94A3B8]">اختبار درس: المحددات في CSS</span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-[#F8FAFC]">
                  ما الخصيصة المستخدمة لجعل العنصر يعرض كشبكة مرنة responsive flexbox؟
                </h4>
                <div className="space-y-2.5">
                  <div className="p-3.5 rounded-lg bg-[#101E31] border border-emerald-500/40 text-xs sm:text-sm text-emerald-300 font-semibold flex items-center justify-between">
                    <span>display: flex;</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  </div>
                  <div className="p-3.5 rounded-lg bg-[#101E31] border border-white/5 text-xs sm:text-sm text-[#CBD5E1]">
                    <span>display: block;</span>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[#101E31] border border-white/5 text-xs sm:text-sm text-[#CBD5E1]">
                    <span>display: inline;</span>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Certificate Tab Preview */}
            {activeTab === 'certificate' && (
              <div className="w-full max-w-lg mx-auto bg-gradient-to-br from-[#0B1728] via-[#101E31] to-[#14243A] p-8 rounded-2xl border border-[#F4B740]/30 text-center space-y-4 shadow-2xl relative">
                <div className="w-16 h-16 rounded-full bg-[#F4B740]/20 text-[#F4B740] flex items-center justify-center mx-auto border border-[#F4B740]/40">
                  <Award className="w-8 h-8" />
                </div>
                <div className="text-xs font-bold text-[#F4B740] uppercase tracking-widest">شهادة إتقان الموثقة</div>
                <h3 className="text-xl font-extrabold text-[#F8FAFC]">شهادة إتمام مسار تطوير الويب</h3>
                <p className="text-xs text-[#CBD5E1] leading-relaxed">
                  تمنح هذه الشهادة للطالب لإتمامه جميع الدروس والمشاريع والاختبارات التفاعلية بنجاح وبنسبة إتقان 98%.
                </p>
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-[#94A3B8]">
                  <span>معرّف الشهادة: ITQ-2026-8849</span>
                  <span className="text-emerald-400 font-semibold">✓ شهادة رسمية قابلة للتحقق</span>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};

