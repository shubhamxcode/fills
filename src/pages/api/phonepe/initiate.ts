import type { APIRoute } from 'astro';
import {
    getPhonePeConfig,
    generateJWT,
    generateMerchantOrderId,
    createPaymentPayload,
    validateAmount,
    rupeesToPaise,
} from '../../../lib/phonepe-utils';

// Mark this endpoint as server-rendered
export const prerender = false;

/**
 * API Endpoint: POST /api/phonepe/initiate
 * Purpose: Initiate PhonePe payment and get checkout URL
 */
export const POST: APIRoute = async ({ request }) => {
    console.log('=== PhonePe Payment Initiation API Called ===');

    try {
        // Parse request body
        const body = await request.json();
        console.log('Request body:', body);
        const { amount, redirectUrl } = body;
        console.log('Amount:', amount, 'Redirect URL:', redirectUrl);

        // Validate amount
        if (!amount || !validateAmount(amount)) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: 'Invalid amount. Amount must be a positive number.',
                }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        // Validate redirect URL
        if (!redirectUrl) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: 'Redirect URL is required.',
                }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        // Get PhonePe configuration
        const config = getPhonePeConfig();

        // Generate unique merchant order ID
        const merchantOrderId = generateMerchantOrderId();

        // Convert amount to paise (PhonePe expects amount in paise)
        const amountInPaise = rupeesToPaise(amount);

        // Create payment payload
        const paymentPayload = createPaymentPayload({
            merchantOrderId,
            amount: amountInPaise,
            redirectUrl,
            message: `Payment for order ${merchantOrderId}`,
        });

        console.log('Payment payload:', JSON.stringify(paymentPayload, null, 2));

        // Use Client Secret as Bearer token (PhonePe authentication)
        const authToken = config.clientSecret;

        // Call PhonePe API
        const phonePeResponse = await fetch(
            `${config.apiBaseUrl}/checkout/v2/pay`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify(paymentPayload),
            }
        );

        const responseData = await phonePeResponse.json();

        // Check if payment initiation was successful
        if (!phonePeResponse.ok || !responseData.success) {
            console.error('PhonePe API Error:', responseData);
            return new Response(
                JSON.stringify({
                    success: false,
                    error: responseData.message || 'Failed to initiate payment',
                    details: responseData,
                }),
                {
                    status: phonePeResponse.status,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        // Extract checkout URL from response
        const checkoutUrl = responseData.data?.instrumentResponse?.redirectInfo?.url;

        if (!checkoutUrl) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: 'Checkout URL not found in PhonePe response',
                    details: responseData,
                }),
                {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        // Return success response with checkout URL
        return new Response(
            JSON.stringify({
                success: true,
                checkoutUrl,
                merchantOrderId,
                amount: amountInPaise,
                message: 'Payment initiated successfully',
            }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (error) {
        console.error('Payment initiation error:', error);
        return new Response(
            JSON.stringify({
                success: false,
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error',
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
};
