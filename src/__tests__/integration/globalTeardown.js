const fs = require('fs');
const path = require('path');

module.exports = async function globalTeardown() {
  const pidFile = path.resolve(__dirname, '../../../.integration-server.pid');
  if (!fs.existsSync(pidFile)) return;

  const pidContent = fs.readFileSync(pidFile, 'utf8');
  if (pidContent === 'external') {
    fs.unlinkSync(pidFile);
    return;
  }

  const pid = Number(pidContent);
  try {
    process.kill(-pid, 'SIGTERM');
  } catch {
    try {
      process.kill(pid, 'SIGTERM');
    } catch {
      // Already stopped
    }
  }
  fs.unlinkSync(pidFile);
};
