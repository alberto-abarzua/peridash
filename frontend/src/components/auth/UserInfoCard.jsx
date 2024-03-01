import { useSelector } from 'react-redux';
const UserInfoCard = () => {
    const { session } = useSelector(state => state.user);
    console.log('session', session);
    const user = session?.user;

    return (
        <div className=" flex w-full rounded-md border   border-gray-500 bg-gray-700 bg-opacity-85 px-5 py-4 shadow-sm shadow-gray-600">
            <span className="mr-3 font-semibold text-white">Current User: </span>{' '}
            <span className="italic text-white">{user?.email}</span>
        </div>
    );
};

export default UserInfoCard;
