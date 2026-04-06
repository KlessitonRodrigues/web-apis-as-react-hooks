const dotenv = {
  AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:3000',
  AUTH_API_URL: process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:3005',
};

export default dotenv;
