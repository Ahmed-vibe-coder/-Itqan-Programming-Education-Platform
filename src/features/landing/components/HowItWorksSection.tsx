import React from 'react';
import { KeyRound, PlayCircle, Award, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      icon: KeyRound,
      title: 'ادخل باستخدام كود الدعوة',
      description: 'استخدم كود الدعوة الخاص بك لإنشاء حسابك والانضمام المباشر للمنصة.',
      color: 'text-[#4F63F6] dark:text-[#6577FF]',
      bg: 'bg-[#4F63F6]/12',
    },
    {
      step: '02',
      icon: PlayCircle,
      title: 'اختر مسارك وابدأ التعلم',
      description: 'تابع الدروس التفاعلية، اكتب الكود بنفسك، واجتز أسئلة بوابة الإتقان.',
      color: 'text-[#39C6D8]',
      bg: 'bg-[#39C6D8]/12',
    },
    {
      step: '03',
      icon: Award,
      title: 'طبّق واجتز الاختبارات واحصل على شهادتك',
      description: 'نفّذ المشاريع العملية، احصل على التقييم، ونل شهادة الإتقان الموثقة.',
      color: 'text-[#F4B740]',
      bg: 'bg-[#F4B740]/12',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-[#07111F] relative">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#39C6D8] bg-[#39C6D8]/10 px-3.5 py-1.5 rounded-full inline-block mb-3 border border-[#39C6D8]/20">
            رحلة المتعلم
          </span>
          <h2 className="text-3xl lg:text-[40px] font-extrabold text-[#F8FAFC] mb-4 tracking-tight leading-snug">
            كيف تبدأ التعلم في إتقان؟
          </h2>
          <p className="text-base sm:text-lg text-[#CBD5E1] leading-[1.8]">
            ثلاث خطوات بسيطة تفصلك عن الانطلاق في رحلة برمجة حقيقية
          </p>
        </div>

        {/* Timeline Desktop Container */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* Connected Line on Desktop */}
          <div className="hidden md:block absolute top-1/2 left-16 right-16 h-0.5 bg-gradient-to-r from-[#4F63F6] via-[#39C6D8] to-[#F4B740] -translate-y-8 z-0 opacity-40" />

          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative z-10 bg-[#101E31] border border-[rgba(148,163,184,0.18)] p-8 rounded-2xl flex flex-col justify-between hover:border-[#4F63F6]/40 transition-all duration-200 shadow-lg hover:shadow-2xl group"
              >
                <div>
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center font-bold text-xl shrink-0 group-hover:scale-105 transition-transform border border-white/5`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-3xl font-extrabold font-mono text-[#94A3B8]/30 group-hover:text-[#4F63F6]/40 transition-colors">
                      {item.step}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-[#F8FAFC] mb-3 group-hover:text-[#4F63F6] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#CBD5E1] leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[rgba(148,163,184,0.18)] text-xs font-semibold text-[#4F63F6] dark:text-[#6577FF] flex items-center gap-1.5">
                  <span>الخطوة {idx + 1}</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}

        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <Link
            to="/register"
            className="inline-flex items-center gap-2.5 px-8 py-4 text-base font-bold text-white bg-[#4F63F6] hover:bg-[#6577FF] active:bg-[#3B4ED8] rounded-xl shadow-lg hover:shadow-[#4F63F6]/25 transition-all min-h-[48px]"
          >
            <KeyRound className="w-5 h-5" />
            <span>ابدأ الآن باستخدام كود الدعوة</span>
          </Link>
        </div>

      </div>
    </section>
  );
};

