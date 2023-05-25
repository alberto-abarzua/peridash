import { render, screen } from '@testing-library/react';

import LogoutButton from './LogoutButton';

test('Logut button', () => {
    render(<LogoutButton />);

    const logout_button = screen.getByRole('button', { name: 'Logout' });

    expect(logout_button).toBeInTheDocument();
});
