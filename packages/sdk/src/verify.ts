import { getAddress, keccak256, parseAbi, type Hex, type PublicClient } from 'viem';
import { ADDRESSES, CHAIN_ID, DEPLOYMENT } from './deployment';
import { SqueekCoreAbi, SqueekMiningAbi, SqueekTokenAbi, SqueekNFTAbi } from './generated/abis';
import { SqueekKitError, requireInput } from './errors';
export interface Snapshot {
  blockNumber: bigint;
  blockHash: Hex;
  timestamp: bigint;
  chainId: number;
  release: string;
  verified: boolean;
  configurationDrift: { field: string; expected: unknown; actual: unknown }[];
}
const implementationSlot = '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc';
const adminSlot = '0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103';
const identityAbi = parseAbi([
  'function implementationCodeAddress() view returns(address)',
  'function implementationCodeVersion() view returns(uint64)',
  'function implementationStorageLayoutDigest() view returns(bytes32)',
  'function owner() view returns(address)',
]);
function equal(actual: unknown, expected: unknown, field: string) {
  if (String(actual).toLowerCase() !== String(expected).toLowerCase())
    throw new SqueekKitError('DEPLOYMENT_MISMATCH', `Deployment check failed: ${field}.`, {
      field,
      expected,
      actual,
    });
}
function slotAddress(value: Hex | undefined) {
  if (!value || !/^0x[0-9a-fA-F]{64}$/.test(value))
    throw new SqueekKitError('DEPLOYMENT_MISMATCH', 'Missing proxy storage slot.');
  return getAddress(`0x${value.slice(-40)}`);
}
export async function assertCanonical(client: PublicClient, snapshot: Snapshot) {
  const block = await client.getBlock({ blockNumber: snapshot.blockNumber });
  if (block.hash !== snapshot.blockHash)
    throw new SqueekKitError(
      'REORG',
      'The snapshot block changed. Read again before using these results.',
    );
}
export async function verifyDeployment(
  client: PublicClient,
  options: {
    confirmations?: number;
    blockNumber?: bigint;
    observeConfigurationDrift?: boolean;
  } = {},
): Promise<Snapshot> {
  const confirmations = options.confirmations ?? 12;
  requireInput(
    Number.isInteger(confirmations) && confirmations >= 0 && confirmations <= 256,
    'Confirmations must be an integer from 0 to 256.',
  );
  const chainId = await client.getChainId();
  if (chainId !== CHAIN_ID)
    throw new SqueekKitError(
      'WRONG_CHAIN',
      'SqueekKit supports the documented Sepolia deployment only.',
      { expected: CHAIN_ID, actual: chainId },
    );
  const tip = await client.getBlockNumber({ cacheTime: 0 });
  const blockNumber = options.blockNumber ?? tip - BigInt(confirmations);
  requireInput(
    blockNumber >= BigInt(DEPLOYMENT.contracts.SqueekMining.deployedAtBlock) && blockNumber <= tip,
    'Snapshot block must be after deployment and no later than the chain tip.',
  );
  const block = await client.getBlock({ blockNumber });
  if (!block.hash) throw new SqueekKitError('RPC_ERROR', 'A confirmed block hash is required.');
  const snapshot: Snapshot = {
    blockNumber,
    blockHash: block.hash,
    timestamp: block.timestamp,
    chainId,
    release: DEPLOYMENT.release,
    verified: true,
    configurationDrift: [],
  };
  await Promise.all(
    ['SqueekCore', 'SqueekMining'].map(async (name) => {
      const record = DEPLOYMENT.contracts[name as 'SqueekCore' | 'SqueekMining'];
      const proxy = getAddress(record.address);
      const [implementation, admin] = await Promise.all([
        client.getStorageAt({ address: proxy, slot: implementationSlot, blockNumber }),
        client.getStorageAt({ address: proxy, slot: adminSlot, blockNumber }),
      ]);
      const implAddress = slotAddress(implementation);
      const adminAddress = slotAddress(admin);
      equal(implAddress, record.implementation, `${name}.implementation`);
      equal(adminAddress, record.proxyAdmin, `${name}.proxyAdmin`);
      const [code, reported, version, layout, owner] = await Promise.all([
        client.getCode({ address: implAddress, blockNumber }),
        client.readContract({
          address: proxy,
          abi: identityAbi,
          functionName: 'implementationCodeAddress',
          blockNumber,
        }),
        client.readContract({
          address: proxy,
          abi: identityAbi,
          functionName: 'implementationCodeVersion',
          blockNumber,
        }),
        client.readContract({
          address: proxy,
          abi: identityAbi,
          functionName: 'implementationStorageLayoutDigest',
          blockNumber,
        }),
        client.readContract({
          address: adminAddress,
          abi: identityAbi,
          functionName: 'owner',
          blockNumber,
        }),
      ]);
      equal(
        code && code !== '0x' ? keccak256(code) : null,
        record.implementationRuntimeHash,
        `${name}.runtimeHash`,
      );
      equal(reported, record.implementation, `${name}.reportedImplementation`);
      equal(version, record.implementationVersion, `${name}.version`);
      equal(layout, record.storageLayoutDigest, `${name}.layout`);
      equal(owner, DEPLOYMENT.operational.governanceTimelock.address, `${name}.adminOwner`);
    }),
  );
  const [
    config,
    miningCore,
    policy,
    tokenMining,
    nftMining,
    nftCore,
    nftGovernance,
    tokenCode,
    nftCode,
  ] = await Promise.all([
    client.readContract({
      address: ADDRESSES.core,
      abi: SqueekCoreAbi,
      functionName: 'configuration',
      blockNumber,
    }),
    client.readContract({
      address: ADDRESSES.mining,
      abi: SqueekMiningAbi,
      functionName: 'core',
      blockNumber,
    }),
    client.readContract({
      address: ADDRESSES.mining,
      abi: SqueekMiningAbi,
      functionName: 'collectionPolicy',
      args: [0],
      blockNumber,
    }),
    client.readContract({
      address: ADDRESSES.token,
      abi: SqueekTokenAbi,
      functionName: 'mining',
      blockNumber,
    }),
    client.readContract({
      address: ADDRESSES.nft,
      abi: SqueekNFTAbi,
      functionName: 'mining',
      blockNumber,
    }),
    client.readContract({
      address: ADDRESSES.nft,
      abi: SqueekNFTAbi,
      functionName: 'sqkCore',
      blockNumber,
    }),
    client.readContract({
      address: ADDRESSES.nft,
      abi: SqueekNFTAbi,
      functionName: 'governance',
      blockNumber,
    }),
    client.getCode({ address: ADDRESSES.token, blockNumber }),
    client.getCode({ address: ADDRESSES.nft, blockNumber }),
  ]);
  equal(miningCore, ADDRESSES.core, 'mining.core');
  equal(tokenMining, ADDRESSES.mining, 'token.mining');
  equal(policy.nft, ADDRESSES.nft, 'policy.nft');
  equal(nftMining, ADDRESSES.mining, 'nft.mining');
  equal(nftCore, ADDRESSES.core, 'nft.core');
  equal(nftGovernance, DEPLOYMENT.operational.governanceTimelock.address, 'nft.governance');
  if (!tokenCode || tokenCode === '0x' || !nftCode || nftCode === '0x')
    throw new SqueekKitError('DEPLOYMENT_MISMATCH', 'An immutable contract has no code.');
  for (const [key, expected] of Object.entries(DEPLOYMENT.coreConfiguration)) {
    const actual = config[key as keyof typeof config];
    if (
      options.observeConfigurationDrift &&
      String(actual).toLowerCase() !== String(expected).toLowerCase()
    ) {
      snapshot.configurationDrift.push({ field: `core.configuration.${key}`, expected, actual });
      snapshot.verified = false;
    } else equal(actual, expected, `core.configuration.${key}`);
  }
  equal(policy.maximumLevel, DEPLOYMENT.squeeksPolicy.maximumLevel, 'policy.maximumLevel');
  equal(policy.levels.length, DEPLOYMENT.squeeksPolicy.levels.length, 'policy.levels.length');
  DEPLOYMENT.squeeksPolicy.levels.forEach((level, index) => {
    equal(policy.levels[index]?.weight, level.weight, `policy.levels.${index}.weight`);
    equal(
      policy.levels[index]?.cooldownBlocks,
      level.cooldownBlocks,
      `policy.levels.${index}.cooldownBlocks`,
    );
  });
  await assertCanonical(client, snapshot);
  return snapshot;
}
