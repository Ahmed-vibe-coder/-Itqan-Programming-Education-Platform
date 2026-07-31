import React, { useState } from 'react';
import {
  Bot,
  Settings,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  DollarSign,
  Layers,
  FileCheck,
  Save,
  Activity,
  KeyRound
} from 'lucide-react';

export const AIAdminCenterPage: React.FC = () => {
  const [aiEnabled, setAiEnabled] = useState(true);
  const [provider, setProvider] = useState('google_gemini');
  const [model, setModel] = useState('gemini-2.5-flash');
  const [dailyLimit, setDailyLimit] = useState(100);
  const [monthlyLimit, setMonthlyLimit] = useState(2500);

  const [approvedExplanations, setApprovedExplanations] = useState([
    {
      id: 'exp-1',
      concept: 'HTML Anchor Tag href',
      explanation: 'الخاصية href تعني Hypertext Reference وتُستخدم لتحديد رابط الصفحة أو الملف المستهدف.',
      approved: true
    },
    {
      id: 'exp-2',
      concept: 'CSS Box Model',
      explanation: 'نموذج الصندوق بيتكون من المحتوى (Content) ثم الحواف الداخلية (Padding) ثم الإطار (Border) ثم الهامش (Margin).',
      approved: true
    }
  ]);

  const [newConcept, setNewConcept] = useState('');
  const [newExplanation, setNewExplanation] = useState('');

  const handleAddApprovedExplanation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConcept || !newExplanation) return;
    setApprovedExplanations([
      { id: `exp-${Date.now()}`, concept: newConcept, explanation: newExplanation, approved: true },
      ...approvedExplanations
    ]);
    setNewConcept('');
    setNewExplanation('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface border border-bdr p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-brand-primary" />
            <h1 className="text-xl font-extrabold text-txt-primary">مركز إدارة الذكاء الاصطناعي (AI Admin Center)</h1>
          </div>
          <p className="text-xs text-txt-muted mt-1">
            إدارة إعدادات الذكاء الاصطناعي، وحدود التكلفة، ومكتبة الشروحات المعتمدة، وسجلات الاستخدام.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm">
            <Save className="w-4 h-4" />
            <span>حفظ الإعدادات</span>
          </button>
        </div>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Panel */}
        <div className="bg-surface border border-bdr rounded-2xl p-6 space-y-4 shadow-sm">
          <h2 className="text-sm font-bold text-txt-primary border-b border-bdr pb-2 flex items-center gap-2">
            <Settings className="w-4 h-4 text-brand-primary" />
            <span>إعدادات النظام والتكلفة</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl border border-bdr bg-surface-secondary">
              <span className="font-bold text-txt-primary">تفعيل الذكاء الاصطناعي عامة</span>
              <input
                type="checkbox"
                checked={aiEnabled}
                onChange={(e) => setAiEnabled(e.target.checked)}
                className="w-4 h-4 text-brand-primary rounded"
              />
            </div>

            <div>
              <label className="block font-bold text-txt-secondary mb-1">المزود (Provider)</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full bg-surface-secondary border border-bdr rounded-xl p-2 text-xs text-txt-primary"
              >
                <option value="google_gemini">Google Gemini AI</option>
                <option value="openai">OpenAI GPT</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-txt-secondary mb-1">النموذج المعتمد (Model)</label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-surface-secondary border border-bdr rounded-xl p-2 text-xs text-txt-primary font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-txt-secondary mb-1">الحد اليومي (طلبات)</label>
                <input
                  type="number"
                  value={dailyLimit}
                  onChange={(e) => setDailyLimit(Number(e.target.value))}
                  className="w-full bg-surface-secondary border border-bdr rounded-xl p-2 text-xs text-txt-primary font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-txt-secondary mb-1">الحد الشهري (طلبات)</label>
                <input
                  type="number"
                  value={monthlyLimit}
                  onChange={(e) => setMonthlyLimit(Number(e.target.value))}
                  className="w-full bg-surface-secondary border border-bdr rounded-xl p-2 text-xs text-txt-primary font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Approved Explanation Library Panel */}
        <div className="lg:col-span-2 bg-surface border border-bdr rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-bdr pb-3">
            <h2 className="font-bold text-sm text-txt-primary flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-500" />
              <span>مكتبة الشروحات المعتمدة (Approved Explanation Library)</span>
            </h2>
            <span className="text-xs font-mono font-bold text-emerald-500">توفير التكلفة %100</span>
          </div>

          {/* Add Approved Explanation Form */}
          <form onSubmit={handleAddApprovedExplanation} className="space-y-3 p-4 rounded-xl border border-bdr bg-surface-secondary">
            <span className="text-xs font-bold text-txt-primary block">إضافة شرح معتمد ومراجع يدوياً</span>
            <input
              type="text"
              required
              value={newConcept}
              onChange={(e) => setNewConcept(e.target.value)}
              placeholder="رمز المفهوم (مثال: HTML Link target attribute)"
              className="w-full bg-surface border border-bdr rounded-xl p-2 text-xs text-txt-primary"
            />
            <textarea
              rows={2}
              required
              value={newExplanation}
              onChange={(e) => setNewExplanation(e.target.value)}
              placeholder="الشرح النموذجي المعتمد للطلاب..."
              className="w-full bg-surface border border-bdr rounded-xl p-2 text-xs text-txt-primary"
            />
            <button type="submit" className="px-4 py-2 bg-emerald-500 text-white text-xs font-bold rounded-xl">
              حفظ الشرح المعتمد
            </button>
          </form>

          {/* List */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {approvedExplanations.map((item) => (
              <div key={item.id} className="p-3 rounded-xl border border-bdr bg-surface-secondary space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-brand-primary">{item.concept}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">
                    معتمد ومحفوظ
                  </span>
                </div>
                <p className="text-txt-muted">{item.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
