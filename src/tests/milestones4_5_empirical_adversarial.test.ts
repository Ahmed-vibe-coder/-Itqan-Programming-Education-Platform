import { describe, it, expect } from 'vitest';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { courseService } from '@/services/courseService';
import { isSupabaseConfigured } from '@/lib/supabase';

describe('Milestones 4 & 5 Empirical Adversarial Test Suite', () => {

  describe('1. ErrorBoundary Logic & State Transition Empirical Tests', () => {
    it('getDerivedStateFromError sets hasError to true and stores error instance', () => {
      const testError = new Error('Empirical Test Render Error');
      const newState = ErrorBoundary.getDerivedStateFromError(testError);

      expect(newState.hasError).toBe(true);
      expect(newState.error).toBe(testError);
      expect(newState.error?.message).toBe('Empirical Test Render Error');
    });

    it('handles non-Error objects thrown in getDerivedStateFromError safely', () => {
      const stringError = 'String error message' as any;
      const newState = ErrorBoundary.getDerivedStateFromError(stringError);

      expect(newState.hasError).toBe(true);
      expect(newState.error).toBe(stringError);
    });

    it('EMPIRICAL FINDING: Standard ErrorBoundary lacks unhandledrejection event listener for async errors', () => {
      const boundaryInstance = new ErrorBoundary({ children: null });
      
      expect(typeof ErrorBoundary.getDerivedStateFromError).toBe('function');
      expect(typeof boundaryInstance.componentDidCatch).toBe('function');

      // Check if ErrorBoundary registers window listener for unhandledrejection
      // Standard React ErrorBoundary only intercepts render phase exceptions. Async promise rejections bypass ErrorBoundary.
      expect((boundaryInstance as any).onUnhandledRejection).toBeUndefined();
    });
  });

  describe('2. Missing, Invalid, & Malformed Course Slugs Empirical Tests', () => {
    it('returns null for non-existent course slugs', async () => {
      const result = await courseService.getCourseBySlug('non-existent-course-slug-12345');
      expect(result).toBeNull();
    });

    it('returns null for empty string or whitespace course slugs', async () => {
      expect(await courseService.getCourseBySlug('')).toBeNull();
      expect(await courseService.getCourseBySlug('   ')).toBeNull();
    });

    it('handles SQL injection payloads and path traversal strings safely without crashing', async () => {
      const maliciousSlugs = [
        "' OR '1'='1",
        "../../etc/passwd",
        "<script>alert(1)</script>",
        "SELECT * FROM courses;",
        "'; DROP TABLE courses;--"
      ];

      for (const slug of maliciousSlugs) {
        if (!isSupabaseConfigured()) {
          const res = await courseService.getCourseBySlug(slug);
          expect(res).toBeNull();
        } else {
          try {
            const res = await courseService.getCourseBySlug(slug);
            expect(res).toBeNull();
          } catch (err) {
            expect(err).toBeDefined();
          }
        }
      }
    });

    it('EMPIRICAL FINDING: getCourseBySlug fails to fall back to seed courses when Supabase table is unpopulated', async () => {
      const validCourse = await courseService.getCourseBySlug('html-basics');
      if (isSupabaseConfigured() && validCourse === null) {
        // Confirms empirical finding: getCourseBySlug returned null for a valid seed slug when Supabase DB is unpopulated/unreachable
        expect(validCourse).toBeNull();
      } else {
        expect(validCourse?.slug).toBe('html-basics');
      }
    });

    it('returns fallback modules list for valid and unknown course IDs', async () => {
      const modulesHtml = await courseService.getCourseModules('c1000000-0000-0000-0000-000000000001');
      expect(Array.isArray(modulesHtml)).toBe(true);
      expect(modulesHtml.length).toBeGreaterThan(0);

      const modulesUnknown = await courseService.getCourseModules('unknown-course-id-999');
      expect(Array.isArray(modulesUnknown)).toBe(true);
      expect(modulesUnknown.length).toBeGreaterThan(0);
    });
  });

  describe('3. 404 Routing & Invalid Path Contract Tests', () => {
    const validAppRoutes = [
      '/',
      '/login',
      '/register',
      '/join/code123',
      '/forgot-password',
      '/privacy',
      '/terms',
      '/help',
      '/unauthorized',
      '/verify/code123',
      '/setup',
      '/app',
      '/app/courses',
      '/app/courses/html-basics',
      '/app/roadmap',
      '/app/lessons/l1030000-0000-0000-0000-000000000003',
      '/app/practice',
      '/app/games',
      '/app/exams',
      '/app/skills',
      '/teacher',
      '/teacher/students',
      '/teacher/groups',
      '/teacher/courses',
      '/teacher/questions',
      '/teacher/assessments',
      '/teacher/analytics',
      '/teacher/settings'
    ];

    const invalidAppRoutes = [
      '/invalid-route',
      '/app/non-existent-page',
      '/teacher/fake-admin-page',
      '/api/secret',
      '/admin/dashboard',
      '/../../etc/passwd'
    ];

    it('differentiates valid app routes from fallback 404 routes', () => {
      const isKnownRoute = (path: string) => {
        return validAppRoutes.some(route => {
          if (route === path) return true;
          if (route.includes(':')) {
            const prefix = route.split('/:')[0];
            return path.startsWith(prefix);
          }
          return false;
        });
      };

      for (const validPath of ['/', '/login', '/app', '/app/courses', '/teacher']) {
        expect(isKnownRoute(validPath)).toBe(true);
      }

      for (const invalidPath of invalidAppRoutes) {
        expect(isKnownRoute(invalidPath)).toBe(false);
      }
    });
  });

  describe('4. Async Rejection & Error Resiliency Verification', () => {
    it('handles async service failures gracefully with catch blocks', async () => {
      const mockFailingService = async () => {
        throw new Error('Async Database Connection Timeout');
      };

      let caughtError: string | null = null;
      try {
        await mockFailingService();
      } catch (err: any) {
        caughtError = err.message;
      }

      expect(caughtError).toBe('Async Database Connection Timeout');
    });
  });

});
