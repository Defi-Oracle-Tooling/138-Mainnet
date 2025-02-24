import { useWeb3Auth } from '../contexts/Web3AuthContext';
import Safe from '@safe-global/safe-core-sdk';
import { SafeTransactionDataPartial } from '@safe-global/safe-core-sdk-types';

export function useSafeDeployment() {
    const { provider, address } = useWeb3Auth();

    const proposeDeployment = async (deploymentData: SafeTransactionDataPartial) => {
        const safeSdk = await Safe.create({
            ethAdapter: provider,
            safeAddress: process.env.NEXT_PUBLIC_SAFE_ADDRESS!
        });

        const safeTransaction = await safeSdk.createTransaction({
            safeTransactionData: deploymentData
        });

        const safeTxHash = await safeSdk.getTransactionHash(safeTransaction);
        const senderSignature = await safeSdk.signTransactionHash(safeTxHash);

        return await safeSdk.proposeTransaction({
            safeTransactionData: deploymentData,
            safeTxHash,
            senderAddress: address,
            senderSignature: senderSignature.data,
        });
    };

    return { proposeDeployment };
}
