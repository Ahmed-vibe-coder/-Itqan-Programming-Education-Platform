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

    // 1. Check if owner already exists
    const { data: existingOwners, error: ownerCheckErr } = await supabaseClient
      .from('user_roles')
      .select('id')
      .eq('role', 'owner')
      .limit(1);

    if (ownerCheckErr) throw ownerCheckErr;

    if (existingOwners && existingOwners.length > 0) {
      return new Response(
        JSON.stringify({ error: 'تم إعداد حساب المالك سابقاً، هذه العملية متعطلة نهائياً.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { email, password, fullName, username } = await req.json();

    // 2. Create User via Admin Auth
    const { data: newUser, error: authErr } = await supabaseClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName, username }
    });

    if (authErr) throw authErr;

    // 3. Create Profile
    await supabaseClient.from('profiles').insert({
      id: newUser.user.id,
      full_name: fullName,
      username,
    });

    // 4. Assign Owner Role
    await supabaseClient.from('user_roles').insert({
      user_id: newUser.user.id,
      role: 'owner',
    });

    // 5. Record Audit Log
    await supabaseClient.from('audit_logs').insert({
      user_id: newUser.user.id,
      action: 'initialize_owner',
      entity_type: 'system',
      metadata: { email, username }
    });

    return new Response(
      JSON.stringify({ success: true, message: 'تم إعداد حساب المالك الأول وتأمين المنصة بنجاح.' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'حدث خطأ أثناء تنفيذ عملية الإعداد.' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
