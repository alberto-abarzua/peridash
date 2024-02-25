import { useRouteError } from 'react-router-dom';

export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    return (
        <div
            id="error-page"
            className="flex h-screen w-full items-center justify-center bg-gray-100"
        >
            <div className="text-center">
                <h1 className="text-5xl font-bold text-red-600">Oops!</h1>
                <p className="mt-4 text-lg text-gray-800">
                    Sorry, an unexpected error has occurred.
                </p>
                <p className="text-md mt-2 text-gray-500">
                    <i>{error.status + " "}</i>
                    <i>{error.statusText || error.message}</i>
                </p>
                <button
                    onClick={() => window.history.back()}
                    className="mt-6 rounded-full bg-red-500 px-6 py-2 font-bold text-white transition duration-300 hover:bg-red-700"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
}
