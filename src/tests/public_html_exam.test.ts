import { describe, it, expect, beforeEach } from 'vitest';
import { HTML_EXAM_QUESTIONS } from '@/data/htmlExamQuestions';
import { publicHtmlExamService } from '@/services/publicHtmlExamService';

// Mock localStorage for Node test environment
const storageStore: Record<string, string> = {};
if (typeof localStorage === 'undefined' || !localStorage.clear) {
  (globalThis as any).localStorage = {
    getItem: (key: string) => storageStore[key] || null,
    setItem: (key: string, val: string) => {
      storageStore[key] = String(val);
    },
    removeItem: (key: string) => {
      delete storageStore[key];
    },
    clear: () => {
      Object.keys(storageStore).forEach((k) => delete storageStore[k]);
    },
  };
}

describe('Public HTML Exam & Canvas Certificate Test Suite', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should contain exactly 30 diverse questions in the dataset', () => {
    expect(HTML_EXAM_QUESTIONS.length).toBe(30);

    const ids = new Set();
    HTML_EXAM_QUESTIONS.forEach((q) => {
      expect(q.id).toBeDefined();
      expect(q.prompt).toBeTruthy();
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.correctAnswerId).toBeTruthy();
      expect(q.explanation).toBeTruthy();
      ids.add(q.id);
    });

    expect(ids.size).toBe(30);
  });

  it('should mark attempt as passed (>= 50%) and issue a certificate when score >= 15/30', async () => {
    const studentName = 'أحمد سعيد القحطاني';
    const score = 24; // 80%
    const totalQuestions = 30;
    const dummyAnswers = { q1: 'a', q2: 'b' };

    const { attempt, certificate } = await publicHtmlExamService.submitExam(
      studentName,
      score,
      totalQuestions,
      dummyAnswers
    );

    expect(attempt.passed).toBe(true);
    expect(attempt.percentage).toBe(80);
    expect(attempt.student_name).toBe(studentName);
    expect(attempt.verification_code).toBeDefined();
    expect(attempt.verification_code).toMatch(/^ITQAN-HTML-[A-Z0-9]{6}$/);

    expect(certificate).toBeDefined();
    expect(certificate?.student_name).toBe(studentName);
    expect(certificate?.percentage).toBe(80);
    expect(certificate?.verification_code).toBe(attempt.verification_code);

    // Verify lookup by code
    if (attempt.verification_code) {
      const found = await publicHtmlExamService.getCertificateByCode(attempt.verification_code);
      expect(found).not.toBeNull();
      expect(found?.student_name).toBe(studentName);
      expect(found?.score).toBe(24);
    }
  });

  it('should mark attempt as failed (< 50%) and NOT issue a certificate when score < 15/30', async () => {
    const studentName = 'طالب محاول';
    const score = 12; // 40%
    const totalQuestions = 30;
    const dummyAnswers = { q1: 'b' };

    const { attempt, certificate } = await publicHtmlExamService.submitExam(
      studentName,
      score,
      totalQuestions,
      dummyAnswers
    );

    expect(attempt.passed).toBe(false);
    expect(attempt.percentage).toBe(40);
    expect(certificate).toBeUndefined();
    expect(attempt.verification_code).toBeUndefined();
  });
});
