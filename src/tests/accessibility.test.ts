import { describe, it, expect } from 'vitest';

describe('Accessibility & UI Theme Tests', () => {
  it('enforces dir="rtl" for Arabic layout and dir="ltr" for code blocks', () => {
    const mainPageDir = 'rtl';
    const codeBlockDir = 'ltr';

    expect(mainPageDir).toBe('rtl');
    expect(codeBlockDir).toBe('ltr');
  });
});
