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

    const { userId, lessonId, answers, nextLessonId } = await req.json();

    // 1. Fetch lesson mastery questions securely
    const { data: questions, error: qErr } = await supabaseClient
      .from('questions')
      .select('id, correct_answer')
      .eq('lesson_id', lessonId);

    if (qErr) throw qErr;

    // 2. Validate 100% score
    let passed = true;
    for (const q of questions || []) {
      if (answers[q.id] !== q.correct_answer) {
        passed = false;
        break;
      }
    }

    if (!passed) {
      return new Response(
        JSON.stringify({ passed: false, message: 'تحتاج بنسبة 100% لإتقان الدرس وتجاوز هذه المرحلة.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Mark current lesson completed
    await supabaseClient.from('lesson_progress').upsert(
      {
        user_id: userId,
        lesson_id: lessonId,
        status: 'completed',
        reading_progress: 100,
        mastery_passed_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,lesson_id' }
    );

    // 4. Unlock next lesson if provided
    if (nextLessonId) {
      await supabaseClient.from('lesson_progress').upsert(
        {
          user_id: userId,
          lesson_id: nextLessonId,
          status: 'available',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,lesson_id' }
      );
    }

    // 5. Award XP idempotently
    const idempotencyKey = `mastery_${userId}_${lessonId}`;
    await supabaseClient.from('xp_transactions').insert({
      user_id: userId,
      points: 25,
      event_type: 'mastery_pass',
      source_id: lessonId,
      idempotency_key: idempotencyKey,
    });

    return new Response(
      JSON.stringify({ passed: true, xpEarned: 25, message: 'تم إتقان الدرس وتجاوز المرحلة بنجاح!' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'حدث خطأ أثناء فحص إجابات الإتقان.' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
