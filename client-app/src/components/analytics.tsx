import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const Analytics = () => {
  const { shortUrl } = useParams<{ shortUrl: string }>();
  const [analytics, setAnalytics] = useState({ clicks: 0, origins: [] });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axiosInstance.get(`/analytics/${shortUrl}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnalytics(response.data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    };

    fetchAnalytics();
  }, [shortUrl]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Analytics for {shortUrl}</h2>
      <p className="mb-4">Total Clicks: {analytics.clicks}</p>
      <h3 className="text-xl font-bold mb-4">Click Origins</h3>
      <ul className="list-disc list-inside">
        {analytics.origins.map((origin, index) => (
          <li key={index}>{origin}</li>
        ))}
      </ul>
    </div>
  );
};

export default Analytics;
