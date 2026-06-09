import crypto from 'crypto';

/**
 * Generates an MD5 signature for PayFast requests/ITN verification.
 * 
 * @param data - Object containing the fields to sign
 * @param passphrase - The secret passphrase set in PayFast dashboard
 * @returns MD5 hex string
 */
export function generatePayFastSignature(data: Record<string, any>, passphrase?: string): string {
    let queryString = "";

    Object.keys(data).forEach((key) => {
        if (data[key] !== "" && key !== 'signature') {
            const val = data[key].toString().trim();
            queryString += `${key}=${encodeURIComponent(val).replace(/%20/g, "+")}&`;
        }
    });

    if (passphrase) {
        queryString += `passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, "+")}`;
    } else {
        queryString = queryString.substring(0, queryString.length - 1);
    }

    return crypto.createHash('md5').update(queryString).digest('hex');
}

/**
 * Verifies PayFast ITN (Instant Transaction Notification).
 * 
 * @param body - The POST body from PayFast
 * @param passphrase - Your secret passphrase
 * @returns boolean
 */
export function verifyITN(body: Record<string, any>, passphrase: string): boolean {
    const receivedSignature = body.signature;
    const computedSignature = generatePayFastSignature(body, passphrase);
    return receivedSignature === computedSignature;
}
