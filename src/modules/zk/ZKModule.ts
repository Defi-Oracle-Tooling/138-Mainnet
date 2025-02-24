import { 
  PolygonIdSdk, 
  IdentityWallet,
  IIdentityWallet,
  core,
  ProofGenerationParams,
  VerificationParams 
} from '@0xpolygonid/js-sdk';
import { ZKModuleConfig, ZKIdentityCredential, ZKProofRequest, ZKProofResult } from './types';
import { StorageModule } from '../storage/StorageModule';

export class ZKModule {
  private sdk: PolygonIdSdk;
  private identityWallet: IIdentityWallet;
  private storage: StorageModule;

  constructor(config: ZKModuleConfig) {
    this.sdk = new PolygonIdSdk({
      rpcUrl: config.polygonConfig.rpcUrl,
      chainId: config.polygonConfig.chainId,
      contract: config.polygonConfig.contractAddress,
    });

    this.identityWallet = new IdentityWallet({
      keyPath: config.identityConfig.walletKey,
      profile: config.identityConfig.profileData,
    });

    this.storage = new StorageModule();
  }

  async createIdentity(): Promise<string> {
    try {
      const identity = await this.identityWallet.createIdentity({
        method: core.DidMethod.Iden3,
        blockchain: core.Blockchain.Polygon,
        networkId: core.NetworkId.Main
      });
      return identity.did;
    } catch (error) {
      throw new Error(`Identity creation failed: ${error.message}`);
    }
  }

  async addCredential(credential: ZKIdentityCredential): Promise<string> {
    try {
      return await this.identityWallet.addCredential(credential);
    } catch (error) {
      throw new Error(`Failed to add credential: ${error.message}`);
    }
  }

  async generateProof(params: ProofGenerationParams): Promise<ZKProofResult> {
    try {
      const proof = await this.sdk.proofService.generate(params);
      const proofCID = await this.storage.store(JSON.stringify(proof));
      
      return {
        id: params.credential.id,
        proof: proof.proof,
        publicSignals: proof.publicSignals,
        verificationResult: true,
        storageId: proofCID.toString()
      };
    } catch (error) {
      throw new Error(`Proof generation failed: ${error.message}`);
    }
  }

  async verifyProof(proofResult: ZKProofResult): Promise<boolean> {
    try {
      return await this.sdk.proofService.verify({
        proof: proofResult.proof,
        publicSignals: proofResult.publicSignals
      });
    } catch (error) {
      throw new Error(`Failed to verify proof: ${error.message}`);
    }
  }
}
