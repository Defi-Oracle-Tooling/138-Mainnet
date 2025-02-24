import { analyzeConfiguration, validateConfiguration } from '../ai';

describe('AI Service', () => {
  const mockConfig = {
    environment: 'production',
    cloudProviders: ['aws', 'gcp'],
    security: {
      mfa: true,
      hsm: true,
      rbac: true
    },
    deployment: {
      kubernetes: true,
      terraform: {}
    }
  };

  it('should analyze configuration successfully', async () => {
    const result = await analyzeConfiguration(mockConfig);
    expect(result).toHaveProperty('costs');
    expect(result).toHaveProperty('risks');
    expect(result).toHaveProperty('recommendations');
  });

  it('should validate configuration', async () => {
    const result = await validateConfiguration(mockConfig);
    expect(result).toHaveProperty('isValid');
    expect(result).toHaveProperty('score');
  });
});
