import { Router } from 'express';
import { WebSocket } from 'ws';
import { getResourceMetrics, getDeploymentStatus } from '../../services/monitoring';

const router = Router();
const wsClients = new Set<WebSocket>();

router.get('/metrics', async (req, res) => {
  try {
    const metrics = await getResourceMetrics();
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/deployment-status/:id', async (req, res) => {
  try {
    const status = await getDeploymentStatus(req.params.id);
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/audit-logs', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const logs = await getAuditLogs(startDate as string, endDate as string);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { router as monitoringRouter, wsClients };
