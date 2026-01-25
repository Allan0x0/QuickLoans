module.exports = {
  apps: [
    {
      name: 'loans',
      cwd: '/root/QuickLoans',
      script: 'pnpm',
      args: 'start',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3004,
        DATABASE_URL: 'mysql://allan:function6781@localhost:3306/loans',
        SESSION_SECRET: '78bee6e78ca663f1b4c618c5e9928dd6',
        CLOUDINARY_API_KEY: '993114726362865',
        CLOUDINARY_API_SECRET: 'Rp2KAu3wG3ydmJrQQmxp-iZM-LY',
        CLOUDINARY_CLOUD_NAME: 'dv2mivpiz',
        CLOUDINARY_UPLOAD_RESET: 'pbpinhve',
      },
    },
  ],
};
