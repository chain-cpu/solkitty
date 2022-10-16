import { BN } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";

export const SOLKITTIES_PROGRAM_ID = new PublicKey("9GJsbXNCL15vfZy7Z5WvKMD17ZCJFw6wEJkxAvEJa2kn");

export const SOLKITTIES_PREFIX = 'solkitties';

export const SALE_PREFIX = 'sale';

export interface GlobalState {
    authority: PublicKey;
    ticketPrice: BN;
    totalTickets: BN;
    endDate: BN;
    soldTickets: BN;
}

export interface SaleState {
    authority: PublicKey;
    tickets: BN;
}