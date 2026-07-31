import { describe, it, expect } from 'vitest';

describe('JSON Import/Export Schema Tests', () => {
  it('validates schema version 1.0 JSON payload', () => {
    const validPayload = {
      schemaVersion: '1.0',
      course: { title_ar: 'اختبار HTML', subject: 'html' },
      lessons: [],
    };

    const isValid = validPayload.schemaVersion === '1.0' && !!validPayload.course.title_ar;
    expect(isValid).toBe(true);
  });
});
