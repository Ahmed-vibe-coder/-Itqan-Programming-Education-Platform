import { describe, it, expect } from 'vitest';

describe('Gamification & XP Ledger Tests', () => {
  it('prevents duplicate XP awarded using idempotency keys', () => {
    const executedKeys = new Set<string>();
    const awardXP = (userId: string, points: number, key: string) => {
      if (executedKeys.has(key)) return 0;
      executedKeys.add(key);
      return points;
    };

    const firstCall = awardXP('u1', 25, 'mastery_u1_l1');
    const secondCall = awardXP('u1', 25, 'mastery_u1_l1');

    expect(firstCall).toBe(25);
    expect(secondCall).toBe(0);
  });
});
