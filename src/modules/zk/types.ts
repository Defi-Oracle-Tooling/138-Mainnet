import { CircuitId, ProofQuery } from '@0xpolygonid/js-sdk';

export interface ZKModuleConfig {
  polygonConfig: {
    rpcUrl: string;
    chainId: number;
    contractAddress: string;
  };
  identityConfig: {
    walletKey: string;
    profileData: {
      name?: string;
      description?: string;
    };
  };
}

export interface ZKIdentityCredential {
  id: string;
  type: string[];
  credentialSubject: Record<string, any>;
  issuer: string;
  issuanceDate: string;
}

export interface ZKProofRequest {
  credentialId: string;
  circuitId: CircuitId;
  query: ProofQuery;
}

export interface ZKProofMetadata {
  circuitId: CircuitId;
  commitment: string;
  timestamp: number;
  schema: string;
}

export interface ZKProofResult {
  id: string;
  proof: string;
  publicSignals: string[];
  verificationResult: boolean;
  metadata: ZKProofMetadata;
  verified: boolean;
  timestamp: number;
  storageId: string;
}

export interface ZKVerificationParams {
  circuitId: CircuitId;
  proofData: string;
  publicInputs: string[];
}
