import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export const JoinPage: React.FC = () => {
  const { invitationCode } = useParams<{ invitationCode: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (invitationCode) {
      navigate(`/register?code=${encodeURIComponent(invitationCode)}`, { replace: true });
    } else {
      navigate('/register', { replace: true });
    }
  }, [invitationCode, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm text-txt-muted font-medium">جاري معالجة رابط الدعوة...</span>
      </div>
    </div>
  );
};
