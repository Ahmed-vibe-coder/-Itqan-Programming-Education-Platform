import React from 'react';
import { KeyRound, PlayCircle, Award, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      icon: KeyRound,
      title: 'انشئ حسابك وسجل دخولك',
      description: 'استخدم كود الدعوة أو سجل حسابًا جديدًا للانضمام المباشر إلى المنصة.',
      color: 'text-orange-500',
      bg: 'bg-orange-500/10 border-orange-500/20',
    },
    {
      step: '02',
      icon: PlayCircle,
      title: 'اختر مسارك وابدأ التعلم',
      description: 'تابع الدروس التفاعلية السينمائية، اكتب الكود بنفسك، واجتز الاختبارات التطبيقية.',
      color: 'text-amber-500',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      step: '03',
      icon: Award,
      title: 'طبّق واجتز الاختبارات ونل شهادتك',
      description: 'نفّذ المشاريع العملية، احصل على التقييم المباشر، ونل شهادة الإتقان الموثقة.',
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-bg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-orange-500 bg-orange-500/10 px-3.5 py-1.5 rounded-full inline-block mb-3 border border-orange-500/20">
            رحلة المتعلم
          </span>
          <h2 className="text-3xl lg:text-4xl font-black text-txt-primary mb-4 tracking-tight leading-snug">
            كيف تبدأ التعلم في إتقان؟
          </h2>
          <p className="text-base sm:text-lg text-txt-secondary leading-[1.8]">
            ثلاث خطوات بسيطة تفصلك عن الانطلاق في رحلة تعلّم تفاعلية وحقيقية
          </p>
        </div>

        {/* Timeline Desktop Container */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* Connected Line on Desktop */}
          <div className="hidden md:block absolute top-1/2 left-16 right-16 h-0.5 bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 -translate-y-8 z-0 opacity-30" />

          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative z-10 bg-card border border-bdr p-8 rounded-itqan-card flex flex-col justify-between hover:border-orange-500/40 transition-all duration-200 shadow-sm hover:shadow-itqan-soft group text-right"
              >
                <div>
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl ${item.bg} ${item.color} border flex items-center justify-center font-bold text-xl shrink-0 group-hover:scale-105 transition-transform`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-3xl font-black font-mono text-txt-muted/30 group-hover:text-orange-500/40 transition-colors">
                      {item.step}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-extrabold text-txt-primary mb-3 group-hover:text-orange-500 transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-sm text-txt-secondary leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-bdr text-xs font-black text-orange-500 flex items-center gap-1.5">
                  <span>الخطوة {idx + 1}</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}

        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <Link to="/register">
            <Button variant="primary" size="lg" leftIcon={<KeyRound className="w-5 h-5" />} rightIcon={<ArrowLeft className="w-5 h-5" />}>
              ابدأ رحلة الإتقان الآن
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
};
