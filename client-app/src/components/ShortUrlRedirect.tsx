import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const ShortUrlRedirect = () => {
  const { shortUrlId } = useParams();

  useEffect(() => {
    axiosInstance.get(`/api/${shortUrlId}`)
      .then(response => {
        window.location.href = response.data.longUrl;
      })
      .catch(error => {
        console.error('Error redirecting:', error);
      });
  }, [shortUrlId]);

  return null;
};

export default ShortUrlRedirect;
