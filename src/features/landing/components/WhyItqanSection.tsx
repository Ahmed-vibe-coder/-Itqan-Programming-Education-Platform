import React from 'react';
import { Layers, Terminal, CheckCircle2, TrendingUp, HelpCircle, Rocket } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export const WhyItqanSection: React.FC = () => {
  const features = [
    {
      icon: Layers,
      title: 'تعلّم بخطوات منظمة',
      description: 'دروس مقسمة لوحدات تفاعلية سهلة الفهم تضمن تدرجك بسلاسة من البداية دون تعقيد.',
      color: 'text-orange-500',
      bg: 'bg-orange-500/10 border-orange-500/20',
    },
    {
      icon: Terminal,
      title: 'طبّق الأكواد مباشرة',
      description: 'محرر أكواد ذكي متكامل يعمل بمتصفحك دون الحاجة لتثبيت أية برامج أو إعدادات.',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      icon: CheckCircle2,
      title: 'اختبر فهمك بعد كل درس',
      description: 'بوابة إتقان البرمجية تتأكد من فهمك الحقيقي واستيعابك للمفاهيم قبل الانتقال للدرس التالي.',
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      icon: TrendingUp,
      title: 'تابع تقدمك وإنجازاتك',
      description: 'تقارير أداء دقيقة، وسام تميز ونقاط تحفيز XP توثق كل خطوة في رحلتك التعليمية.',
      color: 'text-amber-500',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      icon: HelpCircle,
      title: 'احصل على شرح للأخطاء',
      description: 'توجيه ذكي وتغذية راجعة فورية تتيح لك اكتشاف أخطاء الكود وتصحيحها بسهولة.',
      color: 'text-indigo-500',
      bg: 'bg-indigo-500/10 border-indigo-500/20',
    },
    {
      icon: Rocket,
      title: 'أكمل مشاريع حقيقية',
      description: 'بناء مواقع وتطبيقات ويب كاملة يمكنك إضافتها لملف أعمالك البرمجي بثقة.',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10 border-purple-500/20',
    },
  ];

  return (
    <section id="features" className="py-20 lg:py-28 bg-surface-secondary/50 border-y border-bdr">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-orange-500 bg-orange-500/10 px-3.5 py-1.5 rounded-full inline-block mb-3 border border-orange-500/20">
            المميزات التنافسية
          </span>
          <h2 className="text-3xl lg:text-4xl font-black text-txt-primary mb-4 tracking-tight leading-snug">
            لماذا تختار منصة إتقان؟
          </h2>
          <p className="text-base sm:text-lg text-txt-secondary leading-[1.8]">
            بيئة تعلّم مصممة بعناية تجمع بين الشرح العربي المبسط والتطبيق المباشر والاختبارات الذكية
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card
                key={idx}
                variant="interactive"
                padding="lg"
                className="flex flex-col justify-between group text-right"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl ${item.bg} ${item.color} border flex items-center justify-center mb-5 transition-transform group-hover:scale-110`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-extrabold text-txt-primary mb-2.5 group-hover:text-orange-500 transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-sm text-txt-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

      </div>
    </section>
  );
};
