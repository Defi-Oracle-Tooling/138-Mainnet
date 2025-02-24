export interface NetworkRequirements {
  minValidators?: number;
  blockTime?: number;
  epochLength?: number;
  minSigners?: number;
  blockPeriod?: number;
}

export interface NetworkOption {
  description: string;
  requirements: NetworkRequirements;
}

export interface PluginOption {
  description: string;
  dependencies: string[];
}

export interface HyperledgerProduct {
  description: string;
  integration: string;
}

export interface DecisionTree {
  networkType: {
    question: string;
    options: Record<string, NetworkOption>;
  };
  plugins: {
    question: string;
    options: Record<string, PluginOption>;
  };
  hyperledgerProducts: {
    compatible: Record<string, HyperledgerProduct>;
  };
}
