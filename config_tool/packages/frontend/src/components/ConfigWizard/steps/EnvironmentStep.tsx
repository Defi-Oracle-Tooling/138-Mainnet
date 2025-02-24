import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ConfigurationState } from '../index';

interface Props {
  state: ConfigurationState;
  setState: React.Dispatch<React.SetStateAction<ConfigurationState>>;
}

export default function EnvironmentStep({ state, setState }: Props) {
  const environments = ['Development', 'Testing', 'Production'];

  const handleSelect = (env: string) => {
    setState(prev => ({
      ...prev,
      config: { ...prev.config, environment: env },
      currentStep: prev.currentStep + 1,
    }));
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Select Environment</h2>
        <div className="grid grid-cols-3 gap-4">
          {environments.map(env => (
            <Button
              key={env}
              onClick={() => handleSelect(env)}
              variant={state.config.environment === env ? 'default' : 'outline'}
            >
              {env}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
