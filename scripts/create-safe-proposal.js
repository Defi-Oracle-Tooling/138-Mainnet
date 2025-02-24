const { SafeApiKit, EthersAdapter } = require('@safe-global/api-kit');
const { ethers } = require('ethers');

async function createSafeProposal() {
    if (!process.env.RPC_URL) throw new Error('RPC_URL not set');
    if (!process.env.SAFE_ADDRESS) throw new Error('SAFE_ADDRESS not set');
    if (!process.env.SAFE_SERVICE_URL) throw new Error('SAFE_SERVICE_URL not set');
    if (!process.env.DEPLOYER_KEY) throw new Error('DEPLOYER_KEY not set');

    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const signer = new ethers.Wallet(process.env.DEPLOYER_KEY, provider);
    const ethAdapter = new EthersAdapter({ ethers, signer });

    const safeService = new SafeApiKit({
        txServiceUrl: process.env.SAFE_SERVICE_URL,
        ethAdapter
    });

    const safeAddress = process.env.SAFE_ADDRESS;
    const deploymentData = require('./deployment-data.json');

    // Create transaction proposal
    const safeTransaction = {
        to: deploymentData.contractAddress,
        value: '0',
        data: deploymentData.deploymentData,
        operation: 0, // CALL
    };

    // Propose transaction to Safe
    await safeService.proposeTransaction({
        safeAddress,
        safeTransaction,
        safeTxHash: await safeService.getTransactionHash(safeAddress, safeTransaction),
        senderAddress: await signer.getAddress(),
    });

    console.log('Deployment proposal created');
}

createSafeProposal().catch(console.error);
