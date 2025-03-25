// Initial admin credentials
export const ADMIN_CREDENTIALS = {
  employeeId: 'ADMIN123',
  password: 'Admin@12345' // This should be hashed in production
};

// In production, these credentials should be:
// 1. Stored in environment variables
// 2. Passwords should be hashed
// 3. Multiple admin accounts should be managed in a secure database 