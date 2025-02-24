import { Server } from 'http';
import WebSocket from 'ws';
import { setupWebSocket } from '../websocket';

describe('WebSocket Service', () => {
  let server: Server;
  let wss: WebSocket.Server;
  let ws: WebSocket;

  beforeAll(() => {
    server = new Server();
    wss = setupWebSocket(server);
    server.listen(8080);
  });

  beforeEach(done => {
    ws = new WebSocket('ws://localhost:8080');
    ws.on('open', () => done());
  });

  afterEach(() => {
    ws.close();
  });

  afterAll(() => {
    wss.close();
    server.close();
  });

  it('should handle deployment updates', done => {
    ws.send(JSON.stringify({
      type: 'SUBSCRIBE_DEPLOYMENT',
      deploymentId: 'test-123'
    }));

    ws.on('message', data => {
      const message = JSON.parse(data.toString());
      expect(message.type).toBe('DEPLOYMENT_UPDATE');
      expect(message.deploymentId).toBe('test-123');
      expect(message.progress).toBeDefined();
      done();
    });
  });

  it('should handle metrics updates', done => {
    ws.send(JSON.stringify({
      type: 'SUBSCRIBE_METRICS'
    }));

    ws.on('message', data => {
      const message = JSON.parse(data.toString());
      expect(message.type).toBe('METRICS_UPDATE');
      expect(message.metrics).toHaveProperty('cpu');
      expect(message.metrics).toHaveProperty('memory');
      done();
    });
  });
});
