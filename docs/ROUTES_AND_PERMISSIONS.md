# Routes & Permissions Map — نواة كود (nawa-code)

## 1. Public Routes
- `/`: Landing page (overview, FAQ, join CTA, path roadmap)
- `/setup`: First owner setup flow (disabled once owner exists)
- `/login`: Unified student & teacher login
- `/register`: Invitation redemption registration
- `/join/:invitationCode`: Direct invitation link handler
- `/forgot-password`: Password reset request
- `/reset-password`: Password reset execution
- `/privacy`: Platform privacy policy
- `/terms`: Terms of use
- `/help`: Help desk & contact info

## 2. Protected Student Routes (`/app/*`)
- `/app`: Student Dashboard (Continue learning, current streak, active goals, next steps)
- `/app/courses`: Available & assigned course paths
- `/app/courses/:courseSlug`: Course details & curriculum tree
- `/app/modules/:moduleId`: Module overview & lessons list
- `/app/lessons/:lessonId`: Lesson Workspace (Block reader, Playground, Mastery Gate)
- `/app/practice`: Practice activities catalog
- `/app/exams`: Assigned assessments & quizzes
- `/app/exams/:assessmentId`: Exam instructions & launch page
- `/app/exams/:assessmentId/take`: Active timed assessment interface
- `/app/results/:attemptId`: Instant result summary
- `/app/review/:attemptId`: Review missed answers & explanations
- `/app/progress`: Detailed progress analytics & skill tree
- `/app/achievements`: Student badges, streak history, & XP level
- `/app/leaderboard`: Group-scoped leaderboard (privacy-safe names)
- `/app/bookmarks`: Saved lessons & code snippets
- `/app/notes`: Personal student study notes
- `/app/notifications`: Student notifications & announcements center
- `/app/profile`: Student profile avatar & safe settings

## 3. Protected Teacher Routes (`/teacher/*`)
- `/teacher`: Operational Teacher Dashboard (Alerts, grading queue, quick stats)
- `/teacher/students`: Student directory, activity, & registration management
- `/teacher/students/:studentId`: Student detailed profile & progress log
- `/teacher/groups`: Group management & invitation code generator
- `/teacher/courses`: Course CMS overview
- `/teacher/courses/:courseId/builder`: Course, module, & lesson hierarchy editor
- `/teacher/lessons/:lessonId/editor`: Visual lesson block & practice editor
- `/teacher/questions`: Centralized Question Bank
- `/teacher/questions/new`: Create new multi-type question
- `/teacher/assessments`: Assessment builder & exam configuration
- `/teacher/grading`: Manual essay & code grading queue
- `/teacher/analytics`: Group performance, bottlenecks, & concept difficulty report
- `/teacher/notifications`: Group announcement broadcast tool
- `/teacher/content/import-export`: JSON package import/export manager
- `/teacher/audit`: Security & administrative audit log (Owner/Teacher)
- `/teacher/settings`: Platform branding, teacher profile, & AI settings
