import { useState } from 'react';
import { DecisionTree } from '../types/configuration';

interface ConfigFormProps {
  decisionTree: DecisionTree;
  onSubmit: (config: any) => void;
}

export const ConfigurationForm = ({ decisionTree, onSubmit }: ConfigFormProps) => {
  const [formState, setFormState] = useState({
    networkType: '',
    plugins: [] as string[],
    hyperledgerProducts: [] as string[]
  });

  const handleNetworkTypeChange = (type: string) => {
    setFormState(prev => ({
      ...prev,
      networkType: type
    }));
  };

  const handlePluginSelection = (plugin: string) => {
    setFormState(prev => ({
      ...prev,
      plugins: prev.plugins.includes(plugin) 
        ? prev.plugins.filter(p => p !== plugin)
        : [...prev.plugins, plugin]
    }));
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit(formState);
    }}>
      <div className="space-y-6">
        {/* Network Type Selection */}
        <div>
          <h3>{decisionTree.networkType.question}</h3>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(decisionTree.networkType.options).map(([type, data]) => (
              <button
                key={type}
                type="button"
                onClick={() => handleNetworkTypeChange(type)}
                className={`p-4 border rounded ${
                  formState.networkType === type ? 'border-blue-500' : 'border-gray-200'
                }`}
              >
                <h4>{type}</h4>
                <p>{data.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Plugin Selection */}
        <div>
          <h3>{decisionTree.plugins.question}</h3>
          <div className="space-y-2">
            {Object.entries(decisionTree.plugins.options).map(([plugin, data]) => (
              <label key={plugin} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formState.plugins.includes(plugin)}
                  onChange={() => handlePluginSelection(plugin)}
                />
                <div>
                  <span className="font-medium">{plugin}</span>
                  <p className="text-sm text-gray-500">{data.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Generate Configuration
        </button>
      </div>
    </form>
  );
};
