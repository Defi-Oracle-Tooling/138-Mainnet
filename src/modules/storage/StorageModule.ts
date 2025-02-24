import { createHelia } from 'helia';
import { unixfs } from '@helia/unixfs';
import type { CID } from 'multiformats/cid';
import { MemoryBlockstore } from 'blockstore-core';
import { MemoryDatastore } from 'datastore-core';

export class StorageModule {
  private helia: Awaited<ReturnType<typeof createHelia>>;
  private fs: Awaited<ReturnType<typeof unixfs>>;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    const blockstore = new MemoryBlockstore();
    const datastore = new MemoryDatastore();

    this.helia = await createHelia({
      blockstore,
      datastore
    });

    this.fs = unixfs(this.helia);
  }

  async store(content: string | Uint8Array): Promise<CID> {
    if (!this.fs) throw new Error('Storage not initialized');
    const data = typeof content === 'string' ? new TextEncoder().encode(content) : content;
    return this.fs.addBytes(data);
  }

  async retrieve(cid: CID): Promise<Uint8Array> {
    if (!this.fs) throw new Error('Storage not initialized');
    const decoder = new TextDecoder();
    const chunks = [];
    
    for await (const chunk of this.fs.cat(cid)) {
      chunks.push(chunk);
    }
    
    return new Uint8Array(Buffer.concat(chunks));
  }
}
