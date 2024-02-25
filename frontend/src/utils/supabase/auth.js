export const logout = async supabase => {
    localStorage.removeItem('access_token');
    await supabase.auth.signOut();
    return null;
};
