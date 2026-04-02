export async function checkProfile(supabase, navigate) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    navigate("/login");
    return;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.student_id) {
    navigate("/select-student");
  }
}
