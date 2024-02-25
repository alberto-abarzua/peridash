import UserInfoCard from '@/components/auth/UserInfoCard';
import SearchBar from '@/components/dash_settings/SearchBar';
import UserTickers from '@/components/dash_settings/UserTickers';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import SettingsIcon from '@mui/icons-material/Settings';

const Settings = () => {
    return (
        <div className="mx-auto flex w-full flex-col items-start  lg:w-[80%] ">
            <div className=" flex flex-col gap-10 px-10 text-white  lg:flex-row">
                <div className="flex items-center justify-center">
                    <SettingsIcon className="mr-5 scale-150 transform text-white" />
                    <span className="whitespace-nowrap text-4xl">Settings</span>
                </div>
                <div className="w-full">
                    <UserInfoCard />
                </div>
            </div>

            <div className=" my-10 flex w-full flex-col gap-5 lg:flex-row">
                <div className="flex w-full flex-col gap-5">
                    <div className=" flex w-full flex-col gap-10 rounded-md border border-gray-500 bg-gray-700 bg-opacity-85 px-10 py-5 shadow-sm shadow-gray-600 ">
                        <div className=" text-3xl text-white">
                            <QueryStatsIcon className="mr-3 text-5xl text-white"></QueryStatsIcon>
                            Add Ticker
                        </div>

                        <SearchBar />
                    </div>

                    <UserTickers />
                </div>
                <div className=" flex h-fit w-full flex-col gap-10 rounded-md border border-gray-500 bg-gray-700 bg-opacity-85 px-10 py-5 shadow-sm shadow-gray-600 ">
                    <h1 className="text-3xl text-white">Stocks Settings</h1>
                    <p className="italic text-gray-200">More settings coming soon!</p>
                </div>
            </div>
        </div>
    );
};

export default Settings;
