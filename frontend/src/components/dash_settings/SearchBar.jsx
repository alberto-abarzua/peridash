import PrimaryButton from '@/components/general/buttons/PrimaryButton';
import api from '@/utils/api';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

import { useState, useEffect } from 'react';

import SymbolSearchResult from './SymbolSearchResult';
import { useDispatch } from 'react-redux';
import { tickerSliceActions } from '@/redux/tickerSlice';
import { ScrollArea } from '../ui/scroll-area';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dispatch = useDispatch();

    const handleSearchInputChange = event => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = async () => {
        let response = await api.get('/user_ticker/tickers/search/', {
            params: {
                search: searchTerm,
            },
        });
        setSearchResults(response.data.data);
        if (response.data.data.length > 0) {
            setIsModalOpen(true); // Open the modal once we have the results
        } else {
            //show noti
        }
    };

    const handleKeyDown = event => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const handleSearchResultClick = async (symbol, exchange, mic_code) => {
        setSearchResults([]);
        setSearchTerm('');
        setIsModalOpen(false);
        let response = await api.post('/user_ticker/tickers/', {
            ticker_info: { symbol, exchange, mic_code },
        });
        if (response.status === 200) {
            dispatch(tickerSliceActions.updateTickers());
        }
    };

    useEffect(() => {
        function handleEsc(event) {
            if (event.key === 'Escape') {
                handleModalClose();
            }
        }
        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, []);

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSearchResults([]);
        setSearchTerm('');
    };
    const backdrop = (
        <div
            onClick={() => handleModalClose()}
            className={`fixed inset-0 z-10 bg-gray-800 bg-opacity-90  transition-opacity ${
                isModalOpen ? 'block' : 'hidden'
            }`}
        />
    );

    const resultsModal = (
        <div className={`w-full  z-30${isModalOpen ? 'block' : 'hidden'}`}>
            <div
                className={`absolute left-1/2 top-10  z-30 flex -translate-x-1/2 transform flex-col  gap-y-3 space-y-2 rounded-xl bg-gray-700 bg-opacity-60 px-16 py-16 transition duration-200 ${
                    isModalOpen ? 'block' : 'hidden'
                }`}
            >
                <div className="absolute right-1 top-1" onClick={() => handleModalClose()}>
                    <CloseIcon className="scale-110 transform cursor-pointer  text-white  hover:text-black" />
                </div>
                <h1 className="text-3xl font-semibold text-white">Search Results</h1>
                <ScrollArea className="my-3 h-[800px] w-full rounded-md border border-gray-300 px-10 py-4 shadow-lg">
                    <div className="flex w-full flex-col gap-y-3 px-10">
                        {searchResults.map((result, index) => (
                            <SymbolSearchResult
                                result={result}
                                key={index}
                                onClick={handleSearchResultClick}
                            />
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );

    return (
        <>
            <div className="box-border flex w-full ">
                <div className="relative -right-2 z-10 m-0 flex h-12 w-full rounded-l-md bg-white p-0 shadow-lg ">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
                    <input
                        type="text"
                        className="w-full border-none bg-transparent py-1 pl-10 pr-3 outline-none"
                        placeholder="Ticker Symbol: AAPL, MSFT, etc."
                        value={searchTerm}
                        onChange={handleSearchInputChange}
                        onKeyDown={handleKeyDown}
                    />
                </div>

                <PrimaryButton
                    text="Search"
                    onClick={handleSearch}
                    icon={<SearchIcon />}
                    className="h-12 rounded-r-md shadow-lg"
                ></PrimaryButton>
            </div>
            {backdrop}
            {resultsModal}
        </>
    );
};

export default SearchBar;
