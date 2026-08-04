import React, { useState } from 'react';
import { Terminal, LayoutDashboard, CheckSquare, Award, Play, CheckCircle2, FileCode2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const PlatformPreviewSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'editor' | 'dashboard' | 'quiz' | 'certificate'>('editor');

  const tabs = [
    { id: 'editor', label: 'محرر الأكواد المباشر', icon: Terminal },
    { id: 'dashboard', label: 'لوحة التحكم والتقدم', icon: LayoutDashboard },
    { id: 'quiz', label: 'بوابة الاختبارات والتحديات', icon: CheckSquare },
    { id: 'certificate', label: 'شهادات الإنجاز الموثقة', icon: Award },
  ] as const;

  return (
    <section id="preview" className="py-20 lg:py-28 bg-surface-secondary/50 border-y border-bdr">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-orange-500 bg-orange-500/10 px-3.5 py-1.5 rounded-full inline-block mb-3 border border-orange-500/20">
            تجربة المستخدم
          </span>
          <h2 className="text-3xl lg:text-4xl font-black text-txt-primary mb-4 tracking-tight leading-snug">
            بيئة تفاعلية صُممت بأعلى المعايير
          </h2>
          <p className="text-base sm:text-lg text-txt-secondary leading-[1.8]">
            استكشف واجهة المنصة، محرر الأكواد، وأنظمة التقييم التفاعلية مباشرة قبل البدء
          </p>
        </div>

        {/* Tab Buttons Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <Button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                variant={isActive ? 'primary' : 'secondary'}
                size="md"
                leftIcon={<Icon className="w-4 h-4" />}
              >
                {tab.label}
              </Button>
            );
          })}
        </div>

        {/* Interactive Mockup Display Window */}
        <div className="max-w-5xl mx-auto bg-card border border-bdr rounded-itqan-card shadow-itqan-soft overflow-hidden transition-all text-right">
          
          {/* Window Header Bar */}
          <div className="px-5 py-3.5 bg-surface border-b border-bdr flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <div className="text-xs font-mono text-txt-muted bg-surface-secondary px-4 py-1 rounded-md border border-bdr-soft flex items-center gap-2">
              <FileCode2 className="w-3.5 h-3.5 text-orange-500" />
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
                <div className="bg-slate-950 p-5 rounded-xl border border-bdr font-mono text-xs sm:text-sm text-left dir-ltr space-y-2 text-slate-100">
                  <div className="text-slate-500 font-sans text-right dir-rtl text-xs mb-2 pb-2 border-b border-white/10">
                    📄 index.html — محرر HTML المباشر
                  </div>
                  <div><span className="text-purple-400">&lt;div</span> <span className="text-yellow-300">class</span>=<span className="text-emerald-300">"hero-card"</span><span className="text-purple-400">&gt;</span></div>
                  <div className="pl-4"><span className="text-purple-400">&lt;h1</span> <span className="text-yellow-300">class</span>=<span className="text-emerald-300">"title"</span><span className="text-purple-400">&gt;</span>أهلاً بك في إتقان<span className="text-purple-400">&lt;/h1&gt;</span></div>
                  <div className="pl-4"><span className="text-purple-400">&lt;p&gt;</span>تعلّم البرمجة وتطوير الويب بالإتقان الكامل.<span className="text-purple-400">&lt;/p&gt;</span></div>
                  <div className="pl-4"><span className="text-purple-400">&lt;button</span> <span className="text-yellow-300">onclick</span>=<span className="text-emerald-300">"start()"</span><span className="text-purple-400">&gt;</span>ابدأ التعلم<span className="text-purple-400">&lt;/button&gt;</span></div>
                  <div><span className="text-purple-400">&lt;/div&gt;</span></div>
                </div>

                {/* Live Output Panel */}
                <div className="bg-surface-secondary text-txt-primary p-6 rounded-xl border border-bdr flex flex-col justify-between shadow-inner">
                  <div>
                    <div className="text-xs font-bold text-txt-muted uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Play className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
                      <span>المعاينة المباشرة (Live Output)</span>
                    </div>
                    <div className="p-5 rounded-xl bg-card text-txt-primary space-y-3 border border-bdr">
                      <h1 className="text-2xl font-bold text-orange-500">أهلاً بك في إتقان</h1>
                      <p className="text-sm text-txt-secondary">تعلّم البرمجة وتطوير الويب بالإتقان الكامل.</p>
                      <Button variant="primary" size="sm">
                        ابدأ التعلم
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-bdr text-xs text-txt-muted flex items-center justify-between">
                    <span>حالة المعاينة: محدّثة تلقائياً</span>
                    <span className="font-bold text-emerald-500">✓ بدون أخطاء</span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Dashboard Tab Preview */}
            {activeTab === 'dashboard' && (
              <div className="w-full space-y-6 text-right">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-surface p-5 rounded-xl border border-bdr">
                    <div className="text-xs text-txt-muted mb-1 font-bold">المسارات النشطة</div>
                    <div className="text-2xl font-black text-orange-500 font-mono">2 مسار</div>
                  </div>
                  <div className="bg-surface p-5 rounded-xl border border-bdr">
                    <div className="text-xs text-txt-muted mb-1 font-bold">الدروس المكتملة</div>
                    <div className="text-2xl font-black text-emerald-500 font-mono">24 درس</div>
                  </div>
                  <div className="bg-surface p-5 rounded-xl border border-bdr">
                    <div className="text-xs text-txt-muted mb-1 font-bold">معدل الإتقان العام</div>
                    <div className="text-2xl font-black text-amber-500 font-mono">96%</div>
                  </div>
                </div>

                <div className="bg-surface p-6 rounded-xl border border-bdr">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-extrabold text-sm text-txt-primary">مسار HTML & CSS</span>
                    <span className="text-xs font-mono font-bold text-orange-500">85% مكتمل</span>
                  </div>
                  <div className="w-full h-3 bg-surface-secondary rounded-full overflow-hidden p-0.5 border border-bdr-soft">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full w-[85%]" />
                  </div>
                </div>
              </div>
            )}

            {/* 3. Quiz Tab Preview */}
            {activeTab === 'quiz' && (
              <div className="w-full max-w-xl mx-auto bg-surface p-6 sm:p-7 rounded-xl border border-bdr text-right space-y-5 shadow-sm">
                <div className="flex items-center justify-between border-b border-bdr pb-4">
                  <span className="text-xs font-black text-amber-500 bg-amber-500/10 px-3 py-1 rounded-md border border-amber-500/20">
                    سؤال إتقان #4
                  </span>
                  <span className="text-xs text-txt-muted font-bold">اختبار درس: المحددات في CSS</span>
                </div>
                <h4 className="text-base sm:text-lg font-black text-txt-primary">
                  ما الخصيصة المستخدمة لجعل العنصر يعرض كشبكة مرنة responsive flexbox؟
                </h4>
                <div className="space-y-2.5">
                  <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/40 text-xs sm:text-sm text-emerald-500 font-bold flex items-center justify-between font-mono">
                    <span>display: flex;</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  </div>
                  <div className="p-3.5 rounded-lg bg-surface-secondary border border-bdr text-xs sm:text-sm text-txt-secondary font-mono">
                    <span>display: block;</span>
                  </div>
                  <div className="p-3.5 rounded-lg bg-surface-secondary border border-bdr text-xs sm:text-sm text-txt-secondary font-mono">
                    <span>display: inline;</span>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Certificate Tab Preview */}
            {activeTab === 'certificate' && (
              <div className="w-full max-w-lg mx-auto bg-gradient-to-br from-surface via-card to-surface-secondary p-8 rounded-itqan-card border border-amber-500/30 text-center space-y-4 shadow-xl relative">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto border border-amber-500/30">
                  <Award className="w-8 h-8" />
                </div>
                <div className="text-xs font-black text-amber-500 uppercase tracking-widest">شهادة إتقان الموثقة</div>
                <h3 className="text-xl font-black text-txt-primary">شهادة إتمام مسار تطوير الويب</h3>
                <p className="text-xs text-txt-secondary leading-relaxed">
                  تمنح هذه الشهادة للطالب لإتمامه جميع الدروس والمشاريع والاختبارات التفاعلية بنجاح وبنسبة إتقان 98%.
                </p>
                <div className="pt-4 border-t border-bdr flex items-center justify-between text-[11px] text-txt-muted font-mono">
                  <span>معرّف الشهادة: ITQ-2026-8849</span>
                  <span className="text-emerald-500 font-bold">✓ شهادة رسمية قابلة للتحقق</span>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
