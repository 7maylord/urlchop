import axios from 'axios';

const QR_API_URL = process.env.QR_API_URL || 'https://api.qrserver.com/v1/create-qr-code/';

/**
 * Generates a QR code for a given text.
 * @param text - The text to encode in the QR code.
 * @returns A promise that resolves to the QR code in base64 format.
 */

const generateQrCode = async (shortUrl: string): Promise<string> => {
    const response = await axios.get(`${QR_API_URL}`, {
        params: { data: shortUrl, size: '250x250' },
        responseType: 'arraybuffer',
    });
    return `data:image/png;base64,${Buffer.from(response.data).toString('base64')}`;
};

export default generateQrCode;


