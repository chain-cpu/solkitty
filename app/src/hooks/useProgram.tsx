import * as anchor from '@project-serum/anchor';
import { Wallet } from '@project-serum/anchor/dist/cjs/provider';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { Keypair, PublicKey, Transaction } from '@solana/web3.js';

import { useMemo } from 'react';
import { SOLKITTIES_PROGRAM_ID } from '../constants';
import { IDL as SolkittiesIDL } from '../constants/solkitties_idl';

export class MyWallet implements Wallet {

    constructor(readonly payer: Keypair) {
        this.payer = payer
    }

    async signTransaction(tx: Transaction): Promise<Transaction> {
        tx.partialSign(this.payer);
        return tx;
    }

    async signAllTransactions(txs: Transaction[]): Promise<Transaction[]> {
        return txs.map((t) => {
            t.partialSign(this.payer);
            return t;
        });
    }

    get publicKey(): PublicKey {
        return this.payer.publicKey;
    }
}

export function useProgram(connection: anchor.web3.Connection, anchorWallet: AnchorWallet | undefined) {

    const wallet = useMemo(
        () => anchorWallet || new MyWallet(Keypair.generate()),
        [anchorWallet],
    )

    const program = useMemo(() => {
        const provider = new anchor.AnchorProvider(connection, wallet, anchor.AnchorProvider.defaultOptions());
        return new anchor.Program(SolkittiesIDL, SOLKITTIES_PROGRAM_ID, provider);
    }, [
        connection,
        anchorWallet
    ])

    return program;
}
