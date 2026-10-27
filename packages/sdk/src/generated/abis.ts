// Generated from the published Squeekchain ABIs. See THIRD_PARTY_NOTICES.md.
export const SqueekCoreAbi = [
  {
    "type": "constructor",
    "inputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "blockInfo",
    "inputs": [
      {
        "name": "squeekBlock",
        "type": "uint64",
        "internalType": "uint64"
      }
    ],
    "outputs": [
      {
        "name": "result",
        "type": "tuple",
        "internalType": "struct BlockInfo",
        "components": [
          {
            "name": "roundId",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "workThreshold",
            "type": "uint64",
            "internalType": "uint64"
          }
        ]
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
    "name": "eip712Domain",
    "inputs": [],
    "outputs": [
      {
        "name": "fields",
        "type": "bytes1",
        "internalType": "bytes1"
      },
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "version",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "chainId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "verifyingContract",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "salt",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "extensions",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "hasEverBeenReporter",
    "inputs": [
      {
        "name": "candidate",
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
    "name": "initialize",
    "inputs": [
      {
        "name": "config",
        "type": "tuple",
        "internalType": "struct SqueekLaunchConfig",
        "components": [
          {
            "name": "streamId",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "guardian",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "initialReporter",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "genesisTimestamp",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "initialWorkPerThousandBlocks",
            "type": "uint32",
            "internalType": "uint32"
          },
          {
            "name": "maxWorkPerRound",
            "type": "uint64",
            "internalType": "uint64"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "pause",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "paused",
    "inputs": [],
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
    "name": "proxyAdmin",
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
    "name": "roundPage",
    "inputs": [
      {
        "name": "afterRound",
        "type": "uint64",
        "internalType": "uint64"
      },
      {
        "name": "throughRound",
        "type": "uint64",
        "internalType": "uint64"
      },
      {
        "name": "maxRecords",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "result",
        "type": "tuple",
        "internalType": "struct RoundPage",
        "components": [
          {
            "name": "certifiedThroughRound",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "start",
            "type": "tuple",
            "internalType": "struct LedgerPosition",
            "components": [
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
                "name": "workPerThousandBlocks",
                "type": "uint32",
                "internalType": "uint32"
              }
            ]
          },
          {
            "name": "end",
            "type": "tuple",
            "internalType": "struct LedgerPosition",
            "components": [
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
                "name": "workPerThousandBlocks",
                "type": "uint32",
                "internalType": "uint32"
              }
            ]
          },
          {
            "name": "rounds",
            "type": "tuple[]",
            "internalType": "struct RoundCheckpoint[]",
            "components": [
              {
                "name": "roundId",
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
                "name": "workPerThousandBlocks",
                "type": "uint32",
                "internalType": "uint32"
              },
              {
                "name": "dataHash",
                "type": "bytes32",
                "internalType": "bytes32"
              }
            ]
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "setReporter",
    "inputs": [
      {
        "name": "newReporter",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
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
  },
  {
    "type": "function",
    "name": "submitRounds",
    "inputs": [
      {
        "name": "rounds",
        "type": "tuple[]",
        "internalType": "struct Round[]",
        "components": [
          {
            "name": "roundId",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "work",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "dataHash",
            "type": "bytes32",
            "internalType": "bytes32"
          }
        ]
      },
      {
        "name": "settledThroughRound",
        "type": "uint64",
        "internalType": "uint64"
      },
      {
        "name": "expectedNonce",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "deadline",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "signature",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "unpause",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "BatchSettled",
    "inputs": [
      {
        "name": "digest",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "reporter",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "settledThroughRound",
        "type": "uint64",
        "indexed": true,
        "internalType": "uint64"
      },
      {
        "name": "nonce",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "previousSettledThroughRound",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      },
      {
        "name": "activeRoundCount",
        "type": "uint16",
        "indexed": false,
        "internalType": "uint16"
      },
      {
        "name": "cumulativeWork",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      },
      {
        "name": "cumulativeBlockUnits",
        "type": "uint96",
        "indexed": false,
        "internalType": "uint96"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "CoreInitialized",
    "inputs": [
      {
        "name": "streamId",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "guardian",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "reporter",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "genesisTimestamp",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      },
      {
        "name": "initialWorkPerThousandBlocks",
        "type": "uint32",
        "indexed": false,
        "internalType": "uint32"
      },
      {
        "name": "maxWorkPerRound",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "EIP712DomainChanged",
    "inputs": [],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Initialized",
    "inputs": [
      {
        "name": "version",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Paused",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ReporterUpdated",
    "inputs": [
      {
        "name": "previousReporter",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newReporter",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "RoundRecorded",
    "inputs": [
      {
        "name": "roundId",
        "type": "uint64",
        "indexed": true,
        "internalType": "uint64"
      },
      {
        "name": "work",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      },
      {
        "name": "cumulativeWork",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      },
      {
        "name": "cumulativeBlockUnits",
        "type": "uint96",
        "indexed": false,
        "internalType": "uint96"
      },
      {
        "name": "workPerThousandBlocks",
        "type": "uint32",
        "indexed": false,
        "internalType": "uint32"
      },
      {
        "name": "dataHash",
        "type": "bytes32",
        "indexed": false,
        "internalType": "bytes32"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Unpaused",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "AuthorizationNonceMismatch",
    "inputs": []
  },
  {
    "type": "error",
    "name": "BatchTooLarge",
    "inputs": []
  },
  {
    "type": "error",
    "name": "BlockNotSettled",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ECDSAInvalidSignature",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ECDSAInvalidSignatureLength",
    "inputs": [
      {
        "name": "length",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "ECDSAInvalidSignatureS",
    "inputs": [
      {
        "name": "s",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ]
  },
  {
    "type": "error",
    "name": "EnforcedPause",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ExpectedPause",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ExpiredAuthorization",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidActiveRound",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidGenesisTimestamp",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidGuardian",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidImplementationCodeAddress",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidInitialization",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidProxyAdmin",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidReporter",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidReporterSignature",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidRoundId",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidRoundPageBounds",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidStreamId",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidWorkCap",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidWorkPerThousandBlocks",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NonIncreasingRoundId",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotInitializing",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ReporterAlreadyUsed",
    "inputs": []
  },
  {
    "type": "error",
    "name": "RoundNotElapsed",
    "inputs": []
  },
  {
    "type": "error",
    "name": "SafeCastOverflowedUintDowncast",
    "inputs": [
      {
        "name": "bits",
        "type": "uint8",
        "internalType": "uint8"
      },
      {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "SettledThroughRoundNotAdvanced",
    "inputs": []
  },
  {
    "type": "error",
    "name": "UnauthorizedGuardian",
    "inputs": []
  },
  {
    "type": "error",
    "name": "WorkExceeded",
    "inputs": []
  }
] as const;
export const SqueekMiningAbi = [
  {
    "type": "constructor",
    "inputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "MAX_CHECKPOINT_ACTIVATIONS",
    "inputs": [],
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
    "name": "MAX_CLAIMS",
    "inputs": [],
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
    "name": "MAX_LEVELS",
    "inputs": [],
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
    "name": "REWARD_PER_BLOCK",
    "inputs": [],
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
    "name": "SCALE",
    "inputs": [],
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
    "name": "SUPPLY_CAP",
    "inputs": [],
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
    "name": "accounting",
    "inputs": [],
    "outputs": [
      {
        "name": "result",
        "type": "tuple",
        "internalType": "struct MiningAccounting",
        "components": [
          {
            "name": "closedResidual",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "openResidual",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "miningBalance",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "trackedCustody",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "bindClones",
    "inputs": [
      {
        "name": "clonesNft",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "levelWeights",
        "type": "uint64[]",
        "internalType": "uint64[]"
      },
      {
        "name": "levelCooldowns",
        "type": "uint64[]",
        "internalType": "uint64[]"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "bootstrapAuthority",
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
    "name": "checkpoint",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "checkpointStatus",
    "inputs": [],
    "outputs": [
      {
        "name": "corePaused",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "nextRound",
        "type": "uint64",
        "internalType": "uint64"
      },
      {
        "name": "roundSettled",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "claim",
    "inputs": [
      {
        "name": "collection",
        "type": "uint8",
        "internalType": "enum MiningCollection"
      },
      {
        "name": "tokenIds",
        "type": "uint256[]",
        "internalType": "uint256[]"
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
    "name": "claimable",
    "inputs": [
      {
        "name": "collection",
        "type": "uint8",
        "internalType": "enum MiningCollection"
      },
      {
        "name": "tokenIds",
        "type": "uint256[]",
        "internalType": "uint256[]"
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
    "name": "collectionPolicy",
    "inputs": [
      {
        "name": "collection",
        "type": "uint8",
        "internalType": "enum MiningCollection"
      }
    ],
    "outputs": [
      {
        "name": "policy",
        "type": "tuple",
        "internalType": "struct MiningCollectionPolicy",
        "components": [
          {
            "name": "nft",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "maxSupply",
            "type": "uint16",
            "internalType": "uint16"
          },
          {
            "name": "maximumLevel",
            "type": "uint8",
            "internalType": "uint8"
          },
          {
            "name": "levels",
            "type": "tuple[]",
            "internalType": "struct MiningLevel[]",
            "components": [
              {
                "name": "weight",
                "type": "uint64",
                "internalType": "uint64"
              },
              {
                "name": "cooldownBlocks",
                "type": "uint64",
                "internalType": "uint64"
              }
            ]
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "completeBootstrap",
    "inputs": [
      {
        "name": "token_",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "genesisNft",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
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
            "name": "genesisCollection",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "genesisTimestamp",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "genesisMaxSupply",
            "type": "uint16",
            "internalType": "uint16"
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
            "name": "genesisMaximumLevel",
            "type": "uint8",
            "internalType": "uint8"
          },
          {
            "name": "initialWorkPerThousandBlocks",
            "type": "uint32",
            "internalType": "uint32"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "cooldownBlocks",
    "inputs": [
      {
        "name": "collection",
        "type": "uint8",
        "internalType": "enum MiningCollection"
      },
      {
        "name": "level",
        "type": "uint8",
        "internalType": "uint8"
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
    "name": "extendClonesLevels",
    "inputs": [
      {
        "name": "levelWeights",
        "type": "uint64[]",
        "internalType": "uint64[]"
      },
      {
        "name": "levelCooldowns",
        "type": "uint64[]",
        "internalType": "uint64[]"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
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
    "name": "initialize",
    "inputs": [
      {
        "name": "config",
        "type": "tuple",
        "internalType": "struct MiningLaunchConfig",
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
            "name": "minimumTimelockDelay",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "levelWeights",
            "type": "uint64[]",
            "internalType": "uint64[]"
          },
          {
            "name": "cooldownBlocks",
            "type": "uint64[]",
            "internalType": "uint64[]"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "merge",
    "inputs": [
      {
        "name": "collection",
        "type": "uint8",
        "internalType": "enum MiningCollection"
      },
      {
        "name": "survivorId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "donorId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "onMint",
    "inputs": [
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "position",
    "inputs": [
      {
        "name": "collection",
        "type": "uint8",
        "internalType": "enum MiningCollection"
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
        "type": "tuple",
        "internalType": "struct MiningPosition",
        "components": [
          {
            "name": "activeWeight",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "pendingWeight",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "pendingRound",
            "type": "uint40",
            "internalType": "uint40"
          },
          {
            "name": "nextMergeBlock",
            "type": "uint48",
            "internalType": "uint48"
          },
          {
            "name": "level",
            "type": "uint8",
            "internalType": "uint8"
          },
          {
            "name": "lastIndex",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "accruedScaled",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "proxyAdmin",
    "inputs": [],
    "outputs": [
      {
        "name": "admin",
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
            "name": "totalWeight",
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
            "name": "weightActivationCursor",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "weightActivationCount",
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
  },
  {
    "type": "function",
    "name": "weightActivation",
    "inputs": [
      {
        "name": "index",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct MiningWeightActivation",
        "components": [
          {
            "name": "round",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "addedWeight",
            "type": "uint192",
            "internalType": "uint192"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "weightForLevel",
    "inputs": [
      {
        "name": "collection",
        "type": "uint8",
        "internalType": "enum MiningCollection"
      },
      {
        "name": "level",
        "type": "uint8",
        "internalType": "uint8"
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
    "type": "event",
    "name": "Checkpointed",
    "inputs": [
      {
        "name": "afterRound",
        "type": "uint64",
        "indexed": true,
        "internalType": "uint64"
      },
      {
        "name": "throughRound",
        "type": "uint64",
        "indexed": true,
        "internalType": "uint64"
      },
      {
        "name": "completedBlocks",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      },
      {
        "name": "cumulativeWork",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      },
      {
        "name": "cumulativeBlockUnits",
        "type": "uint96",
        "indexed": false,
        "internalType": "uint96"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "minted",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "lastActivationRound",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      },
      {
        "name": "totalWeight",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "rewardIndex",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "CollectionPolicyUpdated",
    "inputs": [
      {
        "name": "collection",
        "type": "uint8",
        "indexed": true,
        "internalType": "enum MiningCollection"
      },
      {
        "name": "nft",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "maximumLevel",
        "type": "uint8",
        "indexed": false,
        "internalType": "uint8"
      },
      {
        "name": "levelWeights",
        "type": "uint64[]",
        "indexed": false,
        "internalType": "uint64[]"
      },
      {
        "name": "cooldownBlocks",
        "type": "uint64[]",
        "indexed": false,
        "internalType": "uint64[]"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Initialized",
    "inputs": [
      {
        "name": "version",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "MiningBootstrapped",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "collection",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "MiningInitialized",
    "inputs": [
      {
        "name": "core",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "streamId",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "governance",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PositionRegistered",
    "inputs": [
      {
        "name": "collection",
        "type": "uint8",
        "indexed": true,
        "internalType": "enum MiningCollection"
      },
      {
        "name": "tokenId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "firstRound",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      },
      {
        "name": "weight",
        "type": "uint128",
        "indexed": false,
        "internalType": "uint128"
      },
      {
        "name": "nextMergeBlock",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PositionsMerged",
    "inputs": [
      {
        "name": "collection",
        "type": "uint8",
        "indexed": true,
        "internalType": "enum MiningCollection"
      },
      {
        "name": "survivor",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "donor",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "level",
        "type": "uint8",
        "indexed": false,
        "internalType": "uint8"
      },
      {
        "name": "effectiveRound",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      },
      {
        "name": "nextMergeBlock",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      },
      {
        "name": "activeWeight",
        "type": "uint128",
        "indexed": false,
        "internalType": "uint128"
      },
      {
        "name": "pendingWeight",
        "type": "uint128",
        "indexed": false,
        "internalType": "uint128"
      },
      {
        "name": "accruedScaled",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "RewardsClaimed",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "collection",
        "type": "uint8",
        "indexed": true,
        "internalType": "enum MiningCollection"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "remainderScaled",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "tokenIds",
        "type": "uint256[]",
        "indexed": false,
        "internalType": "uint256[]"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "WeightActivated",
    "inputs": [
      {
        "name": "round",
        "type": "uint64",
        "indexed": true,
        "internalType": "uint64"
      },
      {
        "name": "totalWeight",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "rewardIndex",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "BindingCallFailed",
    "inputs": []
  },
  {
    "type": "error",
    "name": "BootstrapAlreadyComplete",
    "inputs": []
  },
  {
    "type": "error",
    "name": "BootstrapIncomplete",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ClonesAlreadyBound",
    "inputs": []
  },
  {
    "type": "error",
    "name": "CollectionNotBound",
    "inputs": [
      {
        "name": "collection",
        "type": "uint8",
        "internalType": "enum MiningCollection"
      }
    ]
  },
  {
    "type": "error",
    "name": "CooldownActive",
    "inputs": [
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "nextMergeBlock",
        "type": "uint64",
        "internalType": "uint64"
      }
    ]
  },
  {
    "type": "error",
    "name": "CoreFutureRound",
    "inputs": []
  },
  {
    "type": "error",
    "name": "CoreIdentityMismatch",
    "inputs": []
  },
  {
    "type": "error",
    "name": "CoreInconsistent",
    "inputs": []
  },
  {
    "type": "error",
    "name": "CoreNotFresh",
    "inputs": []
  },
  {
    "type": "error",
    "name": "CorePaused",
    "inputs": []
  },
  {
    "type": "error",
    "name": "CoreRegression",
    "inputs": []
  },
  {
    "type": "error",
    "name": "CoreUnavailable",
    "inputs": []
  },
  {
    "type": "error",
    "name": "CustodyShortfall",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidBounds",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidClaim",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidCollection",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidConfiguration",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidGraphAdmin",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidHistory",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidInitialization",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidMerge",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidPosition",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidProxyAdmin",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidProxyContext",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidProxyRuntime",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidToken",
    "inputs": []
  },
  {
    "type": "error",
    "name": "MintMismatch",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotInitializing",
    "inputs": []
  },
  {
    "type": "error",
    "name": "PendingActivation",
    "inputs": [
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "round",
        "type": "uint64",
        "internalType": "uint64"
      }
    ]
  },
  {
    "type": "error",
    "name": "ReentrantCall",
    "inputs": []
  },
  {
    "type": "error",
    "name": "RoundNotSettled",
    "inputs": [
      {
        "name": "round",
        "type": "uint64",
        "internalType": "uint64"
      }
    ]
  },
  {
    "type": "error",
    "name": "SafeCastOverflowedUintDowncast",
    "inputs": [
      {
        "name": "bits",
        "type": "uint8",
        "internalType": "uint8"
      },
      {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "SafeERC20FailedOperation",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "TokenSupplyMismatch",
    "inputs": []
  },
  {
    "type": "error",
    "name": "Unauthorized",
    "inputs": []
  }
] as const;
export const SqueekTokenAbi = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "miningProxy",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "supplyCap_",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "DOMAIN_SEPARATOR",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "allowance",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "spender",
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
    "name": "approve",
    "inputs": [
      {
        "name": "spender",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "nonpayable"
  },
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
    "name": "cap",
    "inputs": [],
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
    "name": "eip712Domain",
    "inputs": [],
    "outputs": [
      {
        "name": "fields",
        "type": "bytes1",
        "internalType": "bytes1"
      },
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "version",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "chainId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "verifyingContract",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "salt",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "extensions",
        "type": "uint256[]",
        "internalType": "uint256[]"
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
    "name": "mintForCheckpoint",
    "inputs": [
      {
        "name": "throughRound",
        "type": "uint64",
        "internalType": "uint64"
      },
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "name",
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
    "name": "nonces",
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
    "name": "permit",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "spender",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "deadline",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "v",
        "type": "uint8",
        "internalType": "uint8"
      },
      {
        "name": "r",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "s",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
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
  },
  {
    "type": "function",
    "name": "transfer",
    "inputs": [
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "transferFrom",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "value",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "Approval",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "spender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "value",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "CheckpointMinted",
    "inputs": [
      {
        "name": "throughRound",
        "type": "uint64",
        "indexed": true,
        "internalType": "uint64"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "totalMinted",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "EIP712DomainChanged",
    "inputs": [],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Transfer",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "value",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "ECDSAInvalidSignature",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ECDSAInvalidSignatureLength",
    "inputs": [
      {
        "name": "length",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "ECDSAInvalidSignatureS",
    "inputs": [
      {
        "name": "s",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC20ExceededCap",
    "inputs": [
      {
        "name": "increasedSupply",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "cap",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC20InsufficientAllowance",
    "inputs": [
      {
        "name": "spender",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "allowance",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "needed",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC20InsufficientBalance",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "balance",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "needed",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC20InvalidApprover",
    "inputs": [
      {
        "name": "approver",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC20InvalidCap",
    "inputs": [
      {
        "name": "cap",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC20InvalidReceiver",
    "inputs": [
      {
        "name": "receiver",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC20InvalidSender",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC20InvalidSpender",
    "inputs": [
      {
        "name": "spender",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC2612ExpiredSignature",
    "inputs": [
      {
        "name": "deadline",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC2612InvalidSigner",
    "inputs": [
      {
        "name": "signer",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "InvalidAccountNonce",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "currentNonce",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "InvalidMining",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidShortString",
    "inputs": []
  },
  {
    "type": "error",
    "name": "StringTooLong",
    "inputs": [
      {
        "name": "str",
        "type": "string",
        "internalType": "string"
      }
    ]
  },
  {
    "type": "error",
    "name": "UnauthorizedMining",
    "inputs": []
  }
] as const;
export const SqueekNFTAbi = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "rendererAddress",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "artAddress",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "collectionSeed_",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "sqkCoreAddress",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "governanceAddress",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "economicRecipientAddress",
        "type": "address",
        "internalType": "address payable"
      },
      {
        "name": "royaltyBps_",
        "type": "uint96",
        "internalType": "uint96"
      },
      {
        "name": "contractURI_",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "miningAddress",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "ALLOWLIST_DURATION",
    "inputs": [],
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
    "name": "ALLOWLIST_PRICE",
    "inputs": [],
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
    "name": "GLOBAL_WALLET_CAP",
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
    "name": "MAX_MINT_QUANTITY",
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
    "name": "MAX_MULTISIG_MINT_QUANTITY",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint16",
        "internalType": "uint16"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "MAX_SUPPLY",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint16",
        "internalType": "uint16"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "PROTOCOL_RESERVE",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint16",
        "internalType": "uint16"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "PUBLIC_ALLOCATION",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint16",
        "internalType": "uint16"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "PUBLIC_PRICE",
    "inputs": [],
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
    "name": "allowlistEnd",
    "inputs": [],
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
    "name": "allowlistMint",
    "inputs": [
      {
        "name": "quantity",
        "type": "uint8",
        "internalType": "uint8"
      },
      {
        "name": "proof",
        "type": "bytes32[]",
        "internalType": "bytes32[]"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "allowlistRoot",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "allowlistStart",
    "inputs": [],
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
    "name": "announceMetadataUpdate",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "approve",
    "inputs": [
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "art",
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
    "name": "artCodehash",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "assetSetHash",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
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
    "name": "burnForMerge",
    "inputs": [
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "closePublicSaleAndMintRemainder",
    "inputs": [
      {
        "name": "quantity",
        "type": "uint16",
        "internalType": "uint16"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "collectionSeed",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "contractURI",
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
    "name": "economicRecipient",
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
    "name": "guardian",
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
    "name": "lockMintConfiguration",
    "inputs": [],
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
    "name": "mintConfigurationLocked",
    "inputs": [],
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
    "name": "mintPhase",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint8",
        "internalType": "enum SqueekNFT.MintPhase"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "mintProtocolReserve",
    "inputs": [
      {
        "name": "quantity",
        "type": "uint16",
        "internalType": "uint16"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "mintPublicRemainder",
    "inputs": [
      {
        "name": "quantity",
        "type": "uint16",
        "internalType": "uint16"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "name",
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
    "name": "nextPublicTokenId",
    "inputs": [],
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
    "name": "nextReserveTokenId",
    "inputs": [],
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
    "name": "pauseMint",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "paused",
    "inputs": [],
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
    "name": "publicMint",
    "inputs": [
      {
        "name": "quantity",
        "type": "uint8",
        "internalType": "uint8"
      }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "publicMinted",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint16",
        "internalType": "uint16"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "publicRemainderAssigned",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint16",
        "internalType": "uint16"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "publicRemainderMinted",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint16",
        "internalType": "uint16"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "publicSaleClosed",
    "inputs": [],
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
    "name": "publicSaleStarted",
    "inputs": [],
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
    "name": "renderer",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IDotGridRenderer"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "reserveMinted",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint16",
        "internalType": "uint16"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "resetAllowlistWindow",
    "inputs": [
      {
        "name": "newStart",
        "type": "uint64",
        "internalType": "uint64"
      },
      {
        "name": "newRoot",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "royaltyBps",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint96",
        "internalType": "uint96"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "royaltyInfo",
    "inputs": [
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "salePrice",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "receiver",
        "type": "address",
        "internalType": "address"
      },
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
    "name": "safeTransferFrom",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "safeTransferFrom",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "sceneHash",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "setAllowlistRoot",
    "inputs": [
      {
        "name": "newRoot",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setAllowlistStart",
    "inputs": [
      {
        "name": "newStart",
        "type": "uint64",
        "internalType": "uint64"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setApprovalForAll",
    "inputs": [
      {
        "name": "operator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "approved",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
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
  },
  {
    "type": "function",
    "name": "supportsInterface",
    "inputs": [
      {
        "name": "interfaceId",
        "type": "bytes4",
        "internalType": "bytes4"
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
    "name": "sweepProceeds",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
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
    "name": "tokenURI",
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
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "totalBurned",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint16",
        "internalType": "uint16"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "totalIssued",
    "inputs": [],
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
  },
  {
    "type": "function",
    "name": "transferFrom",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "unpauseMint",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "walletMinted",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "quantity",
        "type": "uint8",
        "internalType": "uint8"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "AllowlistMinted",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "firstTokenId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "quantity",
        "type": "uint8",
        "indexed": false,
        "internalType": "uint8"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "AllowlistRootUpdated",
    "inputs": [
      {
        "name": "previousRoot",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "newRoot",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "AllowlistStartUpdated",
    "inputs": [
      {
        "name": "previousStart",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      },
      {
        "name": "newStart",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "AllowlistWindowReset",
    "inputs": [
      {
        "name": "previousRoot",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "newRoot",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "previousStart",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      },
      {
        "name": "previousEnd",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      },
      {
        "name": "newStart",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      },
      {
        "name": "newEnd",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Approval",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "approved",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "tokenId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ApprovalForAll",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "operator",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "approved",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "BatchMetadataUpdate",
    "inputs": [
      {
        "name": "_fromTokenId",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "_toTokenId",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "MetadataUpdate",
    "inputs": [
      {
        "name": "_tokenId",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "MintConfigurationFinalized",
    "inputs": [
      {
        "name": "root",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "start",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      },
      {
        "name": "end",
        "type": "uint64",
        "indexed": false,
        "internalType": "uint64"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Paused",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ProceedsSwept",
    "inputs": [
      {
        "name": "caller",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "recipient",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ProtocolReserveMinted",
    "inputs": [
      {
        "name": "firstTokenId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "quantity",
        "type": "uint16",
        "indexed": false,
        "internalType": "uint16"
      },
      {
        "name": "reserveMinted",
        "type": "uint16",
        "indexed": false,
        "internalType": "uint16"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PublicMinted",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "firstTokenId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "quantity",
        "type": "uint8",
        "indexed": false,
        "internalType": "uint8"
      },
      {
        "name": "paid",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PublicRemainderMinted",
    "inputs": [
      {
        "name": "firstTokenId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "quantity",
        "type": "uint16",
        "indexed": false,
        "internalType": "uint16"
      },
      {
        "name": "remaining",
        "type": "uint16",
        "indexed": false,
        "internalType": "uint16"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PublicSaleClosed",
    "inputs": [
      {
        "name": "publicMintedBefore",
        "type": "uint16",
        "indexed": false,
        "internalType": "uint16"
      },
      {
        "name": "remainderAssigned",
        "type": "uint16",
        "indexed": false,
        "internalType": "uint16"
      },
      {
        "name": "recipient",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Transfer",
    "inputs": [
      {
        "name": "from",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "tokenId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Unpaused",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "AllowlistWindowResetUnavailable",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ArtCodehashMismatch",
    "inputs": [
      {
        "name": "actual",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ]
  },
  {
    "type": "error",
    "name": "AssetSetMismatch",
    "inputs": [
      {
        "name": "actual",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC2981InvalidDefaultRoyalty",
    "inputs": [
      {
        "name": "numerator",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "denominator",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC2981InvalidDefaultRoyaltyReceiver",
    "inputs": [
      {
        "name": "receiver",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC2981InvalidTokenRoyalty",
    "inputs": [
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "numerator",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "denominator",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC2981InvalidTokenRoyaltyReceiver",
    "inputs": [
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "receiver",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC721IncorrectOwner",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC721InsufficientApproval",
    "inputs": [
      {
        "name": "operator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC721InvalidApprover",
    "inputs": [
      {
        "name": "approver",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC721InvalidOperator",
    "inputs": [
      {
        "name": "operator",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC721InvalidOwner",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC721InvalidReceiver",
    "inputs": [
      {
        "name": "receiver",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC721InvalidSender",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ERC721NonexistentToken",
    "inputs": [
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "EnforcedPause",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ExpectedPause",
    "inputs": []
  },
  {
    "type": "error",
    "name": "IncorrectPayment",
    "inputs": [
      {
        "name": "expected",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "supplied",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "InvalidAllowlistProof",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "InvalidAllowlistRoot",
    "inputs": [
      {
        "name": "root",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ]
  },
  {
    "type": "error",
    "name": "InvalidAllowlistStart",
    "inputs": [
      {
        "name": "start",
        "type": "uint64",
        "internalType": "uint64"
      }
    ]
  },
  {
    "type": "error",
    "name": "InvalidArt",
    "inputs": [
      {
        "name": "artAddress",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "InvalidContractURI",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidEconomicRecipient",
    "inputs": [
      {
        "name": "economicRecipientAddress",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "InvalidGovernance",
    "inputs": [
      {
        "name": "governanceAddress",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "InvalidGuardian",
    "inputs": [
      {
        "name": "guardianAddress",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "InvalidMining",
    "inputs": [
      {
        "name": "miningAddress",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "InvalidMintPhase",
    "inputs": [
      {
        "name": "actual",
        "type": "uint8",
        "internalType": "enum SqueekNFT.MintPhase"
      },
      {
        "name": "required",
        "type": "uint8",
        "internalType": "enum SqueekNFT.MintPhase"
      }
    ]
  },
  {
    "type": "error",
    "name": "InvalidMintQuantity",
    "inputs": [
      {
        "name": "supplied",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "maximum",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "InvalidRenderer",
    "inputs": [
      {
        "name": "rendererAddress",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "InvalidSqkCore",
    "inputs": [
      {
        "name": "sqkCoreAddress",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "MintConfigurationIncomplete",
    "inputs": []
  },
  {
    "type": "error",
    "name": "MintConfigurationIsLocked",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NoProceeds",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ProceedsTransferFailed",
    "inputs": [
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "ProtocolReserveExceeded",
    "inputs": [
      {
        "name": "requested",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "remaining",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "PublicAllocationExceeded",
    "inputs": [
      {
        "name": "requested",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "remaining",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "PublicRemainderExceeded",
    "inputs": [
      {
        "name": "requested",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "remaining",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "PublicRemainderUnavailable",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ReentrancyGuardReentrantCall",
    "inputs": []
  },
  {
    "type": "error",
    "name": "RendererCodehashMismatch",
    "inputs": [
      {
        "name": "actual",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ]
  },
  {
    "type": "error",
    "name": "RendererIdMismatch",
    "inputs": [
      {
        "name": "actual",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ]
  },
  {
    "type": "error",
    "name": "SceneHashMismatch",
    "inputs": [
      {
        "name": "actual",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ]
  },
  {
    "type": "error",
    "name": "UnauthorizedEconomicRecipient",
    "inputs": [
      {
        "name": "caller",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "UnauthorizedGovernance",
    "inputs": [
      {
        "name": "caller",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "UnauthorizedGuardian",
    "inputs": [
      {
        "name": "caller",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "UnauthorizedMining",
    "inputs": [
      {
        "name": "caller",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ValidatorCodehashMismatch",
    "inputs": [
      {
        "name": "actual",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ]
  },
  {
    "type": "error",
    "name": "WalletMintCapExceeded",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "requested",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "remaining",
        "type": "uint256",
        "internalType": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "ZeroCollectionSeed",
    "inputs": []
  }
] as const;