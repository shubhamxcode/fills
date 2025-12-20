import jwt from 'jsonwebtoken';

/**
 * PhonePe Payment Gateway Utility Functions
 * Based on official PhonePe API documentation
 */

interface PhonePeConfig {
    clientId: string;
    clientSecret: string;
    clientVersion: string;
    apiBaseUrl: string;
}

interface PaymentPayload {
    merchantOrderId: string;
    amount: number;
    redirectUrl: string;
    message?: string;
}

/**
 * Get PhonePe configuration from environment variables
 */
export function getPhonePeConfig(): PhonePeConfig {
    // In Astro server-side, we need to use process.env
    const clientId = process.env.PHONEPE_CLIENT_ID || import.meta.env.PHONEPE_CLIENT_ID;
    const clientSecret = process.env.PHONEPE_CLIENT_SECRET || import.meta.env.PHONEPE_CLIENT_SECRET;
    const clientVersion = process.env.PHONEPE_CLIENT_VERSION || import.meta.env.PHONEPE_CLIENT_VERSION;
    const apiBaseUrl = process.env.PHONEPE_API_BASE_URL || import.meta.env.PHONEPE_API_BASE_URL;

    if (!clientId || !clientSecret || !clientVersion || !apiBaseUrl) {
        throw new Error('PhonePe configuration is missing in environment variables');
    }

    return {
        clientId,
        clientSecret,
        clientVersion,
        apiBaseUrl,
    };
}

/**
 * Generate JWT token for PhonePe API authentication
 * Token format: O-Bearer <JWT>
 */
export function generateJWT(merchantId: string, clientSecret: string): string {
    const expiresOn = Date.now() + 30 * 60 * 1000; // 30 minutes from now

    const payload = {
        expiresOn,
        merchantId,
    };

    // Generate JWT token
    const token = jwt.sign(payload, clientSecret, {
        algorithm: 'HS256',
        noTimestamp: true,
    });

    return token;
}

/**
 * Generate unique merchant order ID
 */
export function generateMerchantOrderId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `ORDER_${timestamp}_${random}`;
}

/**
 * Create payment payload for PhonePe API
 */
export function createPaymentPayload(params: PaymentPayload) {
    return {
        merchantOrderId: params.merchantOrderId,
        amount: params.amount,
        paymentFlow: {
            type: 'PG_CHECKOUT',
            message: params.message || 'Payment for order',
            merchantUrls: {
                redirectUrl: params.redirectUrl,
            },
        },
    };
}

/**
 * Validate amount (must be positive integer in paise)
 */
export function validateAmount(amount: number): boolean {
    return Number.isInteger(amount) && amount > 0;
}

/**
 * Convert rupees to paise (PhonePe expects amount in paise)
 */
export function rupeesToPaise(rupees: number): number {
    return Math.round(rupees * 100);
}

/**
 * Convert paise to rupees
 */
export function paiseToRupees(paise: number): number {
    return paise / 100;
}
