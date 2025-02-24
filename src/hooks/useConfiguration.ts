import { useState } from 'react';
import { DecisionTree } from '../types/configuration';

export const useConfiguration = (decisionTree: DecisionTree) => {
  const [config, setConfig] = useState<any>(null);

  const validateConfiguration = (formState: any) => {
    const selectedNetwork = decisionTree.networkType.options[formState.networkType];
    if (!selectedNetwork) {
      throw new Error('Invalid network type selected');
    }

    // Validate plugin dependencies
    for (const plugin of formState.plugins) {
      const pluginConfig = decisionTree.plugins.options[plugin];
      if (pluginConfig.dependencies.length > 0) {
        // Check if dependencies are satisfied
        // Add your dependency validation logic here
      }
    }

    return true;
  };

  const generateConfiguration = (formState: any) => {
    if (!validateConfiguration(formState)) {
      return null;
    }

    // Generate configuration based on form state
    return {
      network: {
        type: formState.networkType,
        requirements: decisionTree.networkType.options[formState.networkType].requirements
      },
      plugins: formState.plugins.map((plugin: string) => ({
        name: plugin,
        ...decisionTree.plugins.options[plugin]
      })),
      timestamp: new Date().toISOString()
    };
  };

  const handleConfigSubmit = (formState: any) => {
    const newConfig = generateConfiguration(formState);
    if (newConfig) {
      setConfig(newConfig);
    }
  };

  return {
    config,
    handleConfigSubmit
  };
};
