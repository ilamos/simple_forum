/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    secret: 'sda2y7cyta756ry87atasjhd73t4a7sdczcyt',
    bcrypt_salt: 7,
  },
}

module.exports = nextConfig
