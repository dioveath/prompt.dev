/** @type {import('next').NextConfig} */


const nextConfig = {
  experimental: {
    appDir: false,
  },
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com'
    ],
  }
}

module.exports = nextConfig
