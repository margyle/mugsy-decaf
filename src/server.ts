import { buildApp } from './app';
import { envConfig } from './config';
import { networkInterfaces } from 'os';
const start = async () => {
  const app = buildApp();

  try {
    // Use 0.0.0.0 to bind to all interfaces, but show actual IP addresses
    await app.listen({
      port: envConfig.PORT,
      host: '0.0.0.0',
    });

    // Get local IP addresses for display
    const interfaces = networkInterfaces();
    const localIPs: string[] = [];

    Object.values(interfaces).forEach(iface => {
      if (iface) {
        iface.forEach(alias => {
          if (alias.family === 'IPv4' && !alias.internal) {
            localIPs.push(alias.address);
          }
        });
      }
    });

    app.log.info(`Server is running on:`);
    app.log.info(`  - Local:   http://localhost:${envConfig.PORT}`);
    localIPs.forEach(ip => {
      app.log.info(`  - Network: http://${ip}:${envConfig.PORT}`);
    });

    if (envConfig.NODE_ENV !== 'production') {
      app.log.info(`API documentation available at:`);
      app.log.info(
        `  - Local:   http://localhost:${envConfig.PORT}/documentation`,
      );
      localIPs.forEach(ip => {
        app.log.info(
          `  - Network: http://${ip}:${envConfig.PORT}/documentation`,
        );
      });
    }
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

// Start the server if this file is run directly
if (require.main === module) {
  start();
}

export { start };
