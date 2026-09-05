/**
 * MedLens Vercel Serverless API Handler
 *
 * This is the single entry point for all /api/* routes on Vercel.
 * It delegates to handleRequest() from server.js, which contains all
 * route logic. Static assets (index.html, styles.css, app.js) are
 * served directly by Vercel's CDN from the /public directory —
 * the serverless function ONLY handles /api/* routes.
 */

const { handleRequest } = require('../server');

module.exports = async (req, res) => {
  try {
    return await handleRequest(req, res);
  } catch (err) {
    // Catch-all safety net: prevent unhandled crashes from leaking
    console.error('[MedLens API] Unhandled top-level error:', err);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: 'Internal server error.',
        details: err.message || 'Unknown error'
      }));
    }
  }
};
