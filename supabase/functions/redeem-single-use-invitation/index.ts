import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function normalizeArabicText(str: string): string {
  if (!str) return '';
  let res = str.trim().toLowerCase();
  res = res.replace(/[أإآآ]/g, 'ا');
  res = res.replace(/[ى]/g, 'ي');
  res = res.replace(/[ة]/g, 'ه');
  res = res.replace(/[\u064B-\u0652]/g, '');
  res = res.replace(/\s+/g, ' ');
  return res;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { code, studentFullName, username, password } = await req.json();

    if (!code || !studentFullName || !username || !password) {
      return new Response(
        JSON.stringify({ error: 'يرجى إكمال جميع البيانات المطلوبة (رمز الدعوة، الاسم الثلاثي، اسم المستخدم، كلمة السر)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 1. Fetch & Validate Single-Use Invitation
    const { data: inv, error: invErr } = await supabaseAdmin
      .from('single_use_invitations')
      .select('*')
      .eq('code', code)
      .single();

    if (invErr || !inv) {
      return new Response(
        JSON.stringify({ error: 'رمز الدعوة غير صحيح أو غير موجود' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!inv.is_active || inv.status !== 'active' || inv.used_count >= 1) {
      return new Response(
        JSON.stringify({ error: 'عذراً، هذا الكود تم استخدامه سابقاً أو أنه ملغى' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (inv.expires_at && new Date(inv.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ error: 'عذراً، انتهت صلاحية كود الدعوة هذا' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Normalize and compare full name
    const normalizedInputName = normalizeArabicText(studentFullName);
    const normalizedExpectedName = inv.normalized_expected_name || normalizeArabicText(inv.expected_full_name);

    if (normalizedInputName !== normalizedExpectedName) {
      return new Response(
        JSON.stringify({ error: 'الاسم المدخل لا يطابق الاسم المسجل بكود الدعوة. اكتب اسمك كما سجله المدرس.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Create Auth User using internal mapped email
    const internalEmail = `${username.toLowerCase().trim()}@itqan.edu.internal`;
    const { data: authUser, error: authErr } = await supabaseAdmin.auth.admin.createUser({
      email: internalEmail,
      password: password,
      email_confirm: true,
      user_metadata: { full_name: studentFullName, username: username }
    });

    if (authErr || !authUser.user) {
      return new Response(
        JSON.stringify({ error: authErr?.message || 'اسم المستخدم مستخدم بالفعل، اختر اسماً آخر' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = authUser.user.id;

    // 4. Create Profile & Assign Role
    await supabaseAdmin.from('profiles').insert({
      id: userId,
      full_name: studentFullName,
      username: username,
      age: 12
    });

    await supabaseAdmin.from('user_roles').insert({
      user_id: userId,
      role: 'student'
    });

    // 5. Add Group Membership
    if (inv.group_id) {
      await supabaseAdmin.from('group_members').insert({
        group_id: inv.group_id,
        student_id: userId
      });
    }

    // 6. Mark Invitation Used Atomically
    await supabaseAdmin
      .from('single_use_invitations')
      .update({
        status: 'used',
        used_count: 1,
        used_by: userId,
        used_at: new Date().toISOString()
      })
      .eq('id', inv.id);

    return new Response(
      JSON.stringify({ success: true, message: 'تم إنشاء حسابك بنجاح! يمكنك الآن تسجيل الدخول.' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'حدث خطأ أثناء تفعيل الكود' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
