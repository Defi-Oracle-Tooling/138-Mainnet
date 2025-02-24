import { Router } from 'express';
import { analyzeConfiguration } from '../../services/ai';
import { deploymentService } from '../../services/deployment';

const router = Router();

router.post('/analyze', async (req, res) => {
  try {
    const config = req.body;
    const analysis = await analyzeConfiguration(config);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/estimate-costs', async (req, res) => {
  try {
    const config = req.body;
    const analysis = await analyzeConfiguration(config);
    res.json({
      costs: analysis.costs,
      recommendations: analysis.recommendations.filter(r => r.type === 'cost')
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/security-audit', async (req, res) => {
  try {
    const config = req.body;
    const analysis = await analyzeConfiguration(config);
    res.json({
      securityScore: analysis.risks.score,
      risks: analysis.risks.items,
      recommendations: analysis.recommendations.filter(r => r.type === 'security')
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
