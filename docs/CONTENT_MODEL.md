# Content Model & Lesson Block Schema — نواة كود (nawa-code)

## 1. Lesson Block Architecture
Lessons are built using structured JSONB content blocks (`lesson_blocks`).

### Supported Block Types:
1. `rich_text`: Arabic explanatory text with inline formatting.
2. `heading`: Section divider with level (h2, h3).
3. `analogy`: Real-world Arabic analogy for technical concepts (e.g. comparing HTML tags to building bricks).
4. `note` / `tip` / `warning`: Highlighted informational callout banners.
5. `steps`: Ordered list of technical actions.
6. `code`: LTR code block with language syntax highlighting and line numbers.
7. `code_explanation`: Side-by-side line explanation of code snippets.
8. `live_playground`: Interactive inline editor and output preview.
9. `practice`: Embedded quick interactive coding challenge.
10. `common_mistakes`: Frequently encountered bugs and fix explanations.
11. `vocabulary`: Technical terms table (Arabic term — English equivalent).
12. `summary`: Key takeaways section at the end of the lesson.
13. `embedded_mastery`: Mandatory end-of-lesson understanding check gate.

## 2. Example Lesson Block Payload (JSONB)
```json
{
  "id": "blk_101",
  "block_type": "analogy",
  "content": {
    "title_ar": "تشبيه بسيط: هيكل البيت وصفحة الويب",
    "text_ar": "تخيل أن موقع الويب مثل البيت: HTML هي الجدران والهيكل الخرساني، CSS هي الدهانات والألوان، و JavaScript هي التوصيلات الكهربائية والأبواب الأوتوماتيكية.",
    "icon": "home"
  },
  "order_index": 1
}
```
