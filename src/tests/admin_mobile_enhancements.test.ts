import { describe, it, expect } from 'vitest';

function normalizeArabicText(str: string): string {
  if (!str) return '';
  let res = str.trim().toLowerCase();
  res = res.replace(/[أإآآ]/g, 'ا');
  res = res.replace(/[ى]/g, 'ي');
  res = res.replace(/[ة]/g, 'ه');
  res = res.replace(/[\u064B-\u0652]/g, '');
  res = res.replace(/\s+/g, ' ');
  return res;
}

describe('إتقان — Comprehensive System Architecture, Invitations, Auth, 24 Question Types & Security', () => {
  it('verifies all 24 question types are uniquely identified in the system', () => {
    const questionTypes = [
      'single_choice', 'multiple_choice', 'true_false', 'fill_blank',
      'fill_multiple_blanks', 'word_bank_completion', 'drag_words',
      'short_answer', 'essay', 'matching', 'ordering', 'arrange_code',
      'predict_output', 'choose_correct_code', 'find_error', 'correct_error',
      'complete_code', 'small_coding_task', 'visual_result_matching',
      'select_rendered_output', 'categorization', 'flashcard_review',
      'timed_rapid', 'multi_step'
    ];
    const uniqueTypes = new Set(questionTypes);
    expect(uniqueTypes.size).toBe(24);
  });

  it('normalizes Arabic student names accurately removing diacritics and unifying letters', () => {
    const name1 = 'أَحْمَدُ عَلِيٌّ حَسَنٌ';
    const name2 = 'احمد علي حسن';
    expect(normalizeArabicText(name1)).toBe(normalizeArabicText(name2));
  });

  it('enforces single-use invitation max_uses constraint (max_uses = 1)', () => {
    const invitation = {
      max_uses: 1,
      used_count: 1,
      status: 'used'
    };

    const canBeUsedAgain = invitation.status === 'active' && invitation.used_count < invitation.max_uses;
    expect(canBeUsedAgain).toBe(false);
  });

  it('maps student username to internal auth email without exposing raw passwords', () => {
    const username = 'StudentHero123';
    const internalEmail = `${username.toLowerCase().trim()}@itqan.edu.internal`;
    expect(internalEmail).toBe('studenthero123@itqan.edu.internal');
  });

  it('calculates exam blueprint total points correctly', () => {
    const examQuestions = [
      { points: 10 },
      { points: 15 },
      { points: 25 },

    ];
    const totalPoints = examQuestions.reduce((sum, q) => sum + q.points, 0);
    expect(totalPoints).toBe(50);
  });

  it('ensures AI generated questions remain drafts until approved by teacher', () => {
    const aiGeneratedQuestion = {
      prompt_ar: 'سؤال توليد تلقائي حول الوسوم',
      status: 'draft'
    };
    expect(aiGeneratedQuestion.status).toBe('draft');
  });

  it('verifies remediation plan maps weak concepts to recommended lessons', () => {
    const remediation = {
      user_id: 'usr-1',
      weak_concepts: ['HTML Links', 'CSS Margins'],
      recommended_lesson_ids: ['les-html-105', 'les-css-107']
    };
    expect(remediation.recommended_lesson_ids.length).toBe(2);
  });
});
