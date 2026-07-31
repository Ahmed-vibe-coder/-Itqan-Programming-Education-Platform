import { describe, it, expect } from 'vitest';

describe('Mastery Gate & Lesson Unlocking Logic Tests', () => {
  it('requires 100% score to pass mastery gate', () => {
    const questions = [
      { id: 'q1', correct: 'a' },
      { id: 'q2', correct: 'b' },
    ];

    const studentAnswersPass = { q1: 'a', q2: 'b' };
    const studentAnswersFail = { q1: 'a', q2: 'c' };

    const checkPass = (answers: Record<string, string>) => {
      return questions.every((q) => answers[q.id] === q.correct);
    };

    expect(checkPass(studentAnswersPass)).toBe(true);
    expect(checkPass(studentAnswersFail)).toBe(false);
  });
});
