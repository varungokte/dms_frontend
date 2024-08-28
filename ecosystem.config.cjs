module.exports = {
  apps: [
    {
      name: 'dms-app',
      script: 'npm',
      args: 'run start:production',
      env_production : {
        NODE_ENV: 'production'
      }
    },
  ],
};


/* {
  name: `dms-app`,
  script: "npx",
  interpreter: "none",
  args: "serve -s build -p 3000"
}, */