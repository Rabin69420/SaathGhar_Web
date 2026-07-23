import type { NextConfig } from 'next';

const backendURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8089";
const IsDEV = backendURL.startsWith("http://localhost") || backendURL.startsWith("http://127.0.0.1");

let hostname = 'localhost';
let port = '8089';
try {
  const url = new URL(backendURL);
  hostname = url.hostname;
  port = url.port || (url.protocol === 'https:' ? '443' : '80');
} catch {
  // Fallback if parsing fails
}

const config: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: IsDEV,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8089',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8089',
        pathname: '/uploads/**',
      },
      {
        protocol: backendURL.startsWith('https') ? 'https' : 'http',
        hostname: hostname,
        port: port,
        pathname: '/uploads/**',
      }
    ]
  },
};

export default config;
