// Public ABI interfaces extracted as static literals from the official Sepolia app. See profile provenance.
export const CurrentCoreAbi = [
  {
    "type": "function",
    "name": "configuration",
    "inputs": [],
    "outputs": [
      {
        "name": "result",
        "type": "tuple",
        "internalType": "struct CoreConfiguration",
        "components": [
          {
            "name": "streamId",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "genesisTimestamp",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "roundDuration",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "maxWorkPerRound",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "maxRoundsPerBatch",
            "type": "uint16",
            "internalType": "uint16"
          },
          {
            "name": "guardian",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "reporter",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "initialWorkPerThousandBlocks",
            "type": "uint32",
            "internalType": "uint32"
          },
          {
            "name": "targetBlocksPerActiveRound",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "difficultySmoothingRounds",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "blockUnitsPerBlock",
            "type": "uint96",
            "internalType": "uint96"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "implementationCodeAddress",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "implementationCodeVersion",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint64",
        "internalType": "uint64"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "implementationStorageLayoutDigest",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "state",
    "inputs": [],
    "outputs": [
      {
        "name": "result",
        "type": "tuple",
        "internalType": "struct CoreState",
        "components": [
          {
            "name": "settledThroughRound",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "cumulativeWork",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "cumulativeBlockUnits",
            "type": "uint96",
            "internalType": "uint96"
          },
          {
            "name": "blockHeight",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "blockProgress",
            "type": "uint96",
            "internalType": "uint96"
          },
          {
            "name": "workPerThousandBlocks",
            "type": "uint32",
            "internalType": "uint32"
          },
          {
            "name": "authorizationNonce",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "paused",
            "type": "bool",
            "internalType": "bool"
          }
        ]
      }
    ],
    "stateMutability": "view"
  }
] as const;
export const CurrentMiningAbi = [
  {
    "type": "function",
    "name": "account",
    "inputs": [
      {
        "name": "account_",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct MiningAccount",
        "components": [
          {
            "name": "nftPower",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "sqkPower",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "creditScaled",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "unsettledEntries",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "complete",
            "type": "bool",
            "internalType": "bool"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "accountPower",
    "inputs": [
      {
        "name": "account_",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "nftPower",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "sqkPower",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "effectiveRound",
        "type": "uint64",
        "internalType": "uint64"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "claim",
    "inputs": [
      {
        "name": "account_",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "paid",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "claimRecipient",
    "inputs": [
      {
        "name": "account_",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "recipient",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "claimable",
    "inputs": [
      {
        "name": "account_",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "configuration",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct MiningConfiguration",
        "components": [
          {
            "name": "core",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "streamId",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "governance",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "token",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "genesisTimestamp",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "maxWorkPerRound",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "minimumTimelockDelay",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "supplyCap",
            "type": "uint128",
            "internalType": "uint128"
          },
          {
            "name": "premint",
            "type": "uint128",
            "internalType": "uint128"
          },
          {
            "name": "launchBonus",
            "type": "uint128",
            "internalType": "uint128"
          },
          {
            "name": "bonusBlocks",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "halvingBlocks",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "initialWorkPerThousandBlocks",
            "type": "uint32",
            "internalType": "uint32"
          },
          {
            "name": "initialGuardian",
            "type": "address",
            "internalType": "address"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "core",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "implementationCodeAddress",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "implementationCodeVersion",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint64",
        "internalType": "uint64"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "implementationStorageLayoutDigest",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "staking",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "state",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct MiningState",
        "components": [
          {
            "name": "minted",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "paid",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "totalNftPower",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "totalSqkPower",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "rewardIndex",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "closedThroughBlock",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "lastActivationRound",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "powerActivationCursor",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "powerActivationCount",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "bootstrapped",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "processedThroughRound",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "closedCumulativeWork",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "closedCumulativeBlockUnits",
            "type": "uint96",
            "internalType": "uint96"
          },
          {
            "name": "closedWorkPerThousandBlocks",
            "type": "uint32",
            "internalType": "uint32"
          }
        ]
      }
    ],
    "stateMutability": "view"
  }
] as const;
export const CurrentStakingAbi = [
  {
    "type": "function",
    "name": "accountPower",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "nftPower",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "sqkPower",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "clones",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "deposit",
    "inputs": [
      {
        "name": "collection",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "tokenIds",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "depositor",
    "inputs": [
      {
        "name": "collection",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "genesis",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "implementationCodeAddress",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "implementationCodeVersion",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint64",
        "internalType": "uint64"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "implementationStorageLayoutDigest",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "launch",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "mergeDeposited",
    "inputs": [
      {
        "name": "collection",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "survivor",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "donor",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "mining",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "stakeOf",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "principal",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "freshPrincipal",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "freshUntilRound",
        "type": "uint64",
        "internalType": "uint64"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "withdraw",
    "inputs": [
      {
        "name": "collection",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "tokenIds",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  }
] as const;
export const CurrentTokenAbi = [
  {
    "type": "function",
    "name": "balanceOf",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "decimals",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint8",
        "internalType": "uint8"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "mining",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "symbol",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "totalSupply",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  }
] as const;
export const CurrentNftAbi = [
  {
    "type": "function",
    "name": "MAXIMUM_LEVEL",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint8",
        "internalType": "uint8"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "balanceOf",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getApproved",
    "inputs": [
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "governance",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isApprovedForAll",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "operator",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "level",
    "inputs": [
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint8",
        "internalType": "uint8"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "merge",
    "inputs": [
      {
        "name": "survivor",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "donor",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "mining",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "nextMergeHeight",
    "inputs": [
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint64",
        "internalType": "uint64"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "ownerOf",
    "inputs": [
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "protocolRecipient",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address payable"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "sqkCore",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  }
] as const;