import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/shared/Logo';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import {
  Code,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Trophy,
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  Terminal,
  Layers,
  HelpCircle,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg text-txt-primary flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-bdr">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <Logo size="md" showTagline />

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold text-txt-secondary hover:text-txt-primary transition-colors"
            >
              تسجيل الدخول
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-semibold text-white bg-brand-primary hover:bg-brand-primary-hover active:bg-brand-primary-active rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <KeyRound className="w-4 h-4" />
              <span>رمز الدعوة</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-brand-primary/5 via-bg to-bg">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>الأكاديمية العربية المتخصصة لتعليم البرمجة من سن 10 إلى 15 سنة</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-txt-primary mb-6 tracking-tight">
            تعلّم البرمجة بعمق، <br />
            <span className="text-brand-primary">وطبّق كل كود بإتقان.</span>
          </h1>

          <p className="text-base md:text-lg text-txt-secondary max-w-2xl mx-auto leading-relaxed mb-8">
            شروحات عربية متميزة، محرر أكواد مباشر، وأسئلة إتقان تتأكد أنك فهمت قبل الانتقال للخطوة التالية تحت إشراف معلمك.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-6 py-3.5 text-base font-bold text-white bg-brand-primary hover:bg-brand-primary-hover active:bg-brand-primary-active rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>ابدأ باستخدام كود الدعوة</span>
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-6 py-3.5 text-base font-semibold text-txt-primary bg-surface border border-bdr hover:border-bdr-strong rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <span>تسجيل الدخول للحساب</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Course Paths */}
      <section className="py-16 px-4 max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-txt-primary mb-3">مسارات التعلم الأساسية</h2>
          <p className="text-sm text-txt-muted">مناهج متدرجة مصممة خصيصاً للطلاب الناشئين</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* HTML Card */}
          <div className="bg-surface border border-bdr hover:border-orange-500/50 rounded-2xl p-6 transition-all shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-mono font-bold text-lg mb-4">
                &lt;/&gt;
              </div>
              <span className="text-xs font-bold text-orange-500 bg-orange-500/10 px-2.5 py-1 rounded-md inline-block mb-2">
                HTML5
              </span>
              <h3 className="text-xl font-bold text-txt-primary mb-2">HTML من الصفر</h3>
              <p className="text-sm text-txt-muted leading-relaxed">
                بناء هيكل مواقع الويب والعناوين والفقرات والروابط والجداول والسيمنتك HTML.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-bdr flex items-center justify-between text-xs text-txt-secondary">
              <span>12 درساً تفاعلياً</span>
              <span className="font-semibold text-orange-500">مستوى مبتدئ</span>
            </div>
          </div>

          {/* CSS Card */}
          <div className="bg-surface border border-bdr hover:border-blue-500/50 rounded-2xl p-6 transition-all shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-mono font-bold text-lg mb-4">
                #{}
              </div>
              <span className="text-xs font-bold text-blue-500 bg-blue-500/10 px-2.5 py-1 rounded-md inline-block mb-2">
                CSS3
              </span>
              <h3 className="text-xl font-bold text-txt-primary mb-2">CSS من الصفر</h3>
              <p className="text-sm text-txt-muted leading-relaxed">
                تزيين وتنسيق وتلوين العناصر، والتحكم بالخلفيات، والمحددات، ونظام Flexbox و Grid.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-bdr flex items-center justify-between text-xs text-txt-secondary">
              <span>16 درساً تفاعلياً</span>
              <span className="font-semibold text-blue-500">مستوى متوسط</span>
            </div>
          </div>

          {/* JS Card */}
          <div className="bg-surface border border-bdr hover:border-yellow-500/50 rounded-2xl p-6 transition-all shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 text-amber-500 flex items-center justify-center font-mono font-bold text-lg mb-4">
                JS
              </div>
              <span className="text-xs font-bold text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-md inline-block mb-2">
                JavaScript
              </span>
              <h3 className="text-xl font-bold text-txt-primary mb-2">JavaScript من الصفر</h3>
              <p className="text-sm text-txt-muted leading-relaxed">
                تحريك المواقع، المتغيرات، الدوال، الشروط، الحلقات، والتعامل مع عناصر الـ DOM.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-bdr flex items-center justify-between text-xs text-txt-secondary">
              <span>18 درساً تفاعلياً</span>
              <span className="font-semibold text-amber-500">مستوى متقدم</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-surface-secondary border-y border-bdr">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-txt-primary mb-3">كيف تتعلم في نواة كود؟</h2>
            <p className="text-sm text-txt-muted">طريقة متكاملة تضمن الفهم الحقيقي والتطبيق المستمر</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-surface p-6 rounded-2xl border border-bdr text-center">
              <div className="w-10 h-10 bg-brand-primary/10 text-brand-primary font-bold rounded-xl flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="font-bold text-txt-primary mb-2">افهم المفهوم</h3>
              <p className="text-xs text-txt-muted leading-relaxed">
                شرح عربي مبسط ومدعوم بتشبيهات واقعية تقرب لك الفكرة البرمجية.
              </p>
            </div>

            <div className="bg-surface p-6 rounded-2xl border border-bdr text-center">
              <div className="w-10 h-10 bg-brand-secondary/10 text-brand-secondary font-bold rounded-xl flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="font-bold text-txt-primary mb-2">جرّب بنفسك</h3>
              <p className="text-xs text-txt-muted leading-relaxed">
                محرر أكواد معزول ومباشر بجانب الشرح لتكتب الكود وتطّلع على النتيجة فوراً.
              </p>
            </div>

            <div className="bg-surface p-6 rounded-2xl border border-bdr text-center">
              <div className="w-10 h-10 bg-amber-500/10 text-amber-500 font-bold rounded-xl flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="font-bold text-txt-primary mb-2">بوابة الإتقان</h3>
              <p className="text-xs text-txt-muted leading-relaxed">
                أسئلة فهم سريعة تتأكد من استيعابك كاملاً قبل إلغاء القفل عن الدرس التالي.
              </p>
            </div>

            <div className="bg-surface p-6 rounded-2xl border border-bdr text-center">
              <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 font-bold rounded-xl flex items-center justify-center mx-auto mb-4">
                4
              </div>
              <h3 className="font-bold text-txt-primary mb-2">تابِع تقدمك</h3>
              <p className="text-xs text-txt-muted leading-relaxed">
                امتحانات دورية، تقارير أداء، نقاط تحفيزية، وإشراف مباشر من معلمك.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 max-w-4xl mx-auto w-full">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-txt-primary mb-2 flex items-center justify-center gap-2">
            <HelpCircle className="w-6 h-6 text-brand-primary" />
            <span>الأسئلة الشائعة</span>
          </h2>
        </div>

        <div className="space-y-4">
          <div className="bg-surface border border-bdr rounded-xl p-5">
            <h3 className="font-bold text-txt-primary text-sm mb-1.5">كيف يمكنني الانضمام للمنصة؟</h3>
            <p className="text-xs text-txt-muted leading-relaxed">
              منصة إتقان هي أكاديمية خاصة، يتم الانضمام إليها من خلال كود الدعوة الخاص الذي يزودك به معلم البرمجة المشرف.
            </p>
          </div>

          <div className="bg-surface border border-bdr rounded-xl p-5">
            <h3 className="font-bold text-txt-primary text-sm mb-1.5">هل يلزمني تثبيت أية برامج في جهازي؟</h3>
            <p className="text-xs text-txt-muted leading-relaxed">
              لا! كل ما تحتاجه هو متصفح الإنترنت. تحتوي المنصة على محرر أكواد تفاعلي ومتكامل ويعمل مباشرة من متصفحك.
            </p>
          </div>

          <div className="bg-surface border border-bdr rounded-xl p-5">
            <h3 className="font-bold text-txt-primary text-sm mb-1.5">ما هي اللغات البرمجية المتوفرة؟</h3>
            <p className="text-xs text-txt-muted leading-relaxed">
              نركز في المنصة على الثلاثي الأساسي لبناء وتطوير الويب: HTML لبناء الهيكل، CSS للتنسيقات والألوان، و JavaScript للبرمجة والتفاعل.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-bdr bg-surface py-8 px-4 text-center text-xs text-txt-muted">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="sm" showTagline />
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:underline">سياسة الخصوصية</Link>
            <Link to="/terms" className="hover:underline">الشروط والأحكام</Link>
            <Link to="/help" className="hover:underline">المساعدة والدعم</Link>
          </div>
          <span>&copy; {new Date().getFullYear()} إتقان — تعلّم بعمق. طبّق بإتقان.</span>
        </div>
      </footer>
    </div>
  );
};
