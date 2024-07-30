import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { IUrl } from '../types';
import { useNavigate } from 'react-router-dom';

const LinkHistory = () => {
  const [links, setLinks] = useState<IUrl[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axiosInstance.get('/history/:userId', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLinks(response.data.urls);
      } catch (error) {
        console.error('Error fetching links:', error);
      }
    };

    fetchLinks();
  }, []); // Dependency array ensures useEffect runs only once on initial load

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Page has become visible again, fetch links to update
        fetchLinks();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const fetchLinks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.get('/history/:userId', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLinks(response.data.urls);
    } catch (error) {
      console.error('Error fetching links:', error);
    }
  };

const downloadQrCode = async (qrCodeUrl: string) => {
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'qrcode.png'; // Set desired file name here
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading QR code:', error);
      alert('Failed to download QR code. Please try again.');
    }
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      alert(`Short URL copied to clipboard: ${url}`);
    } catch (error) {
      console.error('Error copying URL to clipboard:', error);
      alert('Failed to copy URL to clipboard. Please try again.');
    }
  };


  const deleteUrl = async (urlId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.delete(`/url/${urlId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Link deleted successfully:', response.data);
      if (response.status === 200) {
        // Remove the deleted link from state
        setLinks(links.filter(link => link.urlId !== urlId));
        alert('Link deleted successfully.');
      } else {
        alert('Link deletion unsuccessful. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting link:', error);
      alert('Failed to delete link. Please try again.');
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Your Link History</h2>
      <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2">URL ID</th>
            <th className="px-4 py-2">Short URL</th>
            <th className="px-4 py-2">Long URL</th>
            <th className="px-4 py-2">Clicks</th>
            <th className="px-4 py-2">QR Code</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {links.map(link => (
            <tr key={link._id} className="border-t">
              <td className="px-4 py-2 text-center cursor-pointer text-blue-500 hover:underline"
                onClick={() => navigate(`/analytics/${link.urlId}`)}
              >
                {link.urlId}
              </td>
              <td className="px-4 py-2 text-center cursor-pointer text-blue-500 hover:underline"
                onClick={() => window.open(link.shortUrl, '_blank')}
              >
                {link.shortUrl}
              </td>
              <td className="px-4 py-2 text-center">{link.longUrl}</td>
              <td className="px-4 py-2 text-center">{Array.isArray(link.clicks) ? link.clicks.reduce((sum, click) => sum + click.count, 0) : 0}</td>
              <td className="px-4 py-2"><img src={link.qrCode} alt="QR Code" className="w-16 h-16 cursor-pointer" onClick={() => downloadQrCode(link.qrCode)} /></td>
              <td className="px-4 py-2 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <div
                    className="cursor-pointer px-2"
                    onClick={() => copyToClipboard(link.shortUrl)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6 fill-white-600"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z"
                        clipRule="evenodd"
                      />
                      <path
                        fillRule="evenodd"
                        d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375Zm9.586 4.594a.75.75 0 0 0-1.172-.938l-2.476 3.096-.908-.907a.75.75 0 0 0-1.06 1.06l1.5 1.5a.75.75 0 0 0 1.116-.062l3-3.75Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>

                  <div
                    className="cursor-pointer px-2"
                    onClick={() => deleteUrl(link.urlId)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6 fill-red-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LinkHistory;
