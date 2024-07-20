import React, { useState } from 'react';
import axiosInstance from '../axiosInstance';

const MainPage: React.FC = () => {
    const [longUrl, setLongUrl] = useState('');
    const [shortUrl, setShortUrl] = useState('');

    const handleShorten = async () => {
        try {
            const response = await axiosInstance.post('/shorten', { longUrl });
            setShortUrl(response.data.shortUrl);
        } catch (error) {
            console.error('Error creating short URL:', error);
        }
    };

    return (
        <div>
            <h2>URL Shortener</h2>
            <input
                type="text"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                placeholder="Enter URL to shorten"
            />
            <button onClick={handleShorten}>Shorten</button>
            {shortUrl && <div>Short URL: {shortUrl}</div>}
        </div>
    );
};

export default MainPage;
