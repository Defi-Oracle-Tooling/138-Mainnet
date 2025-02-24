import { WebSocket, Server as WSServer } from 'ws';
import { Server } from 'http';
import { wsClients } from '../api/routes/monitoring';

export function setupWebSocket(server: Server) {
  const wss = new WSServer({ server });

  wss.on('connection', (ws: WebSocket) => {
    wsClients.add(ws);

    ws.on('message', async (message: string) => {
      try {
        const data = JSON.parse(message);
        switch (data.type) {
          case 'SUBSCRIBE_DEPLOYMENT':
            handleDeploymentUpdates(ws, data.deploymentId);
            break;
          case 'SUBSCRIBE_METRICS':
            handleMetricsUpdates(ws);
            break;
        }
      } catch (error) {
        ws.send(JSON.stringify({ type: 'ERROR', error: error.message }));
      }
    });

    ws.on('close', () => {
      wsClients.delete(ws);
    });
  });

  return wss;
}

function handleDeploymentUpdates(ws: WebSocket, deploymentId: string) {
  const interval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'DEPLOYMENT_UPDATE',
        deploymentId,
        status: 'in_progress',
        progress: Math.random() * 100
      }));
    } else {
      clearInterval(interval);
    }
  }, 1000);
}

function handleMetricsUpdates(ws: WebSocket) {
  const interval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'METRICS_UPDATE',
        timestamp: new Date().toISOString(),
        metrics: {
          cpu: Math.random() * 100,
          memory: Math.random() * 100,
          network: Math.random() * 1000
        }
      }));
    } else {
      clearInterval(interval);
    }
  }, 5000);
}
