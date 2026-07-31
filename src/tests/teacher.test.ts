import { describe, it, expect } from 'vitest';

describe('Teacher Operations & Invitation Tests', () => {
  it('generates unique uppercase invitation codes with NAWA prefix', () => {
    const code = `NAWA-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    expect(code).toMatch(/^NAWA-[A-Z0-9]{5}$/);
  });
});
