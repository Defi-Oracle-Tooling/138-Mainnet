import { create, IPFSHTTPClient } from 'ipfs-http-client';

export class IPFSService {
  private ipfs: IPFSHTTPClient;

  constructor() {
    this.ipfs = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https'
    });
  }

  async uploadContract(contractData: Buffer) {
    const result = await this.ipfs.add(contractData);
    return result.cid.toString();
  }

  async getContract(cid: string) {
    const stream = this.ipfs.cat(cid);
    const data = [];
    for await (const chunk of stream) {
      data.push(chunk);
    }
    return Buffer.concat(data);
  }
}
