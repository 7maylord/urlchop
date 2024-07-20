import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';

const LinkHistoryPage: React.FC = () => {
    const [linkHistory, setLinkHistory] = useState([]);

    useEffect(() => {
        const fetchLinkHistory = async () => {
            try {
                const response = await axiosInstance.get('/linkhistory', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setLinkHistory(response.data.urls);
            } catch (error) {
                console.error('Error fetching link history:', error);
            }
        };

        fetchLinkHistory();
    }, []);

    return (
        <div>
            <h2>Link History</h2>
            <ul>
                {linkHistory.map((url, index) => (
                    <li key={index}>{url.longUrl} - {url.shortUrl}</li>
                ))}
            </ul>
        </div>
    );
};

export default LinkHistoryPage;
