import React, { useState, useEffect } from 'react';
import { Users, Search, UserCheck, ShieldAlert, BookOpen, Plus, Eye, Edit, Trash2, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { teacherService } from '@/services/teacherService';

interface Student {
  id: string;
  name: string;
  username: string;
  age: number;
  group: string;
  status: 'active' | 'inactive';
  joined: string;
  xp?: number;
}

export const StudentDirectoryPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState('all');
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('nawa_students');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 's1', name: 'أحمد محمود', username: 'ahmed_coder', age: 13, group: 'المجموعة الأولى (أبطال HTML)', status: 'active', joined: 'منذ شهر', xp: 250 },
      { id: 's2', name: 'سارة علي', username: 'sara_web', age: 14, group: 'مجموعة الموهوبين (JS Core)', status: 'active', joined: 'منذ أسبوعين', xp: 410 },
      { id: 's3', name: 'عمر خالد', username: 'omar_dev', age: 12, group: 'المجموعة الأولى (أبطال HTML)', status: 'active', joined: 'منذ 3 أيام', xp: 120 },
    ];
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [selectedProfileStudent, setSelectedProfileStudent] = useState<Student | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [age, setAge] = useState(13);
  const [group, setGroup] = useState('المجموعة الأولى (أبطال HTML)');

  useEffect(() => {
    localStorage.setItem('nawa_students', JSON.stringify(students));
  }, [students]);

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !username) return;

    if (editingStudent) {
      setStudents(students.map(s => s.id === editingStudent.id ? {
        ...s,
        name,
        username,
        age,
        group
      } : s));
      setEditingStudent(null);
    } else {
      const newStudent: Student = {
        id: `s-${Date.now()}`,
        name,
        username,
        age,
        group,
        status: 'active',
        joined: 'اليوم',
        xp: 50
      };
      setStudents([newStudent, ...students]);
    }

    setName('');
    setUsername('');
    setAge(13);
    setIsAddModalOpen(false);
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setName(student.name);
    setUsername(student.username);
    setAge(student.age);
    setGroup(student.group);
    setIsAddModalOpen(true);
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm('هل أنت تأكد من رغبتك في حذف هذا الطالب؟')) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const filtered = students.filter((s) => {
    const matchesSearch = s.name.includes(search) || s.username.includes(search);
    const matchesGroup = groupFilter === 'all' || s.group === groupFilter;
    return matchesSearch && matchesGroup;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-bdr pb-4">
        <div>
          <h1 className="text-xl font-bold text-txt-primary flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-primary" />
            <span>دليل الطلاب المسجلين</span>
          </h1>
          <p className="text-xs text-txt-muted">متابعة إنجاز الطلاب وحالات الحسابات والتعيينات</p>
        </div>

        <button
          onClick={() => {
            setEditingStudent(null);
            setName('');
            setUsername('');
            setAge(13);
            setIsAddModalOpen(true);
          }}
          className="px-4 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة طالب جديد</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-surface border border-bdr p-4 rounded-2xl shadow-sm">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث بالاسم أو اسم المستخدم..."
            className="w-full bg-surface-secondary border border-bdr rounded-xl px-4 py-2 text-xs text-txt-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40 pl-9"
          />
          <Search className="w-4 h-4 text-txt-muted absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs text-txt-muted font-bold shrink-0">المجموعة:</label>
          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="w-full sm:w-auto bg-surface-secondary border border-bdr rounded-xl px-3 py-2 text-xs text-txt-primary"
          >
            <option value="all">جميع المجموعات ({students.length})</option>
            <option value="المجموعة الأولى (أبطال HTML)">المجموعة الأولى (أبطال HTML)</option>
            <option value="مجموعة الموهوبين (JS Core)">مجموعة الموهوبين (JS Core)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface border border-bdr rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-surface-secondary border-b border-bdr text-txt-secondary font-bold">
              <tr>
                <th className="p-3.5">الطالب</th>
                <th className="p-3.5">المستوى</th>
                <th className="p-3.5">المجموعة</th>
                <th className="p-3.5">نقاط XP</th>
                <th className="p-3.5">تاريخ الانضمام</th>
                <th className="p-3.5">الحالة</th>
                <th className="p-3.5">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bdr text-txt-primary">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-surface-secondary/50 transition-colors">
                  <td className="p-3.5 font-bold">
                    <div>{s.name}</div>
                    <div className="text-[11px] text-txt-muted font-normal" dir="ltr">@{s.username}</div>
                  </td>
                  <td className="p-3.5 font-medium text-txt-secondary">مبتدئ</td>
                  <td className="p-3.5 font-semibold text-brand-primary">{s.group}</td>
                  <td className="p-3.5 font-mono font-bold text-amber-500">{s.xp || 50} XP</td>
                  <td className="p-3.5 text-txt-muted">{s.joined}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">
                      نشط
                    </span>
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedProfileStudent(s)}
                        className="px-2.5 py-1 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary rounded-lg font-bold transition-all flex items-center gap-1 text-[11px]"
                        title="عرض الملف"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>الملف</span>
                      </button>
                      <button
                        onClick={() => openEditModal(s)}
                        className="p-1.5 bg-surface-secondary hover:bg-surface-secondary/80 border border-bdr text-txt-secondary rounded-lg font-bold transition-all"
                        title="تعديل البيانات"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(s.id)}
                        className="p-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white rounded-lg font-bold transition-all"
                        title="حذف الطالب"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-txt-muted">
                    لا يوجد طلاب يطابقون خيارات البحث.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-bdr rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-bdr pb-3">
              <h3 className="font-bold text-sm text-txt-primary">
                {editingStudent ? 'تعديل بيانات الطالب' : 'إضافة طالب جديد للمنظومة'}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-txt-muted hover:text-txt-primary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-txt-secondary mb-1">اسم الطالب الكامل</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: علي حسن"
                  className="w-full bg-surface-secondary border border-bdr rounded-xl p-2.5 text-xs text-txt-primary"
                />
              </div>

              <div>
                <label className="block font-bold text-txt-secondary mb-1">اسم المستخدم (Username)</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ali_coder"
                  dir="ltr"
                  className="w-full bg-surface-secondary border border-bdr rounded-xl p-2.5 text-xs text-txt-primary text-left"
                />
              </div>

              <div>
                <label className="block font-bold text-txt-secondary mb-1">المجموعة المسندة</label>
                <select
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                  className="w-full bg-surface-secondary border border-bdr rounded-xl p-2.5 text-xs text-txt-primary font-bold"
                >
                  <option value="المجموعة الأولى (أبطال HTML)">المجموعة الأولى (أبطال HTML)</option>
                  <option value="مجموعة الموهوبين (JS Core)">مجموعة الموهوبين (JS Core)</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-surface-secondary border border-bdr rounded-xl font-bold text-txt-secondary"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-primary text-white font-bold rounded-xl shadow-md"
                >
                  {editingStudent ? 'حفظ التعديلات' : 'إضافة الطالب'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Student Profile Modal */}
      {selectedProfileStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-bdr rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-bdr pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-sm text-txt-primary">الملف الأكاديمي للطالب</h3>
              </div>
              <button onClick={() => setSelectedProfileStudent(null)} className="text-txt-muted hover:text-txt-primary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-surface-secondary border border-bdr space-y-1 text-center">
                <div className="w-12 h-12 rounded-full bg-brand-primary/10 text-brand-primary font-extrabold text-lg flex items-center justify-center mx-auto mb-2">
                  {selectedProfileStudent.name[0]}
                </div>
                <h4 className="font-extrabold text-base text-txt-primary">{selectedProfileStudent.name}</h4>
                <span className="text-txt-muted font-mono" dir="ltr">@{selectedProfileStudent.username}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center font-bold">
                <div className="p-3 bg-surface-secondary border border-bdr rounded-xl">
                  <span className="text-txt-muted text-[10px] block font-normal">المجموعة</span>
                  <span className="text-brand-primary text-[11px]">{selectedProfileStudent.group}</span>
                </div>
                <div className="p-3 bg-surface-secondary border border-bdr rounded-xl">
                  <span className="text-txt-muted text-[10px] block font-normal">نقاط XP</span>
                  <span className="text-amber-500 font-mono">{selectedProfileStudent.xp || 50} XP</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>أكمل 4 دروس متتالية بدون أي أخطاء حرجة.</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedProfileStudent(null)}
                className="px-5 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

