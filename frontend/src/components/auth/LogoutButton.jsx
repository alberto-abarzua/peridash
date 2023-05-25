const LogoutButton = () => {
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        window.location.reload();
    };

    return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
