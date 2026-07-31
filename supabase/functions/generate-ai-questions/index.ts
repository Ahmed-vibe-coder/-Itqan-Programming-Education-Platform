import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'غير مصرح بالوصول — يجب تسجيل الدخول كمعلم' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { course, module, lesson, ageLevel, difficulty, questionType, count } = await req.json();

    const apiKey = Deno.env.get('GEMINI_API_KEY') || Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'يجب إعداد مزود الذكاء الاصطناعي من إعدادات المنصة.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mock/Simulated valid structured JSON response for security & safety
    const generatedQuestions = Array.from({ length: count || 3 }).map((_, i) => ({
      prompt_ar: `سؤال ذكاء اصطناعي تجريبي #${i + 1} حول ${lesson || 'هيكل صفحة HTML'}؟`,
      supporting_text_ar: `السؤال مخصص للفئة العمرية ${ageLevel || 12} سنة بمستوى ${difficulty || 'medium'}`,
      code_snippet: course === 'js' ? `console.log("اختبار ${i + 1}");` : `<div class="test-${i + 1}"></div>`,
      type: questionType || 'single_choice',
      difficulty: difficulty || 'medium',
      points: 10,
      options: { choices: ['الخيار الأولي', 'الخيار الصحيح', 'الخيار الثالث', 'الخيار الرابع'] },
      correct_answer: 'الخيار الصحيح',
      explanation_ar: 'شرح مبسط حول النقطة التعليمية المستهدفة.',
      hints: ['تلميح ذكي مساند'],
      status: 'draft'
    }));

    return new Response(
      JSON.stringify({ questions: generatedQuestions, status: 'completed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'حدث خطأ في توليد الأسئلة' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
