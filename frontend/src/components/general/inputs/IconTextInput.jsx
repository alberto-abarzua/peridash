const InconTextInput = ({ icon, ...props }) => {
    return (
        <div className="flex h-12 flex-shrink flex-grow rounded-md border bg-white">
            {' '}
            {/* added flex-grow and flex-shrink */}
            <div className="self-center px-2 text-lg text-gray-800">
                {icon}
            </div>{' '}
            {/* added px-2 for some spacing */}
            <input
                className="ml-1 h-full w-full self-center outline-none"
                type="number"
                {...props}
            />
        </div>
    );
};

export default InconTextInput;
