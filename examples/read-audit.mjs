import { createSqueekKit, stringify, publicError } from '@squeekkit/sdk';
const kit = createSqueekKit({ chain: { rpcUrl: process.env.SQUEEKKIT_RPC_URL } });
try {
  console.log(stringify(await kit.chain.auditProtocol()));
} catch (error) {
  console.error(stringify(publicError(error)));
  process.exitCode = 1;
}
