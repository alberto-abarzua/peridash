import PrimaryButton from '@/components/general/buttons/PrimaryButton';
import useNotification from '@/components/general/notification/useNotification';
import api from '@/utils/api';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import SearchIcon from '@mui/icons-material/Search';

import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import TickerSearchResult from './SymbolSearchResult';

const SearchBar = ({ getUserTickers }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { showNotification, renderNotification } = useNotification();
    const handleSearchInputChange = event => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = async () => {
        let params = { q: searchTerm };
        let response = await api.get('/ticker/search/', { params });
        setSearchResults(response.data);
        if (response.data.length > 0) {
            setIsModalOpen(true); // Open the modal once we have the results
        } else {
            showNotification(
                'No Results Found!',
                <ReportProblemIcon className="text-yellow-500" />,
                'bg-yellow-100'
            );
        }
    };

    const handleKeyDown = event => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const handleSearchResultClick = async (symbol, exchange) => {
        setSearchResults([]);
        setSearchTerm('');
        setIsModalOpen(false);
        let data = {
            symbol: symbol,
            exchange: exchange,
        };
        let response = await api.post('/ticker/user-tickers/', data);
        if (response.status === 201) {
            showNotification(
                'Ticker Added',
                <CheckIcon className=" text-green-500" />,
                'bg-green-100'
            );
            getUserTickers();
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
                className={`absolute left-1/2 top-10 z-30 -translate-x-1/2 transform flex-col space-y-2 rounded-xl bg-gray-200 bg-opacity-60 px-16 py-16 transition duration-200 ${
                    isModalOpen ? 'block' : 'hidden'
                }`}
            >
                {searchResults.map((result, index) => (
                    <TickerSearchResult
                        result={result}
                        key={index}
                        onClick={handleSearchResultClick}
                    />
                ))}

                <div className="absolute -right-0 -top-0" onClick={() => handleModalClose()}>
                    <CloseIcon className="cursor-pointer rounded-full p-2 text-6xl text-white transition duration-100 hover:scale-105 hover:text-black" />
                </div>
            </div>
        </div>
    );
    return (
        <div>
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
            {renderNotification()}
        </div>
    );
};

SearchBar.propTypes = {
    getUserTickers: PropTypes.func.isRequired,
};
export default SearchBar;
