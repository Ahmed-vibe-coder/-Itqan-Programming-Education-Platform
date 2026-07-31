import React, { useState } from 'react';
import {
  KeyRound,
  Plus,
  Copy,
  Check,
  Share2,
  Printer,
  Trash2,
  RefreshCw,
  Clock,
  User,
  Users,
  BookOpen,
  ShieldAlert,
  Search,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from 'lucide-react';

interface Invitation {
  id: string;
  code: string;
  expectedFullName: string;
  groupName: string;
  assignedCourses: string[];
  expiresAt: string;
  status: 'active' | 'used' | 'expired' | 'revoked';
  usedByStudent?: string;
  usedAt?: string;
  createdAt: string;
}

export const TeacherInvitationsPage: React.FC = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([
    {
      id: 'inv-1',
      code: 'ITQAN-HERO-991',
      expectedFullName: 'أحمد علي حسن',
      groupName: 'مجموعة HTML الأولى',
      assignedCourses: ['أساسيات لغة HTML'],
      expiresAt: '2026-08-30',
      status: 'active',
      createdAt: '2026-07-30'
    },
    {
      id: 'inv-2',
      code: 'ITQAN-HERO-882',
      expectedFullName: 'سارة محمد محمود',
      groupName: 'مجموعة CSS المتقدمة',
      assignedCourses: ['فن التنسيق بلغة CSS'],
      expiresAt: '2026-08-15',
      status: 'used',
      usedByStudent: 'سارة محمد محمود',
      usedAt: '2026-07-30 14:20',
      createdAt: '2026-07-29'
    },
    {
      id: 'inv-3',
      code: 'ITQAN-HERO-773',
      expectedFullName: 'محمود خالد عبد الله',
      groupName: 'مجموعة JavaScript',
      assignedCourses: ['لغة JavaScript التفاعلية'],
      expiresAt: '2026-07-25',
      status: 'expired',
      createdAt: '2026-07-20'
    }
  ]);

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Create Form State
  const [studentFullName, setStudentFullName] = useState('');
  const [groupName, setGroupName] = useState('مجموعة HTML الأولى');
  const [assignedCourse, setAssignedCourse] = useState('أساسيات لغة HTML');
  const [daysValid, setDaysValid] = useState(14);

  const handleCreateInvitation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentFullName) return;

    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + daysValid);

    const newInv: Invitation = {
      id: `inv-${Date.now()}`,
      code: `ITQAN-HERO-${randomSuffix}`,
      expectedFullName: studentFullName,
      groupName: groupName,
      assignedCourses: [assignedCourse],
      expiresAt: expireDate.toISOString().split('T')[0],
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setInvitations([newInv, ...invitations]);
    setStudentFullName('');
  };

  const handleCopy = (text: string, type: 'code' | 'link') => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleRevoke = (id: string) => {
    setInvitations(invitations.map(i => i.id === id ? { ...i, status: 'revoked' } : i));
  };

  const handleReactivate = (id: string) => {
    setInvitations(invitations.map(i => i.id === id ? { ...i, status: 'active' } : i));
  };

  const filteredInvitations = invitations.filter((inv) => {
    const matchesStatus = filterStatus === 'all' || inv.status === filterStatus;
    const matchesSearch =
      inv.expectedFullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-surface border border-bdr p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <KeyRound className="w-6 h-6 text-brand-primary" />
            <h1 className="text-xl font-extrabold text-txt-primary">مركز التحكم الكامل بالدعوات أحادية الاستخدام</h1>
          </div>
          <p className="text-xs text-txt-muted mt-1">
            إنشاء أكواد دعوة فردية للطلاب، تخصيص الأسماء والمجموعات، تتبع استخدام الدعوات، وإلغائها أو نسخ روابط التفعيل المباشرة.
          </p>
        </div>
      </div>

      {/* Grid: Create Form & Invitations List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Form */}
        <form onSubmit={handleCreateInvitation} className="bg-surface border border-bdr p-6 rounded-2xl space-y-4 shadow-sm">
          <h2 className="text-sm font-bold text-txt-primary border-b border-bdr pb-2 flex items-center gap-2">
            <Plus className="w-4 h-4 text-brand-primary" />
            <span>إنشاء دعوة فردية جديدة (Single-Use)</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-txt-secondary mb-1">اسم الطالب الثلاثي المتوقع (إجباري)</label>
              <input
                type="text"
                required
                value={studentFullName}
                onChange={(e) => setStudentFullName(e.target.value)}
                placeholder="مثال: أحمد علي حسن"
                className="w-full bg-surface-secondary border border-bdr rounded-xl p-2.5 text-xs text-txt-primary"
              />
              <span className="text-[10px] text-txt-muted mt-1 block">يجب أن يكتب الطالب اسمه بنفس الصيغة لفتح الحساب.</span>
            </div>

            <div>
              <label className="block font-bold text-txt-secondary mb-1">المجموعة المسندة</label>
              <select
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full bg-surface-secondary border border-bdr rounded-xl p-2.5 text-xs text-txt-primary"
              >
                <option value="مجموعة HTML الأولى">مجموعة HTML الأولى</option>
                <option value="مجموعة CSS المتقدمة">مجموعة CSS المتقدمة</option>
                <option value="مجموعة JavaScript التفاعلية">مجموعة JavaScript التفاعلية</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-txt-secondary mb-1">الكورس المسند تلقائياً</label>
              <select
                value={assignedCourse}
                onChange={(e) => setAssignedCourse(e.target.value)}
                className="w-full bg-surface-secondary border border-bdr rounded-xl p-2.5 text-xs text-txt-primary"
              >
                <option value="أساسيات لغة HTML">أساسيات لغة HTML</option>
                <option value="فن التنسيق بلغة CSS">فن التنسيق بلغة CSS</option>
                <option value="لغة JavaScript التفاعلية">لغة JavaScript التفاعلية</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-txt-secondary mb-1">صلاحية الكود (أيام)</label>
              <input
                type="number"
                min={1}
                max={90}
                value={daysValid}
                onChange={(e) => setDaysValid(Number(e.target.value))}
                className="w-full bg-surface-secondary border border-bdr rounded-xl p-2.5 text-xs text-txt-primary font-mono"
              />
            </div>

            <button type="submit" className="w-full py-2.5 bg-brand-primary text-white text-xs font-bold rounded-xl shadow-md">
              توليد كود الدعوة الفردي
            </button>
          </div>
        </form>

        {/* Invitations List & Filter */}
        <div className="lg:col-span-2 bg-surface border border-bdr p-6 rounded-2xl space-y-4 shadow-sm">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-bdr pb-4">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-txt-muted absolute right-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث باسم الطالب أو الكود..."
                className="w-full bg-surface-secondary border border-bdr rounded-xl py-2 pr-9 pl-3 text-xs text-txt-primary"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {[
                { id: 'all', label: 'الكل' },
                { id: 'active', label: 'نشط' },
                { id: 'used', label: 'مستخدم' },
                { id: 'expired', label: 'منتهي' },
                { id: 'revoked', label: 'ملغى' },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setFilterStatus(st.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                    filterStatus === st.id
                      ? 'bg-brand-primary text-white'
                      : 'bg-surface-secondary border border-bdr text-txt-muted hover:text-txt-primary'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {filteredInvitations.map((inv) => {
              const directLink = `${window.location.origin}/join/${inv.code}`;
              const isCopied = copiedCode === inv.code || copiedCode === directLink;

              return (
                <div key={inv.id} className="p-4 rounded-xl border border-bdr bg-surface-secondary/50 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-brand-primary text-sm">{inv.code}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        inv.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                          : inv.status === 'used'
                          ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                          : inv.status === 'expired'
                          ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                      }`}>
                        {inv.status === 'active' && 'جاهز للاستخدام'}
                        {inv.status === 'used' && 'تم التفعيل بكتساب'}
                        {inv.status === 'expired' && 'منتهي الصلاحية'}
                        {inv.status === 'revoked' && 'ملغى يدويًا'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopy(inv.code, 'code')}
                        className="p-1.5 rounded-lg bg-surface border border-bdr text-txt-muted hover:text-brand-primary"
                        title="نسخ الكود"
                      >
                        {isCopied && copiedCode === inv.code ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => handleCopy(directLink, 'link')}
                        className="p-1.5 rounded-lg bg-surface border border-bdr text-txt-muted hover:text-brand-primary"
                        title="نسخ رابط التسجيل المباشر"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>

                      {inv.status === 'active' && (
                        <button
                          onClick={() => handleRevoke(inv.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white"
                          title="إلغاء الكود"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {inv.status === 'revoked' && (
                        <button
                          onClick={() => handleReactivate(inv.id)}
                          className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white"
                          title="إعادة تفعيل الكود"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-txt-muted text-[11px]">
                    <div>
                      <span className="font-bold text-txt-primary">الطالب المستهدف:</span> {inv.expectedFullName}
                    </div>
                    <div>
                      <span className="font-bold text-txt-primary">المجموعة:</span> {inv.groupName}
                    </div>
                    <div>
                      <span className="font-bold text-txt-primary">الكورس المسند:</span> {inv.assignedCourses.join(', ')}
                    </div>
                    <div>
                      <span className="font-bold text-txt-primary">تاريخ الانتهاء:</span> {inv.expiresAt}
                    </div>
                  </div>

                  {inv.status === 'used' && inv.usedByStudent && (
                    <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 text-[11px] font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>تم إنشاء الحساب بواسطة: {inv.usedByStudent} في {inv.usedAt}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
