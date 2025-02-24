import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import EnvironmentStep from './steps/EnvironmentStep';
import CloudProviderStep from './steps/CloudProviderStep';
import SecurityStep from './steps/SecurityStep';
import DeploymentPreview from './preview/DeploymentPreview';

export type ConfigurationState = {
  currentStep: number;
  config: {
    environment: string;
    cloudProviders: string[];
    security: {
      mfa: boolean;
      hsm: boolean;
      rbac: boolean;
    };
    deployment: {
      kubernetes: boolean;
      terraform: Record<string, any>;
    };
  };
};

export default function ConfigWizard() {
  const [state, setState] = useState<ConfigurationState>({
    currentStep: 0,
    config: {
      environment: '',
      cloudProviders: [],
      security: {
        mfa: false,
        hsm: false,
        rbac: false,
      },
      deployment: {
        kubernetes: false,
        terraform: {},
      },
    },
  });

  const steps = [
    <EnvironmentStep key="env" state={state} setState={setState} />,
    <CloudProviderStep key="cloud" state={state} setState={setState} />,
    <SecurityStep key="security" state={state} setState={setState} />,
  ];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Configuration Wizard</h1>
          <div className="flex gap-2 mt-4">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 flex-1 rounded ${
                  idx <= state.currentStep ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {steps[state.currentStep]}

        <div className="mt-8">
          <DeploymentPreview config={state.config} />
        </div>
      </div>
    </DndProvider>
  );
}
