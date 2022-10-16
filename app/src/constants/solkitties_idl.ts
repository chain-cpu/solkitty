export type Solkitties = {
  "version": "0.1.0",
  "name": "solkitties",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "ticketPrice",
          "type": "u64"
        },
        {
          "name": "totalTickets",
          "type": "u64"
        },
        {
          "name": "endDate",
          "type": "i64"
        }
      ]
    },
    {
      "name": "updateState",
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "globalState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "ticketPrice",
          "type": {
            "option": "u64"
          }
        },
        {
          "name": "totalTickets",
          "type": {
            "option": "u64"
          }
        },
        {
          "name": "endDate",
          "type": {
            "option": "i64"
          }
        }
      ]
    },
    {
      "name": "sale",
      "accounts": [
        {
          "name": "buyer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "globalState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "saleState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "globalState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "totalTickets",
            "type": "u64"
          },
          {
            "name": "ticketPrice",
            "type": "u64"
          },
          {
            "name": "endDate",
            "type": "i64"
          },
          {
            "name": "soldTickets",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "saleState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "tickets",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "Unauthorized",
      "msg": "You are not authorized to perform this action."
    },
    {
      "code": 6001,
      "name": "SaleEnded",
      "msg": "Sale ended"
    },
    {
      "code": 6002,
      "name": "OutTickets",
      "msg": "Ticket amount is out of range"
    },
    {
      "code": 6003,
      "name": "AlreadySold",
      "msg": "Tokens already sold"
    },
    {
      "code": 6004,
      "name": "MathOverflow",
      "msg": "Math operation overflow"
    },
    {
      "code": 6005,
      "name": "Insufficient",
      "msg": "Insufficient balance"
    }
  ]
};

export const IDL: Solkitties = {
  "version": "0.1.0",
  "name": "solkitties",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "ticketPrice",
          "type": "u64"
        },
        {
          "name": "totalTickets",
          "type": "u64"
        },
        {
          "name": "endDate",
          "type": "i64"
        }
      ]
    },
    {
      "name": "updateState",
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "globalState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "ticketPrice",
          "type": {
            "option": "u64"
          }
        },
        {
          "name": "totalTickets",
          "type": {
            "option": "u64"
          }
        },
        {
          "name": "endDate",
          "type": {
            "option": "i64"
          }
        }
      ]
    },
    {
      "name": "sale",
      "accounts": [
        {
          "name": "buyer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "globalState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "saleState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "globalState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "totalTickets",
            "type": "u64"
          },
          {
            "name": "ticketPrice",
            "type": "u64"
          },
          {
            "name": "endDate",
            "type": "i64"
          },
          {
            "name": "soldTickets",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "saleState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "tickets",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "Unauthorized",
      "msg": "You are not authorized to perform this action."
    },
    {
      "code": 6001,
      "name": "SaleEnded",
      "msg": "Sale ended"
    },
    {
      "code": 6002,
      "name": "OutTickets",
      "msg": "Ticket amount is out of range"
    },
    {
      "code": 6003,
      "name": "AlreadySold",
      "msg": "Tokens already sold"
    },
    {
      "code": 6004,
      "name": "MathOverflow",
      "msg": "Math operation overflow"
    },
    {
      "code": 6005,
      "name": "Insufficient",
      "msg": "Insufficient balance"
    }
  ]
};
