import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const ShortUrlRedirect = () => {
  const { urlId } = useParams();

  useEffect(() => {
    axiosInstance.get(`/api/${urlId}`)
      .then(response => {
        window.location.href = response.data.longUrl;
      })
      .catch(error => {
        console.error('Error redirecting:', error);
      });
  }, [urlId]);

  return null;
};

export default ShortUrlRedirect;
