import React from 'react';
import { ShieldAlert, Lock, User, Clock } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const auditEntries = [
    {
      id: 'log-1',
      action: 'إعداد حساب المالك الأول (initialize_owner)',
      actor: 'Owner Teacher',
      entity: 'System Setup',
      timestamp: 'اليوم - 19:45',
      ip: '127.0.0.1',
    },
    {
      id: 'log-2',
      action: 'توليد كود دعوة جديد (NAWA-CLASS-A)',
      actor: 'Teacher',
      entity: 'Group Invitations',
      timestamp: 'اليوم - 19:40',
      ip: '127.0.0.1',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between border-b border-bdr pb-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-brand-primary" />
          <h1 className="text-xl font-bold text-txt-primary">سجل الأمان والعمليات الإدارية (Audit Log)</h1>
        </div>
      </div>

      <div className="bg-surface border border-bdr rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-right text-xs">
          <thead className="bg-surface-secondary border-b border-bdr text-txt-secondary font-bold">
            <tr>
              <th className="p-3.5">العملية الإدارية</th>
              <th className="p-3.5">المُنفذ</th>
              <th className="p-3.5">الوحدة المربوطة</th>
              <th className="p-3.5">التوقيت</th>
              <th className="p-3.5">IP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bdr text-txt-primary font-mono">
            {auditEntries.map((log) => (
              <tr key={log.id} className="hover:bg-surface-secondary/50">
                <td className="p-3.5 font-sans font-bold text-brand-primary">{log.action}</td>
                <td className="p-3.5 font-sans">{log.actor}</td>
                <td className="p-3.5 font-sans">{log.entity}</td>
                <td className="p-3.5 text-txt-muted">{log.timestamp}</td>
                <td className="p-3.5 text-txt-muted">{log.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
