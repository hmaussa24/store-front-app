module.exports = {
  apps: [
    {
      name: 'store-front',
      script: './build/server/index.js',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_test: {
        NODE_ENV: 'test',
        PORT: 3001,
      },
      env_staging: {
        NODE_ENV: 'staging',
        PORT: 3002,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3003,
      },
    },
  ],
};
