# Enhancement Architecture & Differentiation Model — نواة كود (nawa-code)

**تاريخ التوثيق والتطوير**: 30 يوليو 2026  
**الهدف المعماري**: تحويل المنصة إلى مساحة تدريب برمجي شخصية متميزة للناشئين (10 - 15 سنة).

---

## 1. الهيكل الهندسي للمزايا المستحدثة

```mermaid
graph TD
    A[Student Login] --> B[Onboarding / Placement]
    B --> C[Personal Roadmap & Skill Map]
    C --> D[Lesson Workspace & Interactive Code Lab]
    D --> E[100% Mastery Gate]
    E --> F[Mistake Notebook & Spaced Review Queue]
    F --> G[Capstone Projects & Portfolio]
    
    H[Teacher Dashboard] --> I[Teacher Attention Center]
    I --> J[Question Analytics & Concept Heatmap]
    J --> K[Content Quality Checker & Grading Queue]
```

---

## 2. المسارات والخدمات المضافة
- **Onboarding & Placement**: `OnboardingPage.tsx`, `PlacementPage.tsx`, `onboardingService.ts`.
- **Roadmap & Skill Map**: `PersonalRoadmapPage.tsx`, `SkillMapPage.tsx`, `skillService.ts`.
- **Mistake Notebook & Spaced Review**: `MistakeNotebookPage.tsx`, `ReviewCenterPage.tsx`, `mistakeService.ts`, `reviewService.ts`.
- **Projects & Portfolio**: `ProjectsPage.tsx`, `projectService.ts`.
- **Missions & Calendar**: `MissionsPage.tsx`, `StudentCalendarPage.tsx`.
- **Teacher Attention Center**: `TeacherAttentionPage.tsx`, `attentionService.ts`.
