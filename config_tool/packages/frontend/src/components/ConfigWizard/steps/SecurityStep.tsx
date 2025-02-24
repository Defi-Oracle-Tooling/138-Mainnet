import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { ConfigurationState } from '../index';

interface Props {
  state: ConfigurationState;
  setState: React.Dispatch<React.SetStateAction<ConfigurationState>>;
}

export default function SecurityStep({ state, setState }: Props) {
  const securityOptions = [
    { id: 'mfa', label: 'Multi-Factor Authentication', description: 'Enable MFA for all users' },
    { id: 'hsm', label: 'Hardware Security Module', description: 'Use HSM for key management' },
    { id: 'rbac', label: 'Role-Based Access Control', description: 'Implement RBAC policies' },
  ];

  const toggleOption = (optionId: keyof typeof state.config.security) => {
    setState(prev => ({
      ...prev,
      config: {
        ...prev.config,
        security: {
          ...prev.config.security,
          [optionId]: !prev.config.security[optionId],
        },
      },
    }));
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Security Configuration</h2>
        <div className="space-y-6">
          {securityOptions.map(option => (
            <div key={option.id} className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{option.label}</h3>
                <p className="text-sm text-gray-500">{option.description}</p>
              </div>
              <Switch
                checked={state.config.security[option.id as keyof typeof state.config.security]}
                onCheckedChange={() => toggleOption(option.id as keyof typeof state.config.security)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
