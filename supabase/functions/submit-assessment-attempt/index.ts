import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { attemptId, answers } = await req.json();

    // 1. Fetch attempt details
    const { data: attempt, error: attErr } = await supabaseClient
      .from('assessment_attempts')
      .select('*, assessments(*)')
      .eq('id', attemptId)
      .single();

    if (attErr || !attempt) throw new Error('الامتحان غير موجود أو غير ساري.');

    // 2. Fetch correct answers server-side
    const { data: questions } = await supabaseClient
      .from('questions')
      .select('id, correct_answer, points');

    let totalPoints = 0;
    let earnedPoints = 0;

    for (const q of questions || []) {
      totalPoints += q.points || 10;
      const studentAns = answers[q.id];
      const isCorrect = studentAns === q.correct_answer;

      if (isCorrect) {
        earnedPoints += q.points || 10;
      }

      // Record answer
      await supabaseClient.from('attempt_answers').upsert({
        attempt_id: attemptId,
        question_id: q.id,
        student_answer: studentAns,
        is_correct: isCorrect,
        points_awarded: isCorrect ? (q.points || 10) : 0,
      });
    }

    const finalPercentage = Math.round((earnedPoints / (totalPoints || 1)) * 100);
    const passed = finalPercentage >= (attempt.assessments?.passing_score || 70);

    // 3. Update Attempt Status
    await supabaseClient
      .from('assessment_attempts')
      .update({
        status: 'graded',
        score: finalPercentage,
        max_score: 100,
        submitted_at: new Date().toISOString(),
        graded_at: new Date().toISOString(),
      })
      .eq('id', attemptId);

    // 4. Award XP
    if (passed) {
      await supabaseClient.from('xp_transactions').insert({
        user_id: attempt.user_id,
        points: 100,
        event_type: 'exam_pass',
        source_id: attemptId,
        idempotency_key: `exam_${attemptId}`,
      });
    }

    return new Response(
      JSON.stringify({
        score: finalPercentage,
        passed,
        earnedPoints,
        totalPoints,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'حدث خطأ أثناء رصد نتيجة الامتحان.' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
