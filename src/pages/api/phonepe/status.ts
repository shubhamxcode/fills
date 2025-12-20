import type { APIRoute } from 'astro';
import { getPhonePeConfig, generateJWT } from '../../../lib/phonepe-utils';

// Mark this endpoint as server-rendered
export const prerender = false;

/**
 * API Endpoint: GET /api/phonepe/status?orderId=ORDER_123
 * Purpose: Check payment status from PhonePe
 */
export const GET: APIRoute = async ({ url }) => {
    try {
        const orderId = url.searchParams.get('orderId');

        if (!orderId) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: 'Order ID is required',
                }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        // Get PhonePe configuration
        const config = getPhonePeConfig();

        // Generate JWT token for authentication
        const jwtToken = generateJWT(config.clientId, config.clientSecret);

        // Call PhonePe status check API
        const phonePeResponse = await fetch(
            `${config.apiBaseUrl}/checkout/v2/status/${config.clientId}/${orderId}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `O-Bearer ${jwtToken}`,
                },
            }
        );

        const responseData = await phonePeResponse.json();

        if (!phonePeResponse.ok) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: 'Failed to fetch payment status',
                    details: responseData,
                }),
                {
                    status: phonePeResponse.status,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        // Return payment status
        return new Response(
            JSON.stringify({
                success: true,
                data: responseData,
            }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (error) {
        console.error('Payment status check error:', error);
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
