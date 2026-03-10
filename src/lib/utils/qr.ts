import QRCode from 'qrcode';

/**
 * Generates a QR code Data URL from binary or text content.
 */
export async function generateQrCode(text: string): Promise<string> {
    try {
        return await QRCode.toDataURL(text, {
            errorCorrectionLevel: 'M',
            margin: 4,
            width: 512,
            color: {
                dark: '#000000',
                light: '#ffffff00', // Transparent background
            },
        });
    } catch (err) {
        console.error('Error generating QR code:', err);
        throw new Error('Failed to generate QR code');
    }
}
