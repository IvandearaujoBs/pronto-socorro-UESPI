/** @type {import('next').NextConfig} */
const nextConfig = {
  // Otimizações para reduzir compilações
  swcMinify: true,
  // Reduzir recompilações em desenvolvimento
  webpack: (config) => {
    config.externals.push({
      'better-sqlite3': 'commonjs better-sqlite3',
    })
    return config
  },
}

module.exports = nextConfig 