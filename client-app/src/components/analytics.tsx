import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useParams } from 'react-router-dom';
import { IClick } from '../types';

const Analytics = () => {
  const { urlId } = useParams();
  const [clicks, setClicks] = useState<IClick[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axiosInstance.get(`/analytics/${urlId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClicks(response.data.clicks);
       } catch (error) {
        setError('Error fetching analytics. Please click on Url Id to try again.');
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [urlId]);

  if (loading) {
    return <div className="max-w-4xl mx-auto p-6">Loading...</div>;
  }

  if (error) {
    return <div className="max-w-4xl mx-auto p-6 text-red-500">{error}</div>;
  }

  return (
<div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">URL Analytics</h2>
      <h3 className="text-xl font-semibold mb-3">Clicks</h3>
      <ul className="list-disc pl-5 space-y-2">
        {clicks.map((click, index) => (
          <li key={index} className="text-base">
            <div>
              <span className="font-medium">Origin:</span> {click.origin}
            </div>
            <div>
              <span className="font-medium">Timestamp:</span> {new Date(click.timestamp).toLocaleString()}
            </div>
            <div>
              <span className="font-medium">Count:</span> {click.count}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Analytics;

