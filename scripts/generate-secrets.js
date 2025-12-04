/**
 * Environment Setup Helper Script
 * 
 * This script helps generate secure random secrets for your environment variables.
 * Run with: node scripts/generate-secrets.js
 */

const crypto = require('crypto');

/**
 * Generates a secure random string
 * @param {number} length - Length of the string in bytes (will be base64 encoded, so output is longer)
 * @returns {string} Base64 encoded random string
 */
function generateSecret(length = 32) {
    return crypto.randomBytes(length).toString('base64');
}

console.log('🔐 JNTUH Automation - Secret Generator\n');
console.log('Copy these values to your .env.local file:\n');
console.log('─'.repeat(60));
console.log(`CRON_SECRET=${generateSecret(32)}`);
console.log(`API_SECRET_KEY=${generateSecret(32)}`);
console.log('─'.repeat(60));
console.log('\n✅ Secrets generated successfully!');
console.log('\n⚠️  Keep these secrets safe and never commit them to version control.');
console.log('💡 Tip: Add these to your Vercel project environment variables for production.\n');
