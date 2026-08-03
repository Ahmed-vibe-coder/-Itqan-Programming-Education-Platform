import { describe, it, expect } from 'vitest';
import { UserRole } from '@/types/database';
import { isRoleAllowed, getRedirectPathForRole } from '@/app/guards/RoleGuard';

describe('Security & Role Access Tests', () => {
  it('blocks student role from accessing teacher routes', () => {
    const userRole: UserRole = 'student';
    const teacherAllowedRoles: UserRole[] = ['owner', 'teacher'];

    const hasAccess = isRoleAllowed(userRole, teacherAllowedRoles);
    expect(hasAccess).toBe(false);
  });

  it('allows teacher and owner roles to access teacher routes', () => {
    const teacherRole: UserRole = 'teacher';
    const ownerRole: UserRole = 'owner';
    const teacherAllowedRoles: UserRole[] = ['owner', 'teacher'];

    expect(isRoleAllowed(teacherRole, teacherAllowedRoles)).toBe(true);
    expect(isRoleAllowed(ownerRole, teacherAllowedRoles)).toBe(true);
  });

  it('redirects unauthorized student to /app when accessing teacher routes', () => {
    const redirectPath = getRedirectPathForRole('student', ['owner', 'teacher']);
    expect(redirectPath).toBe('/app');
  });

  it('redirects unauthorized teacher to /teacher when accessing student routes', () => {
    const redirectPath = getRedirectPathForRole('teacher', ['student']);
    expect(redirectPath).toBe('/teacher');
  });

  it('redirects null, undefined, or unrecognized roles to /login', () => {
    expect(getRedirectPathForRole(null, ['student'])).toBe('/login');
    expect(getRedirectPathForRole(undefined, ['owner', 'teacher'])).toBe('/login');
    expect(getRedirectPathForRole('unknown_role', ['student'])).toBe('/login');
    expect(isRoleAllowed('unknown_role', ['student'])).toBe(false);
  });
});
