# Implementation Plan — Milestone 4: Frontend Stability & Route Fixes

## Overview
This document provides precise, line-by-line file edit instructions and implementation specifications for Worker (Implementer) to resolve all stability issues, missing promise catch handlers, unhandled rejections, 404 routing, and missing error boundary components in Milestone 4.

---

## 1. Create `src/components/shared/ErrorBoundary.tsx`

**Path:** `d:\@vibcoding\ai\src\components\shared\ErrorBoundary.tsx`
**Action:** Create new file with class component implementing React Error Boundary.

```tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg flex items-center justify-center p-4 dir-rtl">
          <div className="max-w-md w-full bg-surface border border-bdr rounded-3xl p-8 text-center space-y-6 shadow-xl">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-txt-primary">حدث خطأ غير متوقع في الصفحة</h2>
              <p className="text-xs text-txt-muted leading-relaxed">
                نعتذر عن هذا الخطأ. تعذر عرض المكون المطلوب بسبب مشكلة أثناء التشغيل.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-surface-secondary border border-bdr rounded-xl text-right overflow-x-auto max-h-32">
                <p className="text-[11px] font-mono text-red-500 dir-ltr text-left">
                  {this.state.error.message || this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="px-4 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span>إعادة المحاولة</span>
              </button>

              <a
                href="/"
                className="px-4 py-2.5 bg-surface-secondary hover:bg-surface-secondary/80 border border-bdr text-txt-primary text-xs font-bold rounded-xl flex items-center gap-2 transition-all"
              >
                <Home className="w-4 h-4" />
                <span>الصفحة الرئيسية</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## 2. Create `src/features/public/pages/NotFoundPage.tsx`

**Path:** `d:\@vibcoding\ai\src\features\public\pages\NotFoundPage.tsx`
**Action:** Create new 404 Not Found Page component.

```tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-4 text-center dir-rtl">
      <div className="max-w-md w-full bg-surface border border-bdr rounded-3xl p-8 space-y-6 shadow-xl">
        <div className="flex justify-center">
          <Logo size="md" />
        </div>

        <div className="w-20 h-20 bg-brand-primary/10 text-brand-primary rounded-3xl flex items-center justify-center mx-auto">
          <FileQuestion className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl font-extrabold font-mono text-brand-primary">404</span>
          <h1 className="text-2xl font-bold text-txt-primary">الصفحة غير موجودة</h1>
          <p className="text-xs text-txt-muted leading-relaxed">
            عذراً، الرابط الذي حاولت الوصول إليه غير موجود أو تم نقله إلى مكان آخر.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            to="/app"
            className="px-5 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>لوحة التحكم</span>
          </Link>

          <Link
            to="/"
            className="px-5 py-2.5 bg-surface-secondary border border-bdr text-txt-primary hover:text-brand-primary text-xs font-bold rounded-xl flex items-center gap-2 transition-all"
          >
            <span>الصفحة الرئيسية</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
