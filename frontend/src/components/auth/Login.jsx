import LoginForm from '@/components/auth/LoginForm';
const Login = () => {
    return (
        <div className="mx-2 my-2 flex w-full flex-col gap-x-10  rounded-lg border border-gray-700  bg-opacity-80 bg-gradient-to-tr from-gray-900 to-slate-800   px-5 py-10 text-white shadow-xl lg:mt-40 lg:w-1/2 lg:flex-row lg:px-16">
            <LoginForm />
            <div className="hidden flex-col items-start gap-y-4 lg:flex ">
                <h1 className="mt-10 hidden  text-4xl font-semibold lg:block">
                    Welcome to Peridash!
                </h1>
                <p className="text-lg text-gray-300"> The Personalized Stocks Dashboard</p>
            </div>
        </div>
    );
};

export default Login;
