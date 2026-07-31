import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SetupGuard } from '@/app/guards/SetupGuard';
import { RoleGuard } from '@/app/guards/RoleGuard';

import { StudentLayout } from '@/app/layouts/StudentLayout';
import { TeacherLayout } from '@/app/layouts/TeacherLayout';

// Public & Auth Pages
const LandingPage = lazy(() => import('@/features/landing/pages/LandingPage').then(m => ({ default: m.LandingPage })));
const SetupPage = lazy(() => import('@/features/auth/pages/SetupPage').then(m => ({ default: m.SetupPage })));
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
const JoinPage = lazy(() => import('@/features/auth/pages/JoinPage').then(m => ({ default: m.JoinPage })));
const ForgotPasswordPage = lazy(() => import('@/features/auth/pages/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));

const PrivacyPage = lazy(() => import('@/features/public/pages/PrivacyPage').then(m => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import('@/features/public/pages/TermsPage').then(m => ({ default: m.TermsPage })));
const HelpPage = lazy(() => import('@/features/public/pages/HelpPage').then(m => ({ default: m.HelpPage })));
const UnauthorizedPage = lazy(() => import('@/features/public/pages/UnauthorizedPage').then(m => ({ default: m.UnauthorizedPage })));

// Certificates Public Verification
const CertificateVerificationPage = lazy(() => import('@/features/certificates/pages/CertificateVerificationPage').then(m => ({ default: m.CertificateVerificationPage })));

// Enhanced Student Experience Pages
const OnboardingPage = lazy(() => import('@/features/onboarding/pages/OnboardingPage').then(m => ({ default: m.OnboardingPage })));
const PlacementPage = lazy(() => import('@/features/placement/pages/PlacementPage').then(m => ({ default: m.PlacementPage })));
const StudentDashboard = lazy(() => import('@/features/dashboard/pages/StudentDashboard').then(m => ({ default: m.StudentDashboard })));
const CourseCatalogPage = lazy(() => import('@/features/courses/pages/CourseCatalogPage').then(m => ({ default: m.CourseCatalogPage })));
const CourseDetailPage = lazy(() => import('@/features/courses/pages/CourseDetailPage').then(m => ({ default: m.CourseDetailPage })));
const PersonalRoadmapPage = lazy(() => import('@/features/learning/pages/PersonalRoadmapPage').then(m => ({ default: m.PersonalRoadmapPage })));
const LessonPage = lazy(() => import('@/features/lessons/pages/LessonPage').then(m => ({ default: m.LessonPage })));
const PracticeCatalogPage = lazy(() => import('@/features/practice/pages/PracticeCatalogPage').then(m => ({ default: m.PracticeCatalogPage })));
const MicroLearningGamesPage = lazy(() => import('@/features/practice/pages/MicroLearningGamesPage').then(m => ({ default: m.MicroLearningGamesPage })));
const ExamLaunchPage = lazy(() => import('@/features/assessments/pages/ExamLaunchPage').then(m => ({ default: m.ExamLaunchPage })));
const ExamPage = lazy(() => import('@/features/assessments/pages/ExamPage').then(m => ({ default: m.ExamPage })));
const ExamResultPage = lazy(() => import('@/features/assessments/pages/ExamResultPage').then(m => ({ default: m.ExamResultPage })));
const SkillMapPage = lazy(() => import('@/features/skills/pages/SkillMapPage').then(m => ({ default: m.SkillMapPage })));
const MistakeNotebookPage = lazy(() => import('@/features/learning/pages/MistakeNotebookPage').then(m => ({ default: m.MistakeNotebookPage })));
const ReviewCenterPage = lazy(() => import('@/features/learning/pages/ReviewCenterPage').then(m => ({ default: m.ReviewCenterPage })));
const ProjectsPage = lazy(() => import('@/features/projects/pages/ProjectsPage').then(m => ({ default: m.ProjectsPage })));
const MissionsPage = lazy(() => import('@/features/gamification/pages/MissionsPage').then(m => ({ default: m.MissionsPage })));
const AchievementsPage = lazy(() => import('@/features/gamification/pages/AchievementsPage').then(m => ({ default: m.AchievementsPage })));
const LeaderboardPage = lazy(() => import('@/features/gamification/pages/LeaderboardPage').then(m => ({ default: m.LeaderboardPage })));
const BookmarksPage = lazy(() => import('@/features/learning/pages/BookmarksPage').then(m => ({ default: m.BookmarksPage })));
const StudentNotesPage = lazy(() => import('@/features/learning/pages/StudentNotesPage').then(m => ({ default: m.StudentNotesPage })));
const NotificationsPage = lazy(() => import('@/features/notifications/pages/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const StudentProfilePage = lazy(() => import('@/features/profile/pages/StudentProfilePage').then(m => ({ default: m.StudentProfilePage })));
const StudentCalendarPage = lazy(() => import('@/features/learning/pages/StudentCalendarPage').then(m => ({ default: m.StudentCalendarPage })));

// Enhanced Teacher Experience Pages
const TeacherDashboard = lazy(() => import('@/features/teacher/pages/TeacherDashboard').then(m => ({ default: m.TeacherDashboard })));
const TeacherAttentionPage = lazy(() => import('@/features/teacher/pages/TeacherAttentionPage').then(m => ({ default: m.TeacherAttentionPage })));
const StudentDirectoryPage = lazy(() => import('@/features/teacher/pages/StudentDirectoryPage').then(m => ({ default: m.StudentDirectoryPage })));
const GroupManagementPage = lazy(() => import('@/features/teacher/pages/GroupManagementPage').then(m => ({ default: m.GroupManagementPage })));
const CourseBuilderPage = lazy(() => import('@/features/teacher/pages/CourseBuilderPage').then(m => ({ default: m.CourseBuilderPage })));
const QuestionBankPage = lazy(() => import('@/features/teacher/pages/QuestionBankPage').then(m => ({ default: m.QuestionBankPage })));
const AIAssistantPage = lazy(() => import('@/features/teacher/pages/AIAssistantPage').then(m => ({ default: m.AIAssistantPage })));
const AIAdminCenterPage = lazy(() => import('@/features/teacher/pages/AIAdminCenterPage').then(m => ({ default: m.AIAdminCenterPage })));
const ExamBuilderPage = lazy(() => import('@/features/teacher/pages/ExamBuilderPage').then(m => ({ default: m.ExamBuilderPage })));
const ContentCalendarPage = lazy(() => import('@/features/teacher/pages/ContentCalendarPage').then(m => ({ default: m.ContentCalendarPage })));
const GradingQueuePage = lazy(() => import('@/features/teacher/pages/GradingQueuePage').then(m => ({ default: m.GradingQueuePage })));
const TeacherAnalyticsPage = lazy(() => import('@/features/teacher/pages/TeacherAnalyticsPage').then(m => ({ default: m.TeacherAnalyticsPage })));
const ImportExportPage = lazy(() => import('@/features/teacher/pages/ImportExportPage').then(m => ({ default: m.ImportExportPage })));
const AuditLogsPage = lazy(() => import('@/features/teacher/pages/AuditLogsPage').then(m => ({ default: m.AuditLogsPage })));
const TeacherInvitationsPage = lazy(() => import('@/features/teacher/pages/TeacherInvitationsPage').then(m => ({ default: m.TeacherInvitationsPage })));
const PlatformSettingsPage = lazy(() => import('@/features/teacher/pages/PlatformSettingsPage').then(m => ({ default: m.PlatformSettingsPage })));
const CertificateManagementPage = lazy(() => import('@/features/teacher/pages/CertificateManagementPage').then(m => ({ default: m.CertificateManagementPage })));
const SystemHealthPage = lazy(() => import('@/features/teacher/pages/SystemHealthPage').then(m => ({ default: m.SystemHealthPage })));

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-bg">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      <span className="text-xs text-txt-muted font-medium">جاري تحميل الصفحة...</span>
    </div>
  </div>
);

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/join/:invitationCode" element={<JoinPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Public Certificate Verification Route */}
          <Route path="/verify/:verificationCode" element={<CertificateVerificationPage />} />

          {/* First Owner Setup */}
          <Route element={<SetupGuard />}>
            <Route path="/setup" element={<SetupPage />} />
          </Route>

          {/* Protected Student Routes */}
          <Route element={<RoleGuard allowedRoles={['student']} />}>
            <Route path="/app/onboarding" element={<OnboardingPage />} />
            <Route path="/app/placement" element={<PlacementPage />} />

            <Route element={<StudentLayout />}>
              <Route path="/app" element={<StudentDashboard />} />
              <Route path="/app/courses" element={<CourseCatalogPage />} />
              <Route path="/app/courses/:courseSlug" element={<CourseDetailPage />} />
              <Route path="/app/roadmap" element={<PersonalRoadmapPage />} />
              <Route path="/app/lessons/:lessonId" element={<LessonPage />} />
              <Route path="/app/practice" element={<PracticeCatalogPage />} />
              <Route path="/app/games" element={<MicroLearningGamesPage />} />
              <Route path="/app/exams" element={<ExamLaunchPage />} />
              <Route path="/app/exams/:assessmentId" element={<ExamLaunchPage />} />
              <Route path="/app/exams/:assessmentId/take" element={<ExamPage />} />
              <Route path="/app/results/:attemptId" element={<ExamResultPage />} />
              <Route path="/app/review/:attemptId" element={<ExamResultPage />} />
              <Route path="/app/skills" element={<SkillMapPage />} />
              <Route path="/app/mistakes" element={<MistakeNotebookPage />} />
              <Route path="/app/review-center" element={<ReviewCenterPage />} />
              <Route path="/app/projects" element={<ProjectsPage />} />
              <Route path="/app/missions" element={<MissionsPage />} />
              <Route path="/app/calendar" element={<StudentCalendarPage />} />
              <Route path="/app/progress" element={<StudentDashboard />} />
              <Route path="/app/achievements" element={<AchievementsPage />} />
              <Route path="/app/leaderboard" element={<LeaderboardPage />} />
              <Route path="/app/bookmarks" element={<BookmarksPage />} />
              <Route path="/app/notes" element={<StudentNotesPage />} />
              <Route path="/app/notifications" element={<NotificationsPage />} />
              <Route path="/app/profile" element={<StudentProfilePage />} />
              <Route path="/app/settings" element={<StudentProfilePage />} />
            </Route>
          </Route>

          {/* Protected Teacher Routes */}
          <Route element={<RoleGuard allowedRoles={['owner', 'teacher']} />}>
            <Route element={<TeacherLayout />}>
              <Route path="/teacher" element={<TeacherDashboard />} />
              <Route path="/teacher/attention" element={<TeacherAttentionPage />} />
              <Route path="/teacher/students" element={<StudentDirectoryPage />} />
              <Route path="/teacher/students/:studentId" element={<StudentDirectoryPage />} />
              <Route path="/teacher/students/new" element={<StudentDirectoryPage />} />
              <Route path="/teacher/groups" element={<GroupManagementPage />} />
              <Route path="/teacher/groups/:groupId" element={<GroupManagementPage />} />
              <Route path="/teacher/groups/new" element={<GroupManagementPage />} />
              <Route path="/teacher/invitations" element={<TeacherInvitationsPage />} />
              <Route path="/teacher/help-requests" element={<TeacherAttentionPage />} />
              <Route path="/teacher/courses" element={<CourseBuilderPage />} />
              <Route path="/teacher/modules" element={<CourseBuilderPage />} />
              <Route path="/teacher/lessons" element={<CourseBuilderPage />} />
              <Route path="/teacher/lessons/new" element={<CourseBuilderPage />} />
              <Route path="/teacher/projects" element={<CourseBuilderPage />} />
              <Route path="/teacher/content/review" element={<CourseBuilderPage />} />
              <Route path="/teacher/questions" element={<QuestionBankPage />} />
              <Route path="/teacher/questions/new" element={<QuestionBankPage />} />
              <Route path="/teacher/questions/ai" element={<AIAssistantPage />} />
              <Route path="/teacher/ai" element={<AIAdminCenterPage />} />
              <Route path="/teacher/certificates" element={<CertificateManagementPage />} />
              <Route path="/teacher/system-health" element={<SystemHealthPage />} />
              <Route path="/teacher/assessments" element={<ExamBuilderPage />} />
              <Route path="/teacher/assessments/builder" element={<ExamBuilderPage />} />
              <Route path="/teacher/assessments/new" element={<ExamBuilderPage />} />
              <Route path="/teacher/assessments/results" element={<TeacherAnalyticsPage />} />
              <Route path="/teacher/grading" element={<GradingQueuePage />} />
              <Route path="/teacher/analytics" element={<TeacherAnalyticsPage />} />
              <Route path="/teacher/analytics/groups" element={<TeacherAnalyticsPage />} />
              <Route path="/teacher/analytics/questions" element={<QuestionBankPage />} />
              <Route path="/teacher/analytics/concepts" element={<TeacherAnalyticsPage />} />
              <Route path="/teacher/analytics/activity" element={<AuditLogsPage />} />
              <Route path="/teacher/notifications" element={<TeacherAttentionPage />} />
              <Route path="/teacher/calendar" element={<ContentCalendarPage />} />
              <Route path="/teacher/content/import-export" element={<ImportExportPage />} />
              <Route path="/teacher/audit" element={<AuditLogsPage />} />
              <Route path="/teacher/settings" element={<PlatformSettingsPage />} />
              <Route path="/teacher/settings/ai" element={<AIAdminCenterPage />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};
