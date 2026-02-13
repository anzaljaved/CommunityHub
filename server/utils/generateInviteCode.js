const crypto = require('crypto');

// Generate a 7-character uppercase alphanumeric invite code
function generateInviteCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 7; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `IH-${result}`;
}

module.exports = generateInviteCode;
