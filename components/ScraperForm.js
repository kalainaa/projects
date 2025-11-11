import React, { useState } from 'react';
import axios from 'axios';

const ScraperForm = ({ setResults }) => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchFromRustServer = async (url) => {
        try {
            const response = await axios.post('http://127.0.0.1:7878/api/scrape', { url });
            return response.data; // Assuming the Rust server returns the scraped data in the expected format
        } catch (error) {
            console.error('Error fetching data from Rust server:', error);
            setError('Failed to fetch data from the server. Please try again later.');
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Construct the URL for scraping based on the query
        const url = `https://example.com/search?q=${encodeURIComponent(query)}`; // Replace with the actual URL you want to scrape

        const scrapedData = await fetchFromRustServer(url);

        if (scrapedData) {
            setResults(scrapedData);
        } else {
            setError('No results found. Please try a different query.');
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter your search query"
            />
            <button type="submit" disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
};

export default ScraperForm;
