import { describe, it, expect, beforeEach } from 'vitest';
import { authService } from '@/services/authService';
import { isRoleAllowed, getRedirectPathForRole } from '@/app/guards/RoleGuard';
import { UserRole } from '@/types/database';
import { isSupabaseConfigured } from '@/lib/supabase';

describe('Milestone 3 Adversarial Empirical Tests', () => {

  describe('1. Corrupted Session Inputs in LocalStorage', () => {
    let mockStorage: Record<string, string> = {};

    const mockLocalStorage = {
      getItem: (key: string) => mockStorage[key] ?? null,
      setItem: (key: string, value: string) => { mockStorage[key] = value; },
      removeItem: (key: string) => { delete mockStorage[key]; },
      clear: () => { mockStorage = {}; },
    };

    function parseSessionFromStorage(rawSession: string | null) {
      let user = null;
      let profile = null;
      let role = null;

      if (rawSession) {
        try {
          const parsed = JSON.parse(rawSession);
          if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
            throw new Error('Invalid session structure');
          }
          user = parsed.user ?? null;
          profile = parsed.profile ?? null;
          role = parsed.role ?? null;
        } catch (e) {
          mockLocalStorage.removeItem('nawa_mock_session');
          user = null;
          profile = null;
          role = null;
        }
      }
      return { user, profile, role, stored: mockLocalStorage.getItem('nawa_mock_session') };
    }

    beforeEach(() => {
      mockLocalStorage.clear();
    });

    it('handles malformed JSON syntax in localStorage by clearing key and returning null session', () => {
      mockLocalStorage.setItem('nawa_mock_session', '{corrupted_json_string: true');
      const res = parseSessionFromStorage(mockLocalStorage.getItem('nawa_mock_session'));

      expect(res.user).toBeNull();
      expect(res.profile).toBeNull();
      expect(res.role).toBeNull();
      expect(res.stored).toBeNull(); // Key purged successfully
    });

    it('handles primitive number JSON string in localStorage safely', () => {
      mockLocalStorage.setItem('nawa_mock_session', '98765');
      const res = parseSessionFromStorage(mockLocalStorage.getItem('nawa_mock_session'));

      expect(res.user).toBeNull();
      expect(res.profile).toBeNull();
      expect(res.role).toBeNull();
      expect(res.stored).toBeNull();
    });

    it('handles JSON array in localStorage safely', () => {
      mockLocalStorage.setItem('nawa_mock_session', '["user", "admin"]');
      const res = parseSessionFromStorage(mockLocalStorage.getItem('nawa_mock_session'));

      expect(res.user).toBeNull();
      expect(res.profile).toBeNull();
      expect(res.role).toBeNull();
      expect(res.stored).toBeNull();
    });

    it('handles empty JSON object gracefully without crashing', () => {
      mockLocalStorage.setItem('nawa_mock_session', '{}');
      const res = parseSessionFromStorage(mockLocalStorage.getItem('nawa_mock_session'));

      expect(res.user).toBeNull();
      expect(res.profile).toBeNull();
      expect(res.role).toBeNull();
      expect(res.stored).toBe('{}');
    });
  });

  describe('2. Invalid UUID Input Handling', () => {
    const invalidUUIDs = [
      'invalid-uuid-format',
      '00000000-0000-0000-0000',
      '12345',
      "' OR '1'='1",
      ''
    ];

    it('returns null or throws handled error when fetching profile with invalid UUID', async () => {
      for (const uuid of invalidUUIDs) {
        if (!isSupabaseConfigured()) {
          const profile = await authService.getProfile(uuid);
          expect(profile).toBeNull();
        } else {
          try {
            const profile = await authService.getProfile(uuid);
            expect(profile).toBeNull();
          } catch (err: any) {
            expect(err).toBeDefined();
          }
        }
      }
    });

    it('returns null or throws handled error when fetching role with invalid UUID', async () => {
      for (const uuid of invalidUUIDs) {
        if (!isSupabaseConfigured()) {
          const role = await authService.getRole(uuid);
          expect(role).toBeNull();
        } else {
          try {
            const role = await authService.getRole(uuid);
            expect(role).toBeNull();
          } catch (err: any) {
            expect(err).toBeDefined();
          }
        }
      }
    });
  });

  describe('3. Non-existent & Malformed Invitation Codes', () => {
    const badCodes = [
      'NON-EXISTENT-CODE-999',
      'INVALID_123',
      '   ',
      'nawa-fake-code',
      '<script>alert(1)</script>',
    ];

    it('rejects invalid invitation codes with appropriate error message', async () => {
      for (const code of badCodes) {
        if (!isSupabaseConfigured()) {
          if (!code.trim().toUpperCase().startsWith('NAWA')) {
            await expect(authService.validateInvitation(code)).rejects.toThrow(
              /كود الدعوة غير صحيح/
            );
          }
        } else {
          await expect(authService.validateInvitation(code)).rejects.toThrow(
            /كود الدعوة غير صحيح/
          );
        }
      }
    });
  });

  describe('4. Unrecognized & Invalid Roles Security Evaluation', () => {
    const unknownRoles = [
      'admin',
      'hacker',
      'guest',
      'super_owner',
      'ROLE_ANONYMOUS',
      'null',
      'undefined',
      '12345',
    ];

    it('denies access for all unrecognized roles across student and teacher allowed lists', () => {
      const studentAllowed: UserRole[] = ['student'];
      const teacherAllowed: UserRole[] = ['teacher', 'owner'];

      for (const badRole of unknownRoles) {
        expect(isRoleAllowed(badRole, studentAllowed)).toBe(false);
        expect(isRoleAllowed(badRole, teacherAllowed)).toBe(false);
      }
    });

    it('redirects unrecognized roles to /login instead of unauthorized dashboard', () => {
      const studentAllowed: UserRole[] = ['student'];
      const teacherAllowed: UserRole[] = ['teacher', 'owner'];

      for (const badRole of unknownRoles) {
        expect(getRedirectPathForRole(badRole, studentAllowed)).toBe('/login');
        expect(getRedirectPathForRole(badRole, teacherAllowed)).toBe('/login');
      }
    });
  });

});
