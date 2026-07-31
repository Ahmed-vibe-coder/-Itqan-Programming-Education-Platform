import React, { useEffect, useState } from 'react';
import { attentionService, AttentionAlert } from '@/services/attentionService';
import { AlertCircle, User, Bell, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TeacherAttentionPage: React.FC = () => {
  const [alerts, setAlerts] = useState<AttentionAlert[]>([]);

  useEffect(() => {
    attentionService.getTeacherAttentionAlerts().then(setAlerts);
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between border-b border-bdr pb-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-500" />
          <div>
            <h1 className="text-xl font-bold text-txt-primary">مركز انتباه المعلم (Teacher Attention Center)</h1>
            <p className="text-xs text-txt-muted">قائمة الطلاب الذين يحتاجون إلى تدخل أو تصحيح أو متابعة فورية</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {alerts.map((alt) => (
          <div key={alt.id} className="p-5 rounded-2xl border border-bdr bg-surface flex items-start justify-between shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-txt-primary flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-brand-primary" />
                  <span>{alt.studentName}</span>
                </span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    alt.severity === 'high'
                      ? 'bg-red-500/10 text-red-500'
                      : 'bg-amber-500/10 text-amber-600'
                  }`}
                >
                  {alt.severity === 'high' ? 'أولوية عاجلة' : 'متابعة'}
                </span>
              </div>

              <h3 className="font-bold text-sm text-txt-primary">{alt.title_ar}</h3>
              <p className="text-xs text-txt-secondary leading-relaxed">{alt.details_ar}</p>
            </div>

            <div className="pt-2 flex flex-col items-end gap-2">
              <span className="text-[11px] text-txt-muted">{alt.timestamp}</span>
              <Link
                to={`/teacher/students/${alt.studentId}`}
                className="px-3.5 py-1.5 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-xs rounded-xl flex items-center gap-1 transition-all"
              >
                <span>الانتقال لملف الطالب</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
