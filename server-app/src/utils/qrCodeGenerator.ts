import axios from 'axios';

const QR_API_URL = process.env.QR_API_URL || 'https://api.qrserver.com/v1/create-qr-code/';

/**
 * Generates a QR code for a given text.
 * @param text - The text to encode in the QR code.
 * @returns A promise that resolves to the QR code in base64 format.
 */


const generateQrCode = async (url: string): Promise<string> => {
    const response = await axios.get(`${QR_API_URL}`, {
        params: { data: url, size: '150x150' },
        responseType: 'arraybuffer',
    });
    return `data:image/png;base64,${Buffer.from(response.data).toString('base64')}`;
};

export default generateQrCode;

// export const generateQrCode = async (shortUrl: string): Promise<string> => {
//   const qrCodeUrl = `${QR_API_URL}?data=${shortUrl}`;
//   const response = await axios.get(qrCodeUrl, { responseType: 'arraybuffer' });

//   return `data:image/png;base64,${Buffer.from(response.data).toString('base64')}`;
// };

// import qr from 'qr-image';

// const generateQrCode = (text: string): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     try {
//       const qrCode = qr.imageSync(text, { type: 'svg' });
//       resolve(qrCode.toString('base64'));
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

// export default generateQrCode;
