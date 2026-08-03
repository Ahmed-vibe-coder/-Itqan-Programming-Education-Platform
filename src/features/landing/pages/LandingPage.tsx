import React, { useState } from 'react';
import { LandingHeader } from '../components/LandingHeader';
import { HeroSection } from '../components/HeroSection';
import { TrustBar } from '../components/TrustBar';
import { LearningPathsSection } from '../components/LearningPathsSection';
import { WhyItqanSection } from '../components/WhyItqanSection';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { PlatformPreviewSection } from '../components/PlatformPreviewSection';
import { FinalCTASection } from '../components/FinalCTASection';
import { LandingFooter } from '../components/LandingFooter';
import { HelpCircle, ChevronDown } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'كيف يمكنني الانضمام للتعلّم في منصة إتقان؟',
      a: 'يتم الانضمام لأكاديمية إتقان من خلال كود الدعوة الخاص الذي يزودك به معلمك أو المؤسسة التعليمية. يمكنك النقر على زر "ابدأ بكود الدعوة" وإدخال الرمز لتسجيل حسابك فوراً.',
    },
    {
      q: 'هل أحتاج لتثبيت أية برامج أو أدوات تطوير على جهازي؟',
      a: 'لا نهائياً! منصة إتقان تعتمد بالكامل على متصفح الإنترنت الخاص بك، حيث تحتوي المنصة على محرر أكواد تفاعلي مباشر يتيح لك كتابة الأكواد وتجربتها ورؤية النتائج لحظياً دون أي إعدادات معقدة.',
    },
    {
      q: 'ما هي المسارات البرمجية المتاحة حالياً بالمنصة؟',
      a: 'نُركّز في منصة إتقان على الثلاثي الأساسي لبناء وتطوير الويب: HTML لبناء الهيكل وتنظيم المحتوى، CSS للتنسيقات والألوان والتجاوب، و JavaScript لإضافة المنطق والتفاعل وتطوير التطبيقات.',
    },
    {
      q: 'كيف تضمن المنصة استيعاب وفهم الطالب للمفاهيم البرمجية؟',
      a: 'تعتمد المنصة على "بوابة إتقان"، وهي آلية تقييم وتحديات تفاعلية بعد كل درس. لا يمكن للطالب الانتقال للدرس التالي إلا بعد إتقان التطبيق العملي والإجابة على الأسئلة البرمجية بنجاح.',
    },
    {
      q: 'هل تمنح المنصة شهادات إنجاز معتمدة بعد إتمام المسار؟',
      a: 'نعم، عند إكمال جميع دروس واختبارات ومشاريع أي مسار تعليمي، يحصل الطالب على شهادة إتقان رقمية موثقة برقم معرّف خاص يمكن مشاركتها والتحقق منها.',
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#07111F] text-[#F8FAFC] font-sans antialiased flex flex-col selection:bg-[#4F63F6]/25 selection:text-[#4F63F6]">
      {/* 1. Sticky Navigation Header */}
      <LandingHeader />

      {/* Main Page Layout Container */}
      <main className="flex-1">
        {/* 2. Hero Section */}
        <HeroSection />

        {/* 3. Key Statistics & Trust Bar */}
        <TrustBar />

        {/* 4. Core Learning Paths */}
        <LearningPathsSection />

        {/* 5. Why Choose Itqan Section */}
        <WhyItqanSection />

        {/* 6. How It Works Workflow Section */}
        <HowItWorksSection />

        {/* 7. Platform Interactive Preview Section */}
        <PlatformPreviewSection />

        {/* 8. Frequently Asked Questions Section */}
        <section id="faq" className="py-20 lg:py-28 bg-[#07111F] border-b border-[#94A3B8]/15">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-widest text-[#4F63F6] dark:text-[#6577FF] bg-[#4F63F6]/10 px-3.5 py-1.5 rounded-full inline-block mb-3 border border-[#4F63F6]/20">
                الأسئلة الشائعة
              </span>
              <h2 className="text-3xl lg:text-[40px] font-extrabold text-[#F8FAFC] mb-4 tracking-tight flex items-center justify-center gap-2.5">
                <HelpCircle className="w-8 h-8 text-[#4F63F6] dark:text-[#6577FF]" />
                <span>إجابات على استفساراتك</span>
              </h2>
              <p className="text-base sm:text-lg text-[#CBD5E1]">
                كل ما تحتاج معرفته عن المنصة وكيفية الانضمام وبدء التعلم
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="bg-[#101E31] border border-[rgba(148,163,184,0.18)] hover:border-[#4F63F6]/30 rounded-2xl transition-all overflow-hidden shadow-md"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full p-5 sm:p-6 text-right font-bold text-base sm:text-lg text-[#F8FAFC] flex items-center justify-between gap-4 focus:outline-none"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-[#4F63F6] dark:text-[#6577FF] transition-transform duration-200 shrink-0 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-[#CBD5E1] leading-relaxed border-t border-[rgba(148,163,184,0.12)] bg-[#0B1728]/50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 9. Final Call-To-Action Banner */}
        <FinalCTASection />
      </main>

      {/* 10. Complete Professional Footer */}
      <LandingFooter />
    </div>
  );
};

