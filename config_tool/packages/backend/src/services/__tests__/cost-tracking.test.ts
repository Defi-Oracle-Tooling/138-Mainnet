import { CostTrackingService } from '../cost-tracking';
import { WebSocket } from 'ws';

describe('CostTrackingService', () => {
  let costTrackingService: CostTrackingService;
  let mockWs: jest.Mocked<WebSocket>;

  beforeEach(() => {
    mockWs = {
      readyState: WebSocket.OPEN,
      send: jest.fn(),
      close: jest.fn(),
    } as unknown as jest.Mocked<WebSocket>;
    
    costTrackingService = new CostTrackingService();
  });

  it('should track costs for new deployments', () => {
    const deploymentId = 'test-123';
    costTrackingService.addClient(deploymentId, mockWs);
    expect(costTrackingService['clients'].has(deploymentId)).toBeTruthy();
  });

  it('should remove clients and clear intervals', () => {
    const deploymentId = 'test-123';
    costTrackingService.addClient(deploymentId, mockWs);
    costTrackingService.removeClient(deploymentId);
    expect(costTrackingService['clients'].has(deploymentId)).toBeFalsy();
    expect(costTrackingService['costIntervals'].has(deploymentId)).toBeFalsy();
  });

  it('should send cost updates to connected clients', done => {
    const deploymentId = 'test-123';
    mockWs.send = jest.fn(message => {
      const data = JSON.parse(message as string);
      expect(data.type).toBe('COST_UPDATE');
      expect(data.deploymentId).toBe(deploymentId);
      expect(data.costs).toBeDefined();
      done();
    });

    costTrackingService.addClient(deploymentId, mockWs);
  });
});
