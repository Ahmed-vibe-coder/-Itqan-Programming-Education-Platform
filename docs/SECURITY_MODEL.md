# Security Model & Playground Isolation — نواة كود (nawa-code)

## 1. Playground Security (Sandboxed iframe)
Student-generated HTML/CSS/JS execution occurs inside a isolated iframe with strict sandbox constraints:

```html
<iframe
  sandbox="allow-scripts"
  csp="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline';"
  srcdoc="..."
></iframe>
```
- `allow-same-origin` is omitted to prevent access to parent DOM, local storage, cookies, or Supabase JWT tokens.
- Cross-frame communication uses `window.postMessage` with strict origin and shape validation.

## 2. Row Level Security (RLS) Principles
- **Students**: Can read only assigned published courses/lessons. Can read/write ONLY their own `lesson_progress`, `code_workspaces`, `student_notes`, `bookmarks`, and `assessment_attempts`.
- **Teachers**: Can read and write assigned groups, students, courses, questions, and attempt evaluations.
- **Owners**: Full system access.

## 3. First Owner Setup Security
- `/setup` route verifies server-side if an owner already exists in `user_roles`.
- If an owner exists, `/setup` immediately rejects requests and redirects to `/login`.
