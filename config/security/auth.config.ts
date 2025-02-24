enum SecurityLevel {
  LOW,
  MEDIUM,
  HIGH,
}

export const securityConfig = {
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  sessionTimeout: 3600,
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 100
  },
  securityLevel: SecurityLevel.HIGH,
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
  },
  web3AuthConfig: {
    // ...existing code...
  }
};

export const encryptionConfig = {
  algorithm: 'aes-256-gcm',
  keyLength: 32,
  ivLength: 16,
  saltLength: 64
};
