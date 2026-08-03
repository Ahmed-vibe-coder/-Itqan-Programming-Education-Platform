import React from 'react';
import { Layers, Terminal, CheckCircle2, TrendingUp, HelpCircle, Rocket } from 'lucide-react';

export const WhyItqanSection: React.FC = () => {
  const features = [
    {
      icon: Layers,
      title: 'تعلّم بخطوات منظمة',
      description: 'دروس مقسمة لوحدات تفاعلية سهلة الفهم تضمن تدرجك بسلاسة من البداية دون تعقيد.',
      color: 'text-[#4F63F6] dark:text-[#6577FF]',
      bg: 'bg-[#4F63F6]/12',
    },
    {
      icon: Terminal,
      title: 'طبّق الأكواد مباشرة',
      description: 'محرر أكواد ذكي متكامل يعمل بمتصفحك دون الحاجة لتثبيت أية برامج أو إعدادات.',
      color: 'text-[#39C6D8]',
      bg: 'bg-[#39C6D8]/12',
    },
    {
      icon: CheckCircle2,
      title: 'اختبر فهمك بعد كل درس',
      description: 'بوابة إتقان البرمجية تتأكد من فهمك الحقيقي واستيعابك للمفاهيم قبل الانقال للدرس التالي.',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/12',
    },
    {
      icon: TrendingUp,
      title: 'تابع تقدمك وإنجازاتك',
      description: 'تقارير أداء دقيقة، وسام تميز ونقاط تحفيز توثق كل خطوة في رحلتك البرمجية.',
      color: 'text-[#F4B740]',
      bg: 'bg-[#F4B740]/12',
    },
    {
      icon: HelpCircle,
      title: 'احصل على شرح للأخطاء',
      description: 'توجيه ذكي وتغذية راجعة فورية تتيح لك اكتشاف أخطاء الكود وتصحيحها بسهولة.',
      color: 'text-[#39C6D8]',
      bg: 'bg-[#39C6D8]/12',
    },
    {
      icon: Rocket,
      title: 'أكمل مشاريع حقيقية',
      description: 'بناء مواقع وتطبيقات ويب كاملة يمكنك إضافتها لملف أعمالك البرمجي بثقة.',
      color: 'text-purple-400',
      bg: 'bg-purple-500/12',
    },
  ];

  return (
    <section id="why-us" className="py-20 lg:py-28 bg-[#0B1728] border-y border-[#94A3B8]/15">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#4F63F6] dark:text-[#6577FF] bg-[#4F63F6]/10 px-3.5 py-1.5 rounded-full inline-block mb-3 border border-[#4F63F6]/20">
            المميزات التنافسية
          </span>
          <h2 className="text-3xl lg:text-[40px] font-extrabold text-[#F8FAFC] mb-4 tracking-tight leading-snug">
            لماذا تختار منصة إتقان؟
          </h2>
          <p className="text-base sm:text-lg text-[#CBD5E1] leading-[1.8]">
            بيئة تعلّم مصممة بعناية تجمع بين الشرح العربي المبسط والتطبيق البرمجي المباشر
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#101E31] border border-[rgba(148,163,184,0.18)] p-7 rounded-2xl transition-all duration-200 hover:border-[#4F63F6]/40 hover:shadow-xl flex flex-col justify-between group"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center mb-5 transition-transform group-hover:scale-110 border border-white/5`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#F8FAFC] mb-2.5 group-hover:text-[#4F63F6] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#94A3B8] leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

