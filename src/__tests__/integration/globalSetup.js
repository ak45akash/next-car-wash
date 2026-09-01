const { spawn } = require('child_process');
const path = require('path');

const PORT = process.env.INTEGRATION_PORT || '3000';
const BASE_URL = `http://localhost:${PORT}`;

let serverProcess = null;

async function waitForServer(maxAttempts = 90) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(`${BASE_URL}/api/health`);
      if (response.ok) return true;
    } catch {
      // Server not ready yet
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  return false;
}

module.exports = async function globalSetup() {
  const projectDir = path.resolve(__dirname, '../../..');

  // Reuse existing dev server if already running
  const alreadyRunning = await waitForServer(3);
  if (alreadyRunning) {
    const fs = require('fs');
    fs.writeFileSync(path.join(projectDir, '.integration-server.pid'), 'external');
    return;
  }

  serverProcess = spawn('npx', ['next', 'dev', '--webpack', '-p', PORT], {
    cwd: projectDir,
    stdio: 'pipe',
    env: { ...process.env, PORT },
    detached: true,
  });

  const ready = await waitForServer();
  if (!ready) {
    if (serverProcess?.pid) {
      try {
        process.kill(-serverProcess.pid);
      } catch {
        try { process.kill(serverProcess.pid); } catch { /* ignore */ }
      }
    }
    throw new Error(`Integration test server failed to start on ${BASE_URL}`);
  }

  // Write PID for teardown
  const fs = require('fs');
  fs.writeFileSync(
    path.join(projectDir, '.integration-server.pid'),
    String(serverProcess.pid)
  );
};
