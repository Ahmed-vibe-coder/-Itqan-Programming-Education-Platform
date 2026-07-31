import React, { useState } from 'react';
import { Users, Search, UserCheck, ShieldAlert, BookOpen, Plus, Eye } from 'lucide-react';

export const StudentDirectoryPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [students, setStudents] = useState([
    { id: 's1', name: 'أحمد محمود', username: 'ahmed_coder', age: 13, group: 'المجموعة الأولى', status: 'active', joined: 'منذ شهر' },
    { id: 's2', name: 'سارة علي', username: 'sara_web', age: 14, group: 'مجموعة الموهوبين', status: 'active', joined: 'منذ أسبوعين' },
  ]);

  const filtered = students.filter((s) => s.name.includes(search) || s.username.includes(search));

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-bdr pb-4">
        <div>
          <h1 className="text-xl font-bold text-txt-primary">دليل الطلاب المسجلين</h1>
          <p className="text-xs text-txt-muted">متابعة إنجاز الطلاب وحالات الحسابات والتعيينات</p>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث بالاسم أو اسم المستخدم..."
            className="w-full bg-surface border border-bdr rounded-xl px-4 py-2 text-xs text-txt-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40 pl-9"
          />
          <Search className="w-4 h-4 text-txt-muted absolute left-3 top-2.5" />
        </div>
      </div>

      <div className="bg-surface border border-bdr rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-surface-secondary border-b border-bdr text-txt-secondary font-bold">
              <tr>
                <th className="p-3.5">الطالب</th>
                <th className="p-3.5">العمر</th>
                <th className="p-3.5">المجموعة</th>
                <th className="p-3.5">تاريخ الانضمام</th>
                <th className="p-3.5">الحالة</th>
                <th className="p-3.5">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bdr text-txt-primary">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-surface-secondary/50">
                  <td className="p-3.5 font-bold">
                    <div>{s.name}</div>
                    <div className="text-[11px] text-txt-muted font-normal" dir="ltr">@{s.username}</div>
                  </td>
                  <td className="p-3.5">{s.age} سنة</td>
                  <td className="p-3.5 font-semibold text-brand-primary">{s.group}</td>
                  <td className="p-3.5 text-txt-muted">{s.joined}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">
                      نشط
                    </span>
                  </td>
                  <td className="p-3.5">
                    <button
                      onClick={() => alert(`عرض تفاصيل الطالب: ${s.name}`)}
                      className="px-3 py-1 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary rounded-lg font-bold transition-all flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>الملف</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
