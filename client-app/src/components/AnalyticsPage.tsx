import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';

const AnalyticsPage: React.FC = () => {
    const [analytics, setAnalytics] = useState([]);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await axiosInstance.get('/analytics', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setAnalytics(response.data);
            } catch (error) {
                console.error('Error fetching analytics:', error);
            }
        };

        fetchAnalytics();
    }, []);

    return (
        <div>
            <h2>Analytics</h2>
            <ul>
                {analytics.map((data, index) => (
                    <li key={index}>{data}</li>
                ))}
            </ul>
        </div>
    );
};

export default AnalyticsPage;
