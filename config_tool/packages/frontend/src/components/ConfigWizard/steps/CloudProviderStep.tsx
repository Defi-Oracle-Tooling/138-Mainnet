import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ConfigurationState } from '../index';

interface Props {
  state: ConfigurationState;
  setState: React.Dispatch<React.SetStateAction<ConfigurationState>>;
}

export default function CloudProviderStep({ state, setState }: Props) {
  const providers = [
    { id: 'aws', name: 'AWS', icon: '☁️' },
    { id: 'gcp', name: 'Google Cloud', icon: '🌥️' },
    { id: 'azure', name: 'Azure', icon: '⚡' },
  ];

  const toggleProvider = (providerId: string) => {
    setState(prev => {
      const providers = prev.config.cloudProviders.includes(providerId)
        ? prev.config.cloudProviders.filter(p => p !== providerId)
        : [...prev.config.cloudProviders, providerId];

      return {
        ...prev,
        config: { ...prev.config, cloudProviders: providers },
      };
    });
  };

  const handleNext = () => {
    if (state.config.cloudProviders.length > 0) {
      setState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Select Cloud Providers</h2>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {providers.map(provider => (
            <Button
              key={provider.id}
              onClick={() => toggleProvider(provider.id)}
              variant={state.config.cloudProviders.includes(provider.id) ? 'default' : 'outline'}
            >
              <span className="mr-2">{provider.icon}</span>
              {provider.name}
            </Button>
          ))}
        </div>
        <Button 
          onClick={handleNext}
          disabled={state.config.cloudProviders.length === 0}
          className="w-full"
        >
          Next
        </Button>
      </CardContent>
    </Card>
  );
}
