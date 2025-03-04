const nextConfig = {
  env: {
    NEXT_PUBLIC_HOST: process.env.NEXT_PUBLIC_HOST,
    NEXT_TOKEN: process.env.NEXT_TOKEN,
    NEXT_PUBLIC_PORT: process.env.NEXT_PUBLIC_PORT,
  },
};

module.exports = nextConfig;
