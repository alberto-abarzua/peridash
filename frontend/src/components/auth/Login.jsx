import LoginForm from '@/components/auth/LoginForm';
const Login = () => {
    return (
        <div className="to-slate-800-300 mx-2 my-2 flex  w-full flex-col gap-x-10 rounded-lg bg-opacity-80 bg-gradient-to-tr from-gray-900   px-5 py-10 text-white shadow-xl lg:mt-40 lg:w-1/2 lg:flex-row lg:px-16">
            <LoginForm />
        </div>
    );
};

export default Login;
