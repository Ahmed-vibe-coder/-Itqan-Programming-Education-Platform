# Assessment Engine Specification — نواة كود (nawa-code)

## 1. Assessment Lifecycle & Attempt States

```
[Created] -> [In Progress] -> [Submitted] -> (Auto Graded) -> [Graded]
                                     \
                                      -> (Requires Manual) -> [Awaiting Manual] -> [Graded]
```

## 2. Server-Side Execution Rules
1. **No Early Key Exposure**: Answer keys (`correct_answer`) are NEVER sent to the client during an active attempt payload.
2. **Attempt Snapshots**: When a student starts an exam attempt, a deterministic snapshot of questions and randomized options is created and saved server-side.
3. **Autosave & Interruption Recovery**: Client answers are autosaved directly to `attempt_answers`. Network reconnection resumes the exact snapshot state.
4. **Authoritative Server Scoring**: Grading is performed strictly in Edge Functions or DB Functions (`submit-assessment-attempt`). Client-calculated scores are ignored.
5. **Idempotency**: Repeated submissions return the original calculated result without duplicating scores, XP, or analytics.
