export function validateEnv() {
  const requiredKeys = ['DATABASE_URL', 'RESEND_API_KEY'];
  const missing = requiredKeys.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return true;
}
