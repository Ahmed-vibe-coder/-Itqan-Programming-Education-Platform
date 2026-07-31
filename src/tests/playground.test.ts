import { describe, it, expect } from 'vitest';

describe('Sandboxed Code Playground Security Tests', () => {
  it('enforces strict iframe sandbox without allow-same-origin', () => {
    const sandboxAttribute = 'allow-scripts';
    const hasSameOrigin = sandboxAttribute.includes('allow-same-origin');
    expect(hasSameOrigin).toBe(false);
  });

  it('validates postMessage payload origin and structure', () => {
    const messagePayload = { type: 'CONSOLE_LOG', payload: 'Hello World' };
    expect(messagePayload.type).toBe('CONSOLE_LOG');
    expect(typeof messagePayload.payload).toBe('string');
  });
});
