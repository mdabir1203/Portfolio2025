/**
 * Portfolio API Endpoint
 * Secure, scalable API to extract all portfolio information
 * 
 * GET /api/portfolio - Get all portfolio data
 * GET /api/portfolio?section=skills - Get specific section
 * 
 * Security Features:
 * - Rate limiting (100 GET requests/min, 20 POST/min)
 * - CORS protection
 * - Security headers
 * - Optional API key authentication
 * - Input validation
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { getAllPortfolioData, getPortfolioSection, isValidSection } from './utils/portfolio-data';
import { rateLimit, setSecurityHeaders, handleCORS, validateApiKey } from './middleware/security';

// Request validation schema
const querySchema = z.object({
  section: z.string().optional(),
  format: z.enum(['json', 'minified']).optional().default('json'),
});

// Error response helper
function sendError(
  res: VercelResponse,
  statusCode: number,
  message: string,
  details?: unknown
): void {
  res.status(statusCode).json({
    error: message,
    ...(details && { details }),
    timestamp: new Date().toISOString(),
  });
}

// Success response helper
function sendSuccess(res: VercelResponse, data: unknown, statusCode = 200): void {
  res.status(statusCode).json({
    success: true,
    data,
    timestamp: new Date().toISOString(),
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    // Set security headers
    setSecurityHeaders(res);

    // Handle CORS
    handleCORS(req, res);
    if (req.method === 'OPTIONS') {
      return; // Already handled in handleCORS
    }

    // Only allow GET requests
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET, OPTIONS');
      return sendError(res, 405, 'Method not allowed. Only GET and OPTIONS are supported.');
    }

    // Rate limiting
    if (!rateLimit(req, res)) {
      return sendError(
        res,
        429,
        'Too many requests. Please try again later.',
        { retryAfter: res.getHeader('Retry-After') }
      );
    }

    // Optional API key validation (if API_KEY env var is set)
    if (!validateApiKey(req)) {
      return sendError(res, 401, 'Unauthorized. Invalid or missing API key.');
    }

    // Validate query parameters
    const queryParseResult = querySchema.safeParse(req.query);
    if (!queryParseResult.success) {
      return sendError(
        res,
        400,
        'Invalid query parameters',
        queryParseResult.error.errors
      );
    }

    const { section, format } = queryParseResult.data;

    // Get portfolio data
    let portfolioData: unknown;

    if (!section || section === 'all') {
      portfolioData = getAllPortfolioData();
    } else {
      // Validate section name
      if (!isValidSection(section)) {
        return sendError(
          res,
          400,
          `Invalid section: "${section}"`,
          {
            validSections: [
              'skills',
              'projects',
              'services',
              'experiences',
              'journey',
              'awards',
              'socialPhotos',
              'personalityHighlights',
              'enneagramResult',
              'linkedinRecommendations',
              'assistantActs',
              'trust',
              'all',
            ],
          }
        );
      }

      portfolioData = getPortfolioSection(section);
    }

    // Format response
    if (format === 'minified') {
      // Minified JSON (no extra whitespace)
      res.setHeader('Content-Type', 'application/json');
      res.status(200).send(JSON.stringify({
        success: true,
        data: portfolioData,
        timestamp: new Date().toISOString(),
      }));
    } else {
      // Pretty JSON
      sendSuccess(res, portfolioData);
    }

  } catch (error) {
    // Log error (in production, use proper logging service)
    console.error('Portfolio API error:', error);

    // Don't expose internal error details in production
    const isDevelopment = process.env.NODE_ENV === 'development';
    const errorDetails = isDevelopment && error instanceof Error ? error.stack : undefined;

    sendError(
      res,
      500,
      'Internal server error',
      isDevelopment ? errorDetails : undefined
    );
  }
}

