import React, { useState } from 'react';
import {
  Gamepad2,
  Trophy,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Zap,
  Flame,
  ArrowRight,
  Code2,
  Clock,
  Layers
} from 'lucide-react';

interface GameItem {
  id: string;
  title: string;
  category: string;
  description: string;
  mode: 'matching' | 'word_bank' | 'arrange_code' | 'speed_round';
}

export const MicroLearningGamesPage: React.FC = () => {
  const [activeGame, setActiveGame] = useState<GameItem | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Matching game state
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const matchingPairs = [
    { tag: '<a>', purpose: 'إنشاء رابط تشعبي' },
    { tag: '<img>', purpose: 'إدراج صورة' },
    { tag: '<p>', purpose: 'فقرة نصية' },
    { tag: '<h1>', purpose: 'عنوان رئيسي كبير' },
  ];

  const games: GameItem[] = [
    { id: 'g1', title: 'لعبة مطابقة الوسوم بوظائفها', category: 'HTML', description: 'وصل الوسم بالمعنى البرمجي المناسب له في أقل وقت.', mode: 'matching' },
    { id: 'g2', title: 'تحدي ترتيب أسطر الهيكل', category: 'HTML', description: 'رتب أسطر المستند من doctype حتى وسم body.', mode: 'arrange_code' },
    { id: 'g3', title: 'بنك الكلمات البرمجية', category: 'CSS', description: 'أكمل فراغات شفرة CSS بالكلمة المناسبة.', mode: 'word_bank' },
    { id: 'g4', title: 'الجولة السريعة (Speed Round)', category: 'مزيج', description: 'أجب عن أكبر عدد من الأسئلة في 60 ثانية.', mode: 'speed_round' },
  ];

  const handleMatchSelect = (item: string, isTag: boolean) => {
    if (isTag) {
      setSelectedTag(item);
    } else if (selectedTag) {
      const match = matchingPairs.find(p => p.tag === selectedTag);
      if (match && match.purpose === item) {
        setMatchedPairs([...matchedPairs, selectedTag]);
        setScore(prev => prev + 25);
        setSelectedTag(null);
        if (matchedPairs.length + 1 === matchingPairs.length) {
          setCompleted(true);
        }
      } else {
        setSelectedTag(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface border border-bdr p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-brand-primary" />
            <h1 className="text-xl font-extrabold text-txt-primary">ألعاب التدرّب السريع (Micro-learning Games)</h1>
          </div>
          <p className="text-xs text-txt-muted mt-1">
            ألعاب ممتعة وتفاعلية بأسلوب التحدي (Duolingo-like) لتثبيت المفاهيم والوسوم البرمجية كسب الـ XP.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold font-mono">
            <Zap className="w-4 h-4 fill-amber-500" />
            <span>نقاط اللعب: {score} XP</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      {!activeGame ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {games.map((g) => (
            <div
              key={g.id}
              onClick={() => {
                setActiveGame(g);
                setScore(0);
                setCompleted(false);
                setMatchedPairs([]);
              }}
              className="bg-surface border border-bdr p-5 rounded-2xl shadow-sm space-y-3 cursor-pointer hover:border-brand-primary transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-brand-primary/10 text-brand-primary text-[11px] font-bold">
                  {g.category}
                </span>
                <Sparkles className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xs font-extrabold text-txt-primary">{g.title}</h3>
              <p className="text-[11px] text-txt-muted line-clamp-2">{g.description}</p>
              <button className="w-full py-2 bg-surface-secondary border border-bdr text-brand-primary group-hover:bg-brand-primary group-hover:text-white rounded-xl text-xs font-bold transition-all">
                ابدأ اللعب الآن
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* Active Game Sandbox Container */
        <div className="bg-surface border border-bdr rounded-2xl p-6 max-w-xl mx-auto space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-bdr pb-3">
            <button
              onClick={() => setActiveGame(null)}
              className="text-xs text-txt-muted hover:text-txt-primary flex items-center gap-1 font-bold"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة للألعاب</span>
            </button>
            <span className="font-bold text-xs text-txt-primary">{activeGame.title}</span>
          </div>

          {completed ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                <Trophy className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-extrabold text-txt-primary">أحسنت يا بطل! تم إنجاز التحدي!</h2>
              <p className="text-xs text-txt-muted">حصلت على +100 XP بنجاح ووثقت إتقانك لهذه المفاهيم.</p>
              <button
                onClick={() => {
                  setCompleted(false);
                  setMatchedPairs([]);
                  setScore(0);
                }}
                className="px-6 py-2.5 bg-brand-primary text-white text-xs font-bold rounded-xl shadow-md"
              >
                لعب مرة أخرى
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-xs font-bold text-txt-secondary text-center">اضغط على الوسم، ثم اضغط على الوظيفة البرمجية المناسبة له:</p>

              <div className="grid grid-cols-2 gap-4 text-xs">
                {/* Left: Tags */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-txt-muted block text-center">الوسم البرمجي</span>
                  {matchingPairs.map((pair) => {
                    const isMatched = matchedPairs.includes(pair.tag);
                    const isSelected = selectedTag === pair.tag;
                    return (
                      <button
                        key={pair.tag}
                        disabled={isMatched}
                        onClick={() => handleMatchSelect(pair.tag, true)}
                        dir="ltr"
                        className={`w-full p-3 rounded-xl border text-center font-mono font-bold transition-all min-h-[44px] ${
                          isMatched
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                            : isSelected
                            ? 'bg-brand-primary text-white border-brand-primary scale-105 shadow-md'
                            : 'bg-surface-secondary border-bdr text-txt-primary hover:border-brand-primary'
                        }`}
                      >
                        {pair.tag}
                      </button>
                    );
                  })}
                </div>

                {/* Right: Purposes */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-txt-muted block text-center">الوظيفة البرمجية</span>
                  {matchingPairs.map((pair) => {
                    const isMatched = matchedPairs.includes(pair.tag);
                    return (
                      <button
                        key={pair.purpose}
                        disabled={isMatched}
                        onClick={() => handleMatchSelect(pair.purpose, false)}
                        className={`w-full p-3 rounded-xl border text-center font-bold text-xs transition-all min-h-[44px] ${
                          isMatched
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                            : 'bg-surface-secondary border-bdr text-txt-primary hover:border-brand-primary'
                        }`}
                      >
                        {pair.purpose}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
