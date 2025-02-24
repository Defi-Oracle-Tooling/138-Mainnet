export const safeConfig = {
    SAFE_ADDRESS: process.env.SAFE_ADDRESS || '',
    SAFE_SERVICE_URL: process.env.SAFE_SERVICE_URL || 'https://safe-transaction.mainnet.gnosis.io',
    REQUIRED_CONFIRMATIONS: 3,
    PROPOSAL_TIMEOUT: 72, // hours
    ALLOWED_DEPLOYERS: [
        // List of addresses allowed to create deployment proposals
    ],
    GUARDIAN_ADDRESS: process.env.GUARDIAN_ADDRESS || '',
};

export const deploymentConfigs = {
    maxFeePerGas: '100000000000', // 100 gwei
    maxPriorityFeePerGas: '2000000000', // 2 gwei
    gasLimit: 8000000,
    walletImplementation: {
        version: '1.3.0',
        address: '0x...',
    },
};
