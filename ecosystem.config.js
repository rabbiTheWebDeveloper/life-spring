module.exports = {
    apps: [
      {
        name: 'admin-web', // Name of your application
        script: 'node_modules/next/dist/bin/next', // Next.js command-line tool
        args: 'start -p 3008', // Start the Next.js app in production mode
        exec_mode: 'fork', // Run in cluster mode
      },
    ],
  };
  
