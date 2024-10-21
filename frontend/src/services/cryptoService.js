import axios from 'axios';

// CoinGecko API base URL
const API_URL = 'https://api.coingecko.com/api/v3';

// Function to fetch cryptocurrency data
export const fetchCryptoData = async () => {
    try {
        const response = await axios.get(`${API_URL}/coins/markets`, {
            params: {
                vs_currency: 'usd', // Set the currency to USD
                order: 'market_cap_desc', // Order by market cap in descending order
                per_page: 10, // Number of results per page (can increase)
                page: 1, // First page of results
            },
        });
        return response.data; // Return the list of cryptocurrencies
    } catch (error) {
        console.error('Error fetching data from CoinGecko API:', error);
        return [];
    }
};

