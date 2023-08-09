import { createToken } from '@/utils/auth';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useNotification from '@/components/general/notification/useNotification';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const { showNotification, renderNotification } = useNotification();

    const handleSubmit = async event => {
        event.preventDefault();
        const success = await createToken(email, password);

        if (success) {
            router.push('/');
        } else {
            showNotification(
                'The email or password you entered is incorrect. Please double-check and try again.',
                <ReportProblemIcon className=" text-red-500" />,
                'bg-red-100'
            );
        }
    };

    return (
        <div className="mt-20 flex min-h-screen flex-col items-center">
            {renderNotification()}
            <div className="mt-8 w-full max-w-xs rounded bg-white p-6 shadow-md">
                <h1 className="mb-4 text-lg font-medium">Please Login</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="rounded-md border px-4 py-2"
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label
                            htmlFor="password"
                            className="text-sm font-medium"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="rounded-md border px-4 py-2"
                        />
                    </div>
                    <button
                        type="submit"
                        className="mt-4 w-full rounded-md bg-green-600 py-2 text-white hover:bg-green-500"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
