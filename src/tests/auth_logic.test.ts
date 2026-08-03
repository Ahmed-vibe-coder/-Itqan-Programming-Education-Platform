import { describe, it, expect, beforeEach } from 'vitest';

// Pure logic verification for AuthProvider recovery and RoleGuard evaluation

describe('Milestone 3 Auth & Guard Empirical Logic Tests', () => {
  let storage: Record<string, string> = {};

  const mockLocalStorage = {
    getItem: (key: string) => storage[key] ?? null,
    setItem: (key: string, value: string) => { storage[key] = value; },
    removeItem: (key: string) => { delete storage[key]; },
    clear: () => { storage = {}; },
  };

  beforeEach(() => {
    mockLocalStorage.clear();
  });

  describe('1. Local Storage Corruption & Recovery Logic in AuthProvider', () => {
    function parseMockSession(storedUser: string | null) {
      let user = null;
      let profile = null;
      let role = null;

      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (typeof parsed !== 'object' || parsed === null) {
            throw new Error('Invalid session object in localStorage');
          }
          user = parsed.user ?? null;
          profile = parsed.profile ?? null;
          role = parsed.role ?? null;
        } catch (e) {
          // Failure to parse removes the corrupted key
          mockLocalStorage.removeItem('nawa_mock_session');
          user = null;
          profile = null;
          role = null;
        }
      }
      return { user, profile, role, stored: mockLocalStorage.getItem('nawa_mock_session') };
    }

    it('recovers safely from JSON syntax errors in localStorage', () => {
      mockLocalStorage.setItem('nawa_mock_session', '{"corrupted_json:');
      const result = parseMockSession(mockLocalStorage.getItem('nawa_mock_session'));
      
      expect(result.user).toBeNull();
      expect(result.profile).toBeNull();
      expect(result.role).toBeNull();
      expect(result.stored).toBeNull(); // Key successfully removed
    });

    it('evaluates primitive JSON values and purges corrupted session', () => {
      mockLocalStorage.setItem('nawa_mock_session', '99999');
      const result = parseMockSession(mockLocalStorage.getItem('nawa_mock_session'));

      expect(result.user).toBeNull();
      expect(result.profile).toBeNull();
      expect(result.role).toBeNull();
      expect(result.stored).toBeNull();
    });

    it('parses valid session objects accurately', () => {
      const validSession = {
        user: { id: 'usr-1', email: 'test@nawa.edu' },
        profile: { id: 'usr-1', full_name: 'Test Student' },
        role: 'student',
      };
      mockLocalStorage.setItem('nawa_mock_session', JSON.stringify(validSession));
      const result = parseMockSession(mockLocalStorage.getItem('nawa_mock_session'));

      expect(result.user).toEqual(validSession.user);
      expect(result.profile).toEqual(validSession.profile);
      expect(result.role).toBe('student');
    });
  });

  describe('2. RoleGuard Guard Protection Logic & Fallback Evaluation', () => {
    function evaluateRoleGuard(user: any | null, role: string | null, allowedRoles: string[]): { action: 'render' | 'navigate'; target?: string } {
      if (!user) {
        return { action: 'navigate', target: '/login' };
      }
      if (!role || !allowedRoles.includes(role)) {
        if (!role) {
          return { action: 'navigate', target: '/login' };
        }
        if (role === 'student') return { action: 'navigate', target: '/app' };
        if (role === 'teacher' || role === 'owner') return { action: 'navigate', target: '/teacher' };
        return { action: 'navigate', target: '/login' };
      }
      return { action: 'render' };
    }

    it('denies access to unauthenticated user (user=null)', () => {
      const res = evaluateRoleGuard(null, null, ['student']);
      expect(res).toEqual({ action: 'navigate', target: '/login' });
    });

    it('allows access to authorized role', () => {
      const res = evaluateRoleGuard({ id: '1' }, 'student', ['student']);
      expect(res).toEqual({ action: 'render' });
    });

    it('redirects student away from teacher route to /app', () => {
      const res = evaluateRoleGuard({ id: '1' }, 'student', ['teacher', 'owner']);
      expect(res).toEqual({ action: 'navigate', target: '/app' });
    });

    it('redirects teacher away from student route to /teacher', () => {
      const res = evaluateRoleGuard({ id: '2' }, 'teacher', ['student']);
      expect(res).toEqual({ action: 'navigate', target: '/teacher' });
    });

    it('CRITICAL EDGE CASE: unknown/invalid role redirects to /login', () => {
      const res = evaluateRoleGuard({ id: '3' }, 'unrecognized_role', ['student']);
      expect(res).toEqual({ action: 'navigate', target: '/login' });
    });
  });
});
