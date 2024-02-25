export const logout = async supabase => {
    const { error } = await supabase.auth.signOut();
    localStorage.removeItem('access_token');
    if (error) {
        console.error('Error logging out:', error.message);
        return error;
    }
    return null;
};
