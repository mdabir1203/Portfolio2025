/**
 * Security Middleware for Portfolio API
 * Implements rate limiting, CORS, and security headers
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

export interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store for rate limiting (for serverless, consider Redis for production)
const rateLimitStore: RateLimitStore = {};

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // 100 requests per minute
const RATE_LIMIT_MAX_REQUESTS_STRICT = 20; // 20 requests per minute for POST/PUT/DELETE

/**
 * Gets client identifier for rate limiting
 */
function getClientId(req: VercelRequest): string {
  // Try to get IP from various headers (Vercel, Cloudflare, etc.)
  const forwarded = req.headers['x-forwarded-for'];
  const realIp = req.headers['x-real-ip'];
  const cfConnectingIp = req.headers['cf-connecting-ip'];
  
  const ip = 
    (typeof forwarded === 'string' ? forwarded.split(',')[0] : null) ||
    (typeof realIp === 'string' ? realIp : null) ||
    (typeof cfConnectingIp === 'string' ? cfConnectingIp : null) ||
    'unknown';
  
  return ip.trim();
}

/**
 * Cleans up expired rate limit entries
 */
function cleanupRateLimitStore(): void {
  const now = Date.now();
  Object.keys(rateLimitStore).forEach((key) => {
    if (rateLimitStore[key].resetTime < now) {
      delete rateLimitStore[key];
    }
  });
}

/**
 * Rate limiting middleware
 */
export function rateLimit(req: VercelRequest, res: VercelResponse): boolean {
  cleanupRateLimitStore();
  
  const clientId = getClientId(req);
  const isStrictMethod = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method || 'GET');
  const maxRequests = isStrictMethod ? RATE_LIMIT_MAX_REQUESTS_STRICT : RATE_LIMIT_MAX_REQUESTS;
  
  const now = Date.now();
  const clientData = rateLimitStore[clientId];
  
  if (!clientData || clientData.resetTime < now) {
    // New window or expired, reset
    rateLimitStore[clientId] = {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    };
    return true;
  }
  
  if (clientData.count >= maxRequests) {
    // Rate limit exceeded
    const retryAfter = Math.ceil((clientData.resetTime - now) / 1000);
    res.setHeader('Retry-After', retryAfter.toString());
    res.setHeader('X-RateLimit-Limit', maxRequests.toString());
    res.setHeader('X-RateLimit-Remaining', '0');
    res.setHeader('X-RateLimit-Reset', new Date(clientData.resetTime).toISOString());
    return false;
  }
  
  // Increment count
  clientData.count++;
  res.setHeader('X-RateLimit-Limit', maxRequests.toString());
  res.setHeader('X-RateLimit-Remaining', (maxRequests - clientData.count).toString());
  res.setHeader('X-RateLimit-Reset', new Date(clientData.resetTime).toISOString());
  
  return true;
}

/**
 * Sets security headers
 */
export function setSecurityHeaders(res: VercelResponse): void {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // Content Security Policy for API responses
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'none'; script-src 'none'; style-src 'none'; img-src 'none'; connect-src 'self'"
  );
}

/**
 * CORS middleware
 */
export function handleCORS(req: VercelRequest, res: VercelResponse): void {
  const origin = req.headers.origin;
  
  // Allow specific origins or all origins in development
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['*'];
  const isAllowed = 
    allowedOrigins.includes('*') || 
    (origin && allowedOrigins.includes(origin));
  
  if (isAllowed && origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(204).end();
  }
}

/**
 * Validates API key if required
 */
export function validateApiKey(req: VercelRequest): boolean {
  const apiKey = process.env.API_KEY;
  
  // If no API key is set, allow all requests
  if (!apiKey) {
    return true;
  }
  
  const providedKey = 
    req.headers['x-api-key'] || 
    req.headers['authorization']?.replace('Bearer ', '') ||
    req.query.apiKey;
  
  return providedKey === apiKey;
}

