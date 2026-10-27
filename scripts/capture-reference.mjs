import fs from 'node:fs/promises';
import { createPublicClient, http, toHex } from 'viem';
import { SqueekChain, ADDRESSES, SqueekNFTAbi, stringify } from '../packages/sdk/dist/index.js';
const records = [];
const client = createPublicClient({
  transport: (options) => {
    const base = http('https://ethereum-sepolia-rpc.publicnode.com', {
      batch: { batchSize: 25, wait: 10 },
      timeout: 20000,
    })(options);
    return {
      ...base,
      request: async (args) => {
        const result = await base.request(args);
        records.push({ method: args.method, params: args.params ?? [], result });
        return result;
      },
    };
  },
});
const kit = new SqueekChain({ publicClient: client });
const protocol = await kit.auditProtocol();
const blockNumber = protocol.snapshot.blockNumber;
const positions = [];
for (const id of [8889n, 8890n]) {
  const owner = await client.readContract({
    address: ADDRESSES.nft,
    abi: SqueekNFTAbi,
    functionName: 'ownerOf',
    args: [id],
    blockNumber,
  });
  positions.push({ tokenId: id, owner });
}
const data = {
  capturedAt: new Date().toISOString(),
  kind: 'recorded-audit',
  note: 'Real read-only Sepolia audit. Code identities checked; configuration drift is explicitly recorded. This saved snapshot is not live state. No transactions sent.',
  protocol,
  owners: positions,
};
await fs.mkdir('docs/evidence', { recursive: true });
await fs.mkdir('tests/fixtures', { recursive: true });
await fs.writeFile('docs/evidence/reference-snapshot.json', stringify(data) + '\n');
await fs.writeFile(
  'tests/fixtures/rpc-reference.json',
  stringify({ blockNumber: toHex(blockNumber), records }) + '\n',
);
console.log(stringify({ block: protocol.snapshot, owners: positions, requests: records.length }));
