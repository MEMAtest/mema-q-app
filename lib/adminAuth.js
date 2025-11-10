export function requireAdminAuth(req) {
  const token = process.env.ADMIN_API_KEY;
  const header = req.headers.authorization;

  if (!token) {
    console.warn('ADMIN_API_KEY is not configured.');
    return false;
  }

  if (!header || header !== `Bearer ${token}`) {
    return false;
  }

  return true;
}
