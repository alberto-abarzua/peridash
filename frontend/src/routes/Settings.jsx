import UserInfoCard from '@/components/auth/UserInfoCard';
import SearchBar from '@/components/dash_settings/SearchBar';
import UserTickers from '@/components/dash_settings/UserTickers';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import SettingsIcon from '@mui/icons-material/Settings';


const Settings = () => {
    return (
        <div className="box-border flex w-screen flex-col ">
            <div className="my-10 flex  flex-col sm:flex-row">
                <div className="flex items-center justify-center p-3 text-7xl text-white sm:w-1/2 ">
                    <SettingsIcon className="mr-5 scale-150 transform text-white" />
                    <span className="text-4xl">Dash Settings</span>
                </div>
                <div className="w-full self-center sm:w-1/2">
                    <UserInfoCard />
                </div>
            </div>

            <div className="m-auto mb-10 w-3/4 border-b border-b-slate-400 shadow-lg shadow-white"></div>

            <div className=" w-full flex-col justify-start px-10 lg:w-4/5">
                <div className=" mb-10 w-full lg:w-3/4 ">
                    <div className="mb-10 text-3xl text-white">
                        <QueryStatsIcon className="mr-3 text-5xl text-white"></QueryStatsIcon>
                        Add Ticker
                    </div>

                    <SearchBar getUserTickers />

                    <UserTickers />
                </div>
            </div>
        </div>
    );
};

export default Settings;
