# Question Type Implementation Matrix — مصفوفة تنفيذ وتصحيح الأنواع الـ 24 للأسئلة

**تاريخ التقرير:** 30 يوليو 2026

---

## مصفوفة حالة الأنواع الـ 24 المعتمدة (Question Types Matrix)

| # | معرف نوع السؤال | اسم النوع بالعربية | محرر المعلم | النموذج والمنطق | التصحيح الآلي الخادمي | التوافق مع الجوال واللمس |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `single_choice` | اختيار من متعدد (إجابة واحدة) | `QuestionEditorModal` | `SingleChoiceRenderer` | سيرفراتي | 100% |
| 2 | `multiple_choice` | اختيار من متعدد (عدة إجابات) | `QuestionEditorModal` | `MultipleChoiceRenderer` | سيرفراتي | 100% |
| 3 | `true_false` | صواب أم خطأ | `QuestionEditorModal` | `TrueFalseRenderer` | سيرفراتي | 100% |
| 4 | `fill_blank` | إكمال الفراغ | `QuestionEditorModal` | `FillBlankRenderer` | سيرفراتي | 100% |
| 5 | `fill_multiple_blanks` | إكمال الفراغات المتعددة | `QuestionEditorModal` | `FillMultipleBlanksRenderer` | سيرفراتي | 100% |
| 6 | `word_bank` | إكمال بنك الكلمات | `QuestionEditorModal` | `WordBankRenderer` | سيرفراتي | 100% (Tap / Drag) |
| 7 | `drag_words_to_blanks` | سحب الكلمات في الفراغات | `QuestionEditorModal` | `DragWordsRenderer` | سيرفراتي | 100% (Tap alternative) |
| 8 | `short_answer` | إجابة قصيرة | `QuestionEditorModal` | `ShortAnswerRenderer` | سيرفراتي | 100% |
| 9 | `essay` | سؤال مقالي | `QuestionEditorModal` | `EssayRenderer` | تصحيح يدوي المعلم | 100% |
| 10 | `matching` | مطابقة الأزواج | `QuestionEditorModal` | `MatchingRenderer` | سيرفراتي | 100% (Tap match) |
| 11 | `ordering` | ترتيب بالسحب والإفلات | `QuestionEditorModal` | `OrderingRenderer` | سيرفراتي | 100% (أزرار لأعلى ولأسفل) |
| 12 | `arrange_code_lines` | ترتيب أسطر الكود البرمجي | `QuestionEditorModal` | `ArrangeCodeRenderer` | سيرفراتي | 100% (Up/Down buttons) |
| 13 | `predict_code_output` | التنبؤ بنتيجة الكود | `QuestionEditorModal` | `PredictOutputRenderer` | سيرفراتي | 100% |
| 14 | `choose_correct_code` | اختيار الكود الصحيح | `QuestionEditorModal` | `ChooseCodeRenderer` | سيرفراتي | 100% |
| 15 | `find_error` | اكتشاف الخطأ في الكود | `QuestionEditorModal` | `FindErrorRenderer` | سيرفراتي | 100% |
| 16 | `correct_error` | تصحيح الخطأ البرمجي | `QuestionEditorModal` | `CorrectErrorRenderer` | سيرفراتي | 100% |
| 17 | `code_completion` | إكمال الكود المفقود | `QuestionEditorModal` | `CompleteCodeRenderer` | سيرفراتي | 100% |
| 18 | `small_code_task` | مهمة برمجية صغيرة | `QuestionEditorModal` | `CodeTaskRenderer` | اختباري آلي | 100% |
| 19 | `visual_result_matching` | مطابقة النتيجة البصرية | `QuestionEditorModal` | `VisualResultRenderer` | سيرفراتي | 100% |
| 20 | `choose_rendered_output` | اختيار الخرج المرسوم الصحيح | `QuestionEditorModal` | `RenderedOutputRenderer` | سيرفراتي | 100% |
| 21 | `categorization` | تصنيف المكونات البرمجية | `QuestionEditorModal` | `CategorizationRenderer` | سيرفراتي | 100% |
| 22 | `flashcard` | بطاقة مراجعة تفاعلية | `QuestionEditorModal` | `FlashcardRenderer` | مراجعة | 100% |
| 23 | `timed_rapid_question` | سؤال السريعة الزمني | `QuestionEditorModal` | `TimedRapidRenderer` | سيرفراتي | 100% |
| 24 | `multi_step_question` | سؤال متعدد الخطوات | `QuestionEditorModal` | `MultiStepRenderer` | سيرفراتي | 100% |
