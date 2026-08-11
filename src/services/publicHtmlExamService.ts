import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface PublicExamAttempt {
  id: string;
  student_name: string;
  score: number;
  total_questions: number;
  percentage: number;
  passed: boolean;
  answers_json: Record<string, string>;
  verification_code?: string;
  completed_at: string;
}

export interface PublicCertificate {
  id: string;
  verification_code: string;
  student_name: string;
  course_name: string;
  score: number;
  total_questions: number;
  percentage: number;
  issued_at: string;
  status: 'active' | 'revoked';
}

const LOCAL_STORAGE_ATTEMPTS_KEY = 'itqan_public_html_attempts';
const LOCAL_STORAGE_CERTS_KEY = 'itqan_public_html_certificates';

function generateRandomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `ITQAN-HTML-${result}`;
}

export const publicHtmlExamService = {
  async submitExam(
    studentName: string,
    score: number,
    totalQuestions: number,
    answers: Record<string, string>
  ): Promise<{ attempt: PublicExamAttempt; certificate?: PublicCertificate }> {
    const percentage = Number(((score / totalQuestions) * 100).toFixed(1));
    const passed = percentage >= 50.0;
    const completedAt = new Date().toISOString();
    const attemptId = `att-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

    let verificationCode: string | undefined = undefined;
    let certificate: PublicCertificate | undefined = undefined;

    if (passed) {
      verificationCode = generateRandomCode();
      certificate = {
        id: `cert-${Date.now()}`,
        verification_code: verificationCode,
        student_name: studentName,
        course_name: 'اختبار إتقان الشامل في لغة HTML',
        score,
        total_questions: totalQuestions,
        percentage,
        issued_at: completedAt,
        status: 'active',
      };
    }

    const attempt: PublicExamAttempt = {
      id: attemptId,
      student_name: studentName,
      score,
      total_questions: totalQuestions,
      percentage,
      passed,
      answers_json: answers,
      verification_code: verificationCode,
      completed_at: completedAt,
    };

    // 1. Try Supabase persistence first
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('public_html_exam_attempts').insert({
          student_name: studentName,
          score,
          total_questions: totalQuestions,
          percentage,
          passed,
          answers_json: answers,
          verification_code: verificationCode,
          completed_at: completedAt,
        });

        if (certificate) {
          await supabase.from('public_html_certificates').insert({
            verification_code: certificate.verification_code,
            student_name: studentName,
            course_name: certificate.course_name,
            score: certificate.score,
            total_questions: certificate.total_questions,
            percentage: certificate.percentage,
            issued_at: certificate.issued_at,
            status: 'active',
          });
        }
      } catch (err) {
        console.warn('Supabase public exam insert error, using local fallback:', err);
      }
    }

    // 2. Always fallback to LocalStorage for reliable retrieval
    try {
      const existingAttempts: PublicExamAttempt[] = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_ATTEMPTS_KEY) || '[]'
      );
      existingAttempts.unshift(attempt);
      localStorage.setItem(LOCAL_STORAGE_ATTEMPTS_KEY, JSON.stringify(existingAttempts));

      if (certificate) {
        const existingCerts: PublicCertificate[] = JSON.parse(
          localStorage.getItem(LOCAL_STORAGE_CERTS_KEY) || '[]'
        );
        existingCerts.unshift(certificate);
        localStorage.setItem(LOCAL_STORAGE_CERTS_KEY, JSON.stringify(existingCerts));
      }
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }

    return { attempt, certificate };
  },

  async getAttemptById(attemptId: string): Promise<PublicExamAttempt | null> {
    // Check localStorage first
    try {
      const existingAttempts: PublicExamAttempt[] = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_ATTEMPTS_KEY) || '[]'
      );
      const found = existingAttempts.find((a) => a.id === attemptId);
      if (found) return found;
    } catch (e) {
      console.error(e);
    }

    // Check Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('public_html_exam_attempts')
          .select('*')
          .eq('id', attemptId)
          .single();

        if (!error && data) {
          return {
            id: data.id,
            student_name: data.student_name,
            score: data.score,
            total_questions: data.total_questions,
            percentage: Number(data.percentage),
            passed: data.passed,
            answers_json: data.answers_json || {},
            verification_code: data.verification_code,
            completed_at: data.completed_at,
          };
        }
      } catch (err) {
        console.error('Supabase fetch attempt failed:', err);
      }
    }

    return null;
  },

  async getCertificateByCode(verificationCode: string): Promise<PublicCertificate | null> {
    const cleanCode = verificationCode.trim().toUpperCase();

    // Check LocalStorage
    try {
      const existingCerts: PublicCertificate[] = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_CERTS_KEY) || '[]'
      );
      const found = existingCerts.find(
        (c) => c.verification_code.toUpperCase() === cleanCode
      );
      if (found) return found;
    } catch (e) {
      console.error(e);
    }

    // Check Supabase
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('public_html_certificates')
          .select('*')
          .eq('verification_code', cleanCode)
          .single();

        if (!error && data) {
          return {
            id: data.id,
            verification_code: data.verification_code,
            student_name: data.student_name,
            course_name: data.course_name,
            score: data.score,
            total_questions: data.total_questions,
            percentage: Number(data.percentage),
            issued_at: data.issued_at,
            status: data.status,
          };
        }
      } catch (err) {
        console.error('Supabase fetch certificate error:', err);
      }
    }

    return null;
  },

  async getAllAttempts(): Promise<PublicExamAttempt[]> {
    let localAttempts: PublicExamAttempt[] = [];
    try {
      localAttempts = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ATTEMPTS_KEY) || '[]');
    } catch (e) {
      console.error(e);
    }

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('public_html_exam_attempts')
          .select('*')
          .order('completed_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const remoteAttempts: PublicExamAttempt[] = data.map((d: any) => ({
            id: d.id,
            student_name: d.student_name,
            score: d.score,
            total_questions: d.total_questions,
            percentage: Number(d.percentage),
            passed: d.passed,
            answers_json: d.answers_json || {},
            verification_code: d.verification_code,
            completed_at: d.completed_at,
          }));

          // Merge local and remote avoiding duplicates by id or code
          const map = new Map<string, PublicExamAttempt>();
          [...localAttempts, ...remoteAttempts].forEach((item) => map.set(item.id, item));
          return Array.from(map.values()).sort(
            (a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
          );
        }
      } catch (e) {
        console.error('Fetch all attempts error:', e);
      }
    }

    return localAttempts;
  },

  async getAllCertificates(): Promise<PublicCertificate[]> {
    let localCerts: PublicCertificate[] = [];
    try {
      localCerts = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CERTS_KEY) || '[]');
    } catch (e) {
      console.error(e);
    }

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('public_html_certificates')
          .select('*')
          .order('issued_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const remoteCerts: PublicCertificate[] = data.map((d: any) => ({
            id: d.id,
            verification_code: d.verification_code,
            student_name: d.student_name,
            course_name: d.course_name,
            score: d.score,
            total_questions: d.total_questions,
            percentage: Number(d.percentage),
            issued_at: d.issued_at,
            status: d.status,
          }));

          const map = new Map<string, PublicCertificate>();
          [...localCerts, ...remoteCerts].forEach((item) => map.set(item.verification_code, item));
          return Array.from(map.values()).sort(
            (a, b) => new Date(b.issued_at).getTime() - new Date(a.issued_at).getTime()
          );
        }
      } catch (e) {
        console.error('Fetch all certificates error:', e);
      }
    }

    return localCerts;
  },
};
