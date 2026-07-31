# Question Type Runtime Evidence — أدلة التشغيل الحية للأنواع الـ 24 للأسئلة

**تاريخ التقرير:** 30 يوليو 2026

---

## 1. تفاصيل التشغيل الفلي والتصحيح الآلي والتوافق مع الجوال

| # | نوع السؤال (Type ID) | المكون والمحرر | نموذج الإجابة | التصحيح الآلي | البديل باللمس للموبايل |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `single_choice` | `QuestionEditorModal` | إجابة فريدة | سيرفراتي | N/A |
| 2 | `multiple_choice` | `QuestionEditorModal` | إجابات متعددة | سيرفراتي | N/A |
| 3 | `true_false` | `QuestionEditorModal` | قيمة منطقية | سيرفراتي | N/A |
| 4 | `fill_blank` | `QuestionEditorModal` | نص مطابقة | سيرفراتي | N/A |
| 5 | `fill_multiple_blanks` | `QuestionEditorModal` | مصفوفة نصوص | سيرفراتي | N/A |
| 6 | `word_bank` | `WordBankRenderer` | بنك الكلمات | سيرفراتي | Tap to select |
| 7 | `drag_words_to_blanks` | `DragWordsRenderer` | سحب الكلمات | سيرفراتي | أزرار اللمس بدلاً من السحب |
| 8 | `short_answer` | `ShortAnswerRenderer` | إجابة قصيرة | سيرفراتي | N/A |
| 9 | `essay` | `EssayRenderer` | نص حاد | تصحيح يدوي المعلم | N/A |
| 10 | `matching` | `MatchingRenderer` | مطابقة أزواج | سيرفراتي | اختيار ثنائي باللمس |
| 11 | `ordering` | `OrderingRenderer` | ترتيب خطوات | سيرفراتي | أزرار لأعلى ولأسفل (Up/Down) |
| 12 | `arrange_code_lines` | `ArrangeCodeRenderer` | ترتيب كود | سيرفراتي | أزرار تحريك لأجهزة الجوال |
| 13 | `predict_code_output` | `PredictOutputRenderer` | التنبؤ بالخرج | سيرفراتي | N/A |
| 14 | `choose_correct_code` | `ChooseCodeRenderer` | اختيار الكود | سيرفراتي | N/A |
| 15 | `find_error` | `FindErrorRenderer` | اكتشاف الخلل | سيرفراتي | N/A |
| 16 | `correct_error` | `CorrectErrorRenderer` | إصلاح الكود | سيرفراتي | N/A |
| 17 | `code_completion` | `CompleteCodeRenderer` | إكمال الكود | سيرفراتي | N/A |
| 18 | `small_code_task` | `CodeTaskRenderer` | مهمة برمجية | بيئة اختبار تفاعلية | N/A |
| 19 | `visual_result_matching` | `VisualResultRenderer` | مطابقة بصرية | سيرفراتي | N/A |
| 20 | `choose_rendered_output` | `RenderedOutputRenderer` | اختيار الخرج | سيرفراتي | N/A |
| 21 | `categorization` | `CategorizationRenderer` | تصنيف المكونات | سيرفراتي | اختيار المجموعة باللمس |
| 22 | `flashcard` | `FlashcardRenderer` | بطاقة تفاعلية | تقييم ذاتي | قلّب باللمس |
| 23 | `timed_rapid_question` | `TimedRapidRenderer` | سؤال زمني | سيرفراتي | N/A |
| 24 | `multi_step_question` | `MultiStepRenderer` | متعدد الخطوات | سيرفراتي | N/A |
