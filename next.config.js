/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  webpack: (config) => {
    config.externals.push({
      'better-sqlite3': 'commonjs better-sqlite3',
    })
    return config
  },
}

module.exports = nextConfig 