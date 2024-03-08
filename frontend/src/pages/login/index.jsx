import LoginForm from '@/components/auth/LoginForm';

const Login = () => {
    return (
        <div className="flex h-full items-center justify-center">
            <div className="mx-auto flex w-full flex-col justify-center gap-10 rounded-lg  border border-gray-700 bg-opacity-80  bg-gradient-to-tr from-gray-900 to-slate-800 px-5   pb-10 text-white shadow-xl lg:w-1/2 lg:flex-row lg:px-16 lg:py-10">
                <div className="flex w-full flex-col items-start gap-y-4 lg:w-1/2 ">
                    <h1 className="mt-10 text-4xl font-semibold text-white">Welcome!</h1>
                    <p className="text-lg text-gray-300"> We missed you!</p>
                </div>
                <LoginForm />
            </div>
        </div>
    );
};

export default Login;
