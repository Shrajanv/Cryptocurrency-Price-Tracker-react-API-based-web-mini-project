import React, { useEffect, useState } from 'react';
import { fetchCryptoData } from './services/cryptoService'; // Ensure this path is correct
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Snackbar,
    Alert,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
} from '@mui/material';
import { Favorite, FavoriteBorder, Search } from '@mui/icons-material';
import { Line } from 'react-chartjs-2'; // Ensure you have chart.js and react-chartjs-2 installed
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import axios from 'axios';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: theme.palette.grey[900],
    color: theme.palette.common.white,
    fontWeight: 'bold',
}));

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
        primary: {
            main: '#90caf9',
        },
        secondary: {
            main: '#f48fb1',
        },
    },
    typography: {
        fontFamily: 'Roboto, sans-serif',
        fontSize: 14,
        h4: { fontSize: '1.75rem' },
    },
});

const CryptoTable = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [cryptos, setCryptos] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [popupMessage, setPopupMessage] = useState({ open: false, message: '', type: 'success' });
    const [selectedCrypto, setSelectedCrypto] = useState(null); // State to manage selected crypto for graph
    const [showGraph, setShowGraph] = useState(false); // State to manage graph popup visibility

    useEffect(() => {
        const getCryptoData = async () => {
            try {
                const data = await fetchCryptoData();
                setCryptos(data);
            } catch (error) {
                console.error('Error fetching crypto data:', error);
            }
        };
        getCryptoData();
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/favorites');
            setFavorites(response.data);
        } catch (error) {
            console.error('Error fetching favorites:', error);
        }
    };

    const showPopup = (message, type) => {
        setPopupMessage({ open: true, message, type });
    };

    const handleAddFavorite = async (crypto) => {
        // Check if the crypto is already in favorites
        const isFavorite = favorites.some((fav) => fav.name === crypto.name);
        if (isFavorite) {
            showPopup(`${crypto.name} is already in favorites`, 'warning');
            return; // Exit the function if it's already a favorite
        }

        try {
            await axios.post('http://localhost:5000/api/favorites', {
                name: crypto.name,
                price: crypto.current_price,
                marketCap: crypto.market_cap,
                change24h: crypto.price_change_percentage_24h,
            });
            showPopup(`${crypto.name} added to favorites`, 'success');
            fetchFavorites();
        } catch (error) {
            showPopup('Error saving favorite', 'error');
            console.error('Error saving favorite:', error); // Add error logging
        }
    };

    const handleRemoveFavorite = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/favorites/${id}`);
            showPopup('Favorite removed', 'success');
            fetchFavorites();
        } catch (error) {
            showPopup('Error removing favorite', 'error');
            console.error('Error removing favorite:', error); // Add error logging
        }
    };

    const filteredCryptos = cryptos.filter((crypto) =>
        crypto.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleGraphOpen = (crypto) => {
        setSelectedCrypto(crypto);
        setShowGraph(true);
    };

    const handleGraphClose = () => {
        setShowGraph(false);
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />

            <div>
                <Snackbar
                    open={popupMessage.open}
                    autoHideDuration={3000}
                    onClose={() => setPopupMessage({ ...popupMessage, open: false })}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Centered Snackbar
                >
                    <Alert
                        onClose={() => setPopupMessage({ ...popupMessage, open: false })}
                        severity={popupMessage.type}
                    >
                        {popupMessage.message}
                    </Alert>
                </Snackbar>

                <Typography variant="h4" align="center" gutterBottom sx={{ marginTop: '30px', fontSize: '2rem' }}>
                    Cryptocurrency Prices
                </Typography>

                <TextField
                    label="Search Cryptocurrency"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <Search />
                        ),
                    }}
                    sx={{
                        marginBottom: '20px',
                        borderRadius: '50px',
                        backgroundColor: '#333',
                        color: '#fff',
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '50px',
                        },
                        maxWidth: '1200px',
                        margin: 'auto',
                    }}
                />

                <TableContainer component={Paper} elevation={3} sx={{ maxWidth: 1200, margin: 'auto', marginTop: 4 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Name</StyledTableCell>
                                <StyledTableCell align="right" sx={{ color: 'green' }}>Price (USD)</StyledTableCell>
                                <StyledTableCell align="right" sx={{ color: 'green' }}>Market Cap</StyledTableCell>
                                <StyledTableCell align="right" sx={{ color: 'green' }}>24h Change (%)</StyledTableCell>
                                <StyledTableCell align="right" sx={{ color: 'green' }}>Volume (24h)</StyledTableCell>
                                <StyledTableCell align="right" sx={{ color: 'green' }}>Supply</StyledTableCell>
                                <StyledTableCell align="right" sx={{ color: 'green' }}>24h High</StyledTableCell>
                                <StyledTableCell align="right" sx={{ color: 'green' }}>24h Low</StyledTableCell>
                                <StyledTableCell align="right" sx={{ color: 'green' }}>Actions</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredCryptos.map((crypto) => (
                                <TableRow key={crypto.id} hover>
                                    <TableCell>{crypto.name}</TableCell>
                                    <TableCell align="right">${crypto.current_price.toFixed(2)}</TableCell>
                                    <TableCell align="right">${crypto.market_cap.toLocaleString()}</TableCell>
                                    <TableCell align="right" sx={{ color: crypto.price_change_percentage_24h >= 0 ? 'green' : 'red' }}>
                                        {crypto.price_change_percentage_24h.toFixed(2)}%
                                    </TableCell>
                                    <TableCell align="right">${crypto.total_volume.toLocaleString()}</TableCell>
                                    <TableCell align="right">{crypto.circulating_supply.toLocaleString()}</TableCell>
                                    <TableCell align="right">${crypto.high_24h.toFixed(2)}</TableCell>
                                    <TableCell align="right">${crypto.low_24h.toFixed(2)}</TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Add to Favorites">
                                            <IconButton onClick={() => handleAddFavorite(crypto)} color="primary">
                                                <FavoriteBorder />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Typography variant="h4" align="center" gutterBottom sx={{ marginTop: '40px', fontSize: '2rem' }}>
                    Your Favorites
                </Typography>

                <TableContainer component={Paper} elevation={3} sx={{ maxWidth: 1200, margin: 'auto', marginTop: 4 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Name</StyledTableCell>
                                <StyledTableCell align="right">Price (USD)</StyledTableCell>
                                <StyledTableCell align="right">Market Cap</StyledTableCell>
                                <StyledTableCell align="right">Actions</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {favorites.map((favorite) => (
                                <TableRow key={favorite._id}>
                                    <TableCell>{favorite.name}</TableCell>
                                    <TableCell align="right">${favorite.price.toFixed(2)}</TableCell>
                                    <TableCell align="right">${favorite.marketCap.toLocaleString()}</TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Remove from Favorites">
                                            <IconButton onClick={() => handleRemoveFavorite(favorite._id)} color="secondary">
                                                <Favorite />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Graph Popup */}
                <Dialog open={showGraph} onClose={handleGraphClose}>
                    <DialogTitle>{selectedCrypto?.name} Price Trend</DialogTitle>
                    <DialogContent>
                        {/* Graph Implementation Here */}
                        {/* Example: */}
                        
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleGraphClose} color="primary">Close</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </ThemeProvider>
    );
};

export default CryptoTable;
