import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import { onboardingService } from '@/services/onboardingService';
import { Sparkles, ArrowLeft, ArrowRight, CheckCircle2, BookOpen, Code, Play, Target } from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [experience, setExperience] = useState<'none' | 'basic' | 'intermediate'>('none');
  const [goal, setGoal] = useState('حسابات ومواقع الويب');

  const handleComplete = async (takePlacement: boolean) => {
    if (profile?.id) {
      await onboardingService.saveOnboarding({
        userId: profile.id,
        isCompleted: true,
        priorExperience: experience,
        selectedGoal: goal,
        placementStatus: takePlacement ? 'pending' : 'skipped',
      });
    }

    if (takePlacement) {
      navigate('/app/placement');
    } else {
      navigate('/app/roadmap');
    }
  };

  return (
    <div className="min-h-screen bg-bg text-txt-primary flex flex-col justify-between p-4 md:p-8">
      <div className="max-w-2xl mx-auto w-full my-auto bg-surface border border-bdr rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="space-y-6 text-center animate-fade-in">
            <div className="w-20 h-20 bg-brand-primary/10 text-brand-primary rounded-3xl flex items-center justify-center mx-auto shadow-inner">
              <Sparkles className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-extrabold text-txt-primary">
                أهلاً بك يا {profile?.full_name || 'بطل البرمجة'} في نواة كود! 🚀
              </h1>
              <p className="text-xs text-txt-muted leading-relaxed max-w-md mx-auto">
                مساحتك البرمجية الشخصية الممتعة لتعلّم بناء مواقع الويب الحقيقية باللغة العربية خطوة بخطوة.
              </p>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3.5 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>كيف تعمل المنصة؟</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: How It Works */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-bdr pb-4 text-right">
              <h2 className="text-xl font-bold text-txt-primary">كيف تعمل منصة نواة كود؟</h2>
              <p className="text-xs text-txt-muted">خطوات بسيطة ومضمونة للوصول للإتقان</p>
            </div>

            <div className="space-y-3">
              {[
                { icon: BookOpen, title: '1. اقرأ الشرح المبسط', desc: 'شرح تفاعلي مدعوم بتشابهات واقعية وأمثلة واضحة.' },
                { icon: Code, title: '2. جرّب الكود بنفسك', desc: 'محرر أكواد حقيقي مدمج لتجربة النتيجة المباشرة.' },
                { icon: CheckCircle2, title: '3. اجتز بوابة الإتقان', desc: 'أسئلة فهم سريعة بنسبة 100% لفتح الدرس التالي.' },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-2xl bg-surface-secondary border border-bdr flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-txt-primary">{item.title}</h4>
                    <p className="text-[11px] text-txt-muted">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-3 bg-surface-secondary border border-bdr text-txt-secondary text-xs font-bold rounded-xl"
              >
                السابق
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3 bg-brand-primary text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2"
              >
                <span>متابعة الاختيارات</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Prior Experience */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in text-right">
            <div className="border-b border-bdr pb-4">
              <h2 className="text-xl font-bold text-txt-primary">هل مارست البرمجة من قبل؟</h2>
              <p className="text-xs text-txt-muted">نحدد معاً أفضل نقطة انطلاق لرحلتك</p>
            </div>

            <div className="space-y-3">
              {[
                { id: 'none', label: 'لم أتعلم البرمجة من قبل (مبتدئ تماماً)', desc: 'سنبدأ من خطوة الصفر المطلق وبشرح مبسط جداً.' },
                { id: 'basic', label: 'أعرف مفاهيم بسيطة جداً', desc: 'سمعت عن HTML و CSS وأرغب في بناء أساس قوي.' },
                { id: 'intermediate', label: 'درست بعض الأكواد سابقاً', desc: 'أرغب في تحدي إتقاني والدخول في المفاهيم المتقدمة.' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setExperience(opt.id as any)}
                  className={`w-full p-4 rounded-2xl border text-right transition-all ${
                    experience === opt.id
                      ? 'border-brand-primary bg-brand-primary/10 ring-2 ring-brand-primary/30'
                      : 'border-bdr bg-surface-secondary hover:border-bdr-strong'
                  }`}
                >
                  <h4 className="font-bold text-xs text-txt-primary mb-1">{opt.label}</h4>
                  <p className="text-[11px] text-txt-muted">{opt.desc}</p>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-3 bg-surface-secondary border border-bdr text-txt-secondary text-xs font-bold rounded-xl"
              >
                السابق
              </button>
              <button
                onClick={() => handleComplete(experience !== 'none')}
                className="flex-1 py-3 bg-brand-primary text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2"
              >
                <span>{experience !== 'none' ? 'بدء التقييم التكيفي' : 'الانتقال لخريطة التعلم مباشرة'}</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
