import { createSqueekKit, stringify, publicError } from '@squeekkit/sdk';
const owner = process.env.OWNER_ADDRESS;
const selected = process.env.TOKEN_IDS;
if (!owner || !selected) {
  console.error(
    'Set OWNER_ADDRESS and TOKEN_IDS (comma-separated explicit IDs). This example only simulates and prints an unsigned call.',
  );
  process.exitCode = 1;
} else {
  const kit = createSqueekKit({ chain: { rpcUrl: process.env.SQUEEKKIT_RPC_URL } });
  try {
    console.log(
      stringify(
        await kit.chain.prepareClaim(
          owner,
          selected.split(',').map((id) => id.trim()),
        ),
      ),
    );
  } catch (error) {
    console.error(stringify(publicError(error)));
    process.exitCode = 1;
  }
}