```

---

## 3. Wrap `<AppRouter />` with `<ErrorBoundary>` in `src/App.tsx`

**Path:** `d:\@vibcoding\ai\src\App.tsx`
**Action:** Replace lines 1-14 with ErrorBoundary wrapping.

### Target Content:
```tsx
import React from 'react';
import { ThemeProvider } from '@/app/providers/ThemeProvider';
import { AuthProvider } from '@/app/providers/AuthProvider';
import { AppRouter } from '@/app/router/AppRouter';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ThemeProvider>
  );
};
```

### Replacement Content:
```tsx
import React from 'react';
import { ThemeProvider } from '@/app/providers/ThemeProvider';
import { AuthProvider } from '@/app/providers/AuthProvider';
import { AppRouter } from '@/app/router/AppRouter';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};
```

---

## 4. Integrate NotFoundPage into `src/app/router/AppRouter.tsx`

**Path:** `d:\@vibcoding\ai\src\app\router\AppRouter.tsx`
**Action:** Lazy import `NotFoundPage` and update wildcard route `*`.

### Chunk 1 (Import):
**Start Line:** 20
**End Line:** 21

#### Target Content:
```tsx
const UnauthorizedPage = lazy(() => import('@/features/public/pages/UnauthorizedPage').then(m => ({ default: m.UnauthorizedPage })));
```

#### Replacement Content:
```tsx
const UnauthorizedPage = lazy(() => import('@/features/public/pages/UnauthorizedPage').then(m => ({ default: m.UnauthorizedPage })));
const NotFoundPage = lazy(() => import('@/features/public/pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));
```

### Chunk 2 (Wildcard Route):
**Start Line:** 184
**End Line:** 186

#### Target Content:
```tsx
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
```

#### Replacement Content:
```tsx
          {/* Fallback */}
          <Route path="*" element={<NotFoundPage />} />
```

---

## 5. Fix Unhandled Promise Rejections & Error States in `CourseCatalogPage.tsx`

**Path:** `d:\@vibcoding\ai\src\features\courses\pages\CourseCatalogPage.tsx`
**Action:** Replace unhandled `.then()` with error state and `.catch()` handling, plus error and empty UI states.

### Target Content (Lines 1-63):
```tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '@/services/courseService';
import { Course } from '@/types/database';
import { BookOpen, ArrowLeft, Clock, Sparkles } from 'lucide-react';

export const CourseCatalogPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    courseService.getPublishedCourses().then((data) => {
      setCourses(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between border-b border-bdr pb-4">
        <div>
          <h1 className="text-2xl font-bold text-txt-primary">المناهج والكورسات المتاحة</h1>
          <p className="text-xs text-txt-muted">اختر المنهج الدراسي واستكمل الشرح والتطبيق العملي</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-surface border border-bdr rounded-2xl animate-pulse p-6" />
          ))}
        </div>
      ) : (
```

### Replacement Content:
```tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '@/services/courseService';
import { Course } from '@/types/database';
import { BookOpen, ArrowLeft, Clock, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

export const CourseCatalogPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = () => {
    setLoading(true);
    setError(null);
    courseService
      .getPublishedCourses()
      .then((data) => {
        setCourses(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching courses:', err);
        setError(err?.message || 'حدث خطأ أثناء تحميل الكورسات. يرجى المحاولة مرة أخرى.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between border-b border-bdr pb-4">
        <div>
          <h1 className="text-2xl font-bold text-txt-primary">المناهج والكورسات المتاحة</h1>
          <p className="text-xs text-txt-muted">اختر المنهج الدراسي واستكمل الشرح والتطبيق العملي</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-surface border border-bdr rounded-2xl animate-pulse p-6" />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 border border-red-500/20 bg-red-500/10 rounded-2xl text-center space-y-4 max-w-md mx-auto">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <p className="text-sm font-bold text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={fetchCourses}
            className="px-4 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl flex items-center gap-2 mx-auto transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>إعادة المحاولة</span>
          </button>
        </div>
      ) : courses.length === 0 ? (
        <div className="p-8 border border-bdr bg-surface rounded-2xl text-center space-y-3 max-w-md mx-auto">
          <BookOpen className="w-10 h-10 text-txt-muted mx-auto" />
          <h3 className="font-bold text-base text-txt-primary">لا توجد مناهج متاحة حالياً</h3>
          <p className="text-xs text-txt-muted">سيتم إضافة مناهج دورية قريباً.</p>
        </div>
      ) : (
```

---

## 6. Fix 404 / Missing Course & Promise Rejection in `CourseDetailPage.tsx`

**Path:** `d:\@vibcoding\ai\src\features\courses\pages\CourseDetailPage.tsx`
**Action:** Refactor data fetching to include `loading`, `error`, `.catch()` handlers, and render an explicit 404 Course Not Found state UI when `course` is `null`.

### Target Content (Lines 1-30):
```tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseService } from '@/services/courseService';
import { Course, Module } from '@/types/database';
import { BookOpen, CheckCircle2, Lock, Play, ArrowRight, Clock } from 'lucide-react';

export const CourseDetailPage: React.FC = () => {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    if (courseSlug) {
      courseService.getCourseBySlug(courseSlug).then((c) => {
        if (c) {
          setCourse(c);
          courseService.getCourseModules(c.id).then(setModules);
        }
      });
    }
  }, [courseSlug]);

  if (!course) {
    return (
      <div className="text-center py-12 space-y-3">
        <p className="text-sm text-txt-muted">جاري تحميل تفاصيل المنهج...</p>
      </div>
    );
  }
```

### Replacement Content:
```tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseService } from '@/services/courseService';
import { Course, Module } from '@/types/database';
import { BookOpen, CheckCircle2, Lock, Play, ArrowRight, Clock, AlertCircle, RefreshCw, FileQuestion } from 'lucide-react';

export const CourseDetailPage: React.FC = () => {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourseData = () => {
    if (!courseSlug) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    courseService
      .getCourseBySlug(courseSlug)
      .then(async (c) => {
        if (!c) {
          setCourse(null);
          setLoading(false);
          return;
        }
        setCourse(c);
        try {
          const mods = await courseService.getCourseModules(c.id);
          setModules(mods || []);
        } catch (mErr) {
          console.error('Error loading course modules:', mErr);
          setModules([]);
        } finally {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching course by slug:', err);
        setError('حدث خطأ أثناء تحميل تفاصيل المنهج. يرجى المحاولة لاحقاً.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCourseData();
  }, [courseSlug]);

  if (loading) {
    return (
      <div className="text-center py-16 space-y-4">
        <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-txt-muted font-medium">جاري تحميل تفاصيل المنهج...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 border border-red-500/20 bg-red-500/10 rounded-2xl text-center space-y-4 max-w-md mx-auto my-8">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
        <p className="text-sm font-bold text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={fetchCourseData}
          className="px-4 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl flex items-center gap-2 mx-auto transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          <span>إعادة المحاولة</span>
        </button>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-8 border border-bdr bg-surface rounded-3xl text-center space-y-5 max-w-md mx-auto my-8 shadow-sm">
        <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center mx-auto">
          <FileQuestion className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-txt-primary">المنهج غير موجود</h2>
          <p className="text-xs text-txt-muted leading-relaxed">
            عذراً، المنهج الدراسي الذي تبحث عنه غير موجود أو تم إزالته.
          </p>
        </div>
        <Link
          to="/app/courses"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold rounded-xl transition-all shadow-sm"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة لقائمة المناهج</span>
        </Link>
      </div>
    );
  }
```

---

## 7. Additional Promise Safety Adjustments

In `MistakeNotebookPage.tsx`, `ReviewCenterPage.tsx`, `SkillMapPage.tsx`, and `TeacherAttentionPage.tsx`:
Add `.catch((err) => console.error(err))` to prevent unhandled promise rejections on async fetches.
