export interface Position {
  activeWeight: bigint;
  pendingWeight: bigint;
  pendingRound: number;
  nextMergeBlock: number;
  level: number;
  lastIndex: bigint;
  accruedScaled: bigint;
}
export interface MergeInput {
  survivorId: bigint;
  donorId: bigint;
  survivor: Position;
  donor: Position;
  height: bigint;
  maximumLevel: number;
}
/** Uses completed Squeek blocks, never wall-clock time or an assumed production rate. */
export function evaluateMerge(input: MergeInput) {
  const { survivorId, donorId, survivor, donor, height, maximumLevel } = input;
  const reasons: string[] = [];
  if (survivorId === donorId) reasons.push('The survivor and donor must be different NFTs.');
  if (!survivor.level || !donor.level) reasons.push('Both NFTs need a live mining position.');
  if (survivor.level !== donor.level) reasons.push('Both NFTs must have the same level.');
  if (survivor.level >= maximumLevel || donor.level >= maximumLevel)
    reasons.push('An NFT is already at the maximum level.');
  for (const [id, position] of [
    [survivorId, survivor],
    [donorId, donor],
  ] as const) {
    if (position.pendingRound !== 0)
      reasons.push(`Squeek #${id} has power pending for round ${position.pendingRound}.`);
    if (BigInt(position.nextMergeBlock) > height)
      reasons.push(
        `Squeek #${id} needs ${BigInt(position.nextMergeBlock) - height} more completed Squeek blocks.`,
      );
  }
  return {
    eligible: reasons.length === 0,
    reasons,
    survivorId,
    donorId,
    newLevel: reasons.length ? null : survivor.level + 1,
    warning: `Squeek #${donorId} will be burned permanently. Squeek #${survivorId} keeps its ID and image and receives both positions' unclaimed rewards.`,
  };
}
