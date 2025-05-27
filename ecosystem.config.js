module.exports = {
  apps: [
    {
      name: 'store-front',
      script: './build/server/index.js',
      env: {
        NODE_ENV: 'development',
        PORT: 5000,
      },
      env_test: {
        NODE_ENV: 'test',
      },
      env_staging: {
        NODE_ENV: 'staging',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
