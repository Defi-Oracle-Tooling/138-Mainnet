import { Router } from 'express';
import { PythonShell } from 'python-shell';
import { generateTerraform } from '../../services/terraform';
import { validateConfig } from '../../services/validation';
import { estimateCosts } from '../../services/ai';

const router = Router();

router.post('/save', async (req, res) => {
  try {
    const config = req.body;
    
    // Validate configuration
    const validationResult = await validateConfig(config);
    if (!validationResult.isValid) {
      return res.status(400).json({ errors: validationResult.errors });
    }

    // Generate Terraform code
    const terraform = await generateTerraform(config);

    // Get AI cost estimation
    const costs = await estimateCosts(config);

    // Store configuration
    // TODO: Add database integration

    res.json({
      success: true,
      terraform,
      costs,
      config,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/deploy', async (req, res) => {
  try {
    const { config, terraform } = req.body;

    // Run Python AI validation
    const aiValidation = await new Promise((resolve, reject) => {
      PythonShell.run(
        '../ai_engine/validate.py',
        { args: [JSON.stringify(config)] },
        (err, results) => {
          if (err) reject(err);
          resolve(results);
        }
      );
    });

    // TODO: Add deployment logic

    res.json({
      success: true,
      message: 'Deployment initiated',
      aiValidation,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
