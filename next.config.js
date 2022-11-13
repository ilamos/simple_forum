/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    secret: 'zv5JurTPeKVDWn0hHai7tItvWkMNxwgxwiOoeMonOs5HfIrQyDO2wVCoZTeOSJv6PmGodxksKJWP0gvP7cJGnkaeXs6FemyuBY2YRphUOMX05izbq6XLJo27YAxI7wr2',
    bcrypt_salt: 7,
  },
}

module.exports = nextConfig
