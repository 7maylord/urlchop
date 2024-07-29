import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

const ShortenUrl = () => {
  const [longUrl, setLongUrl] = useState('');
  const [customId, setCustomId] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.post(
        '/url',
        { longUrl, customId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShortUrl(response.data.shortUrl);
      setError(null);
      copyShortUrl(response.data.shortUrl);
      setLongUrl('');
    } catch (error) {      
      setError('Error creating short URL. Please try again.');
      console.error('Error creating short URL:', error);
    }
  };

  const copyShortUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      alert('Shortened URL copied to clipboard!');
    } catch (error) {
      console.error('Error copying URL to clipboard:', error);
      alert('Failed to copy URL to clipboard. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center ma min-h-screen  mt-8 md:mt-12 bg-gray-100">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-3xl font-bold mb-6 text-center">UrlChop</h2>
        <p className= "text-left pb-2 text-1xl font-extralight">
            paste your untidy link to shorten it
          </p>
        <input
          type="text"
          placeholder="Long URL"
          value={longUrl}
          onChange={e => setLongUrl(e.target.value)}
          className="mb-4 w-full p-3 border rounded"
        />
        <p className= "text-left pb-2 text-1xl font-extralight">
            Add a custom id for your link or we will generate 7 unique characters for you!
          </p>
        <input
          type="text"
          placeholder="Custom Id (optional)"
          value={customId}
          onChange={e => setCustomId(e.target.value)}
          className="mb-4 w-full p-3 border rounded"
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600">
          Shorten URL
        </button>
        {shortUrl && <p className="mt-4 text-center">Short URL: {shortUrl}</p>}
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default ShortenUrl;
