module.exports = {
  apps: [
    {
      name: 'shry',
      // Run Next.js directly via its binary to avoid orphaned npm processes
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 1000',
      cwd: './',
      instances: 1, // Set to 'max' or number of CPU cores for cluster mode if needed
      exec_mode: 'fork', // Use 'cluster' when instances > 1
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      time: true, // Prefix logs with timestamps
      env: {
        NODE_ENV: 'production',
        PORT: 1000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 1000,
      },
    },
  ],
};
