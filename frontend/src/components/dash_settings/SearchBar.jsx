import api from '@/utils/api';
import SearchIcon from '@mui/icons-material/Search';
import { TextField, Button, Box, List, ListItem } from '@mui/material';
import { Dialog, DialogContent } from '@mui/material';

import { useState, useEffect } from 'react';

import TickerSearchResult from './TickerSearchResult';
const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleSearchInputChange = event => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = async () => {
        console.log('Searching for:', searchTerm);
        let params = { q: searchTerm };
        let response = await api.get('/ticker/search/', { params });
        console.log(response.data);
        setSearchResults(response.data);
        setIsModalOpen(true); // Open the modal once we have the results
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
        console.log('Clicked:', symbol, exchange);
        //add to user
        let data = {
            symbol: symbol,
            exchange: exchange,
        };
        console.log(data);
        let response = await api.post('/ticker/user-tickers/', data);
        console.log(response.data);
    };

    useEffect(() => {
        const handleEsc = event => {
            if (event.keyCode === 27) {
                setSearchResults([]);
            }
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, []);

    const handleDialogClose = () => {
        setIsModalOpen(false);
        setSearchResults([]);
        setSearchTerm('');
    };

    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    my: 3,
                }}
            >
                <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleSearchInputChange}
                    onKeyDown={handleKeyDown}
                    InputProps={{
                        startAdornment: <SearchIcon color="action" />,
                        style: { height: 45, backgroundColor: 'white' },
                    }}
                />
                <Button
                    variant="contained"
                    size="large"
                    endIcon={<SearchIcon />}
                    onClick={handleSearch}
                >
                    Search
                </Button>
            </Box>
            <h1>Search Results</h1>
            <Dialog
                open={isModalOpen}
                onClose={handleDialogClose}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
                fullWidth
                maxWidth="md"
            >
                <DialogContent dividers={true}>
                    <List>
                        {searchResults.map((result, index) => (
                            <ListItem key={index} sx={{ padding: 0 }}>
                                <TickerSearchResult
                                    result={result}
                                    onClick={handleSearchResultClick}
                                />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default SearchBar;
