import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // AASA file for iOS Universal Links
        source: '/.well-known/apple-app-site-association',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/Contact',
        destination: '/Contact.html',
      },
      {
        source: '/About',
        destination: '/About.html',
      },
      {
        source: '/Careers',
        destination: '/Careers.html',
      },
      {
        source: '/Compliance',
        destination: '/Compliance.html',
      },
      {
        source: '/Consumers',
        destination: '/Consumers.html',
      },
      {
        source: '/Cookies',
        destination: '/Cookies.html',
      },
      {
        source: '/FAQ',
        destination: '/FAQ.html',
      },
      {
        source: '/Jurix-Plans',
        destination: '/Jurix Plans.html',
      },
      {
        source: '/Lawyers',
        destination: '/Lawyers.html',
      },
      {
        source: '/Leadership',
        destination: '/Leadership.html',
      },
      {
        source: '/Privacy-Policy',
        destination: '/Privacy Policy.html',
      },
      {
        source: '/Refund-Policy',
        destination: '/Refund Policy.html',
      },
      {
        source: '/Terms-of-Use',
        destination: '/Terms of Use.html',
      },
      {
        source: '/The-Ecosystem',
        destination: '/The Ecosystem.html',
      },
      {
        source: '/Trust-Security',
        destination: '/Trust & Security.html',
      },
    ];
  },
};

export default nextConfig;
