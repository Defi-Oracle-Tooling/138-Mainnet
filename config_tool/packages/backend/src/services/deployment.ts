import { exec } from 'child_process';
import { promisify } from 'util';
import { ConfigurationState } from '../types';
import { generateTerraform } from './terraform';
import { analyzeConfiguration } from './ai';

const execAsync = promisify(exec);

interface DeploymentResult {
  success: boolean;
  logs: string[];
  resources: string[];
  errors?: string[];
}

export class DeploymentService {
  private async runTerraform(config: ConfigurationState['config']): Promise<string> {
    try {
      const terraformConfig = await generateTerraform(config);
      await execAsync('terraform init');
      const { stdout } = await execAsync('terraform apply -auto-approve');
      return stdout;
    } catch (error) {
      throw new Error(`Terraform deployment failed: ${error.message}`);
    }
  }

  private async configureKubernetes(config: ConfigurationState['config']): Promise<string> {
    if (!config.deployment.kubernetes) return '';
    
    try {
      const { stdout } = await execAsync('kubectl apply -f kubernetes/');
      return stdout;
    } catch (error) {
      throw new Error(`Kubernetes configuration failed: ${error.message}`);
    }
  }

  async deploy(config: ConfigurationState['config']): Promise<DeploymentResult> {
    const logs: string[] = [];
    const resources: string[] = [];
    const errors: string[] = [];

    try {
      // Analyze configuration with AI
      const analysis = await analyzeConfiguration(config);
      if (analysis.risks.score < 0.7) {
        throw new Error('Configuration risk score too low for deployment');
      }

      // Deploy infrastructure
      const terraformOutput = await this.runTerraform(config);
      logs.push(terraformOutput);

      // Configure Kubernetes if enabled
      if (config.deployment.kubernetes) {
        const k8sOutput = await this.configureKubernetes(config);
        logs.push(k8sOutput);
      }

      // Parse created resources
      resources.push(...this.parseResources(terraformOutput));

      return {
        success: true,
        logs,
        resources,
      };
    } catch (error) {
      return {
        success: false,
        logs,
        resources,
        errors: [error.message],
      };
    }
  }

  private parseResources(terraformOutput: string): string[] {
    const resources: string[] = [];
    const lines = terraformOutput.split('\n');
    
    for (const line of lines) {
      if (line.includes('Created:')) {
        resources.push(line.split('Created:')[1].trim());
      }
    }
    
    return resources;
  }
}

export const deploymentService = new DeploymentService();
