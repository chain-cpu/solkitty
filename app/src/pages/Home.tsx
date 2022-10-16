import { web3 } from '@project-serum/anchor';
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey';
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { BN } from 'bn.js';
import { FC, useEffect, useMemo, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Moment from 'react-moment';
import moment from 'moment';

import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { GlobalState, SaleState, SALE_PREFIX, SOLKITTIES_PREFIX, SOLKITTIES_PROGRAM_ID } from '../constants';
import { useProgram } from '../hooks/useProgram';

interface FAQType {
    q: string
    a: string,
    isExpand: boolean
}


const FAQs: Array<FAQType> = [
    {
        q: 'What is Kitties Sweepers?',
        a: 'Kitties Sweepers is a special community sweep event for 3D Sol Kitties on Magic Eden.',
        isExpand: false
    },
    {
        q: 'How do I create and fund my Solana wallet?',
        a: 'Using Chrome, go to Phantom, download and install the Phantom wallet extension. Once the extension is installed, run the program and create a wallet. Then, to fund it, go to Coinbase or Binance (any exchange that sells and supports Solana token transfer) and purchase SOL. Once you have SOL, send it to your SOL address in your Phantom wallet.',
        isExpand: false
    },
    {
        q: 'Why would I want to buy a sweeper ticket?',
        a: 'Post event, we will be airdropping 50% of the swept kitties to sweeper ticket owners (the other 50% will be burnt).',
        isExpand: false
    },
    {
        q: 'What was the thought behind Kitties Sweepers?',
        a: 'Our aim is to develop a community centric approach for market stabilization that is sustainable long-term, unlike individual sweeps.',
        isExpand: false
    },
    {
        q: 'What would the project gain from this event?',
        a: 'Kitties Sweepers would reduce the supply for the 3D Collection and develop higher demand, likely resulting an increase of the Floor Price.',
        isExpand: false
    }
]

const Home: FC = () => {

    const [amount, setAmount] = useState<number>(1);
    const [faqs, setFaqs] = useState<Array<FAQType>>(FAQs);
    const { setVisible } = useWalletModal();
    const { connection } = useConnection();
    const { publicKey, disconnect } = useWallet();
    const anchorWallet = useAnchorWallet();
    const program = useProgram(connection, anchorWallet);

    const [globalState, setGlobalState] = useState<GlobalState>();
    const [saleState, setSaleState] = useState<SaleState>();
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const fetchState = async () => {

            if (processing) {
                return;
            }

            if (program) {
                const [globalPDA,] = findProgramAddressSync(
                    [Buffer.from(SOLKITTIES_PREFIX)],
                    SOLKITTIES_PROGRAM_ID,
                );
                const globalState = (await program.account.globalState.fetchNullable(globalPDA)) as GlobalState;
                setGlobalState(globalState);
                console.log(globalState.endDate.toNumber());

                if (publicKey) {
                    console.log(publicKey.toString())
                    const [salePDA,] = findProgramAddressSync(
                        [Buffer.from(SOLKITTIES_PREFIX), publicKey.toBuffer(), Buffer.from(SALE_PREFIX)],
                        SOLKITTIES_PROGRAM_ID,
                    );
                    const saleState = (await program.account.saleState.fetchNullable(salePDA)) as SaleState;
                    setSaleState(saleState);
                }
            }
        }

        fetchState();
    }, [
        program,
        publicKey,
        processing
    ])

    const ticketPrice = useMemo(() => {
        if (globalState) {
            return globalState.ticketPrice.toNumber() / LAMPORTS_PER_SOL;
        }

        return null;
    }, [
        globalState
    ])

    const soldTickets = useMemo(() => {
        if (globalState) {
            return globalState.soldTickets.toNumber();
        }

        return null;
    }, [
        globalState
    ])

    const endDate = useMemo(() => {
        if (globalState) {
            return moment(globalState.endDate.toNumber() * 1000);
        }

        return moment();
    }, [
        globalState
    ])

    const parseCountdown = (d: string) => {
        if (d.startsWith('-', 0)) {
            return d.substring(1);
        }

        return '00:00:00';
    }

    const handleAmount = (e: any) => {
        const { name, value } = e.target;
        setAmount(value);
    }

    const handleMinus = () => {
        if (amount - 1 > 0) {
            setAmount(amount - 1)
        }
    }

    const handlePlus = () => {
        if (amount + 1 <= 10) {
            setAmount(amount + 1)
        }
    }

    const toggleExpand = (_faq: FAQType) => {
        setFaqs(faqs.map(faq => {
            if (faq.q === _faq.q) {
                faq.isExpand = !faq.isExpand;
            }
            else {
                faq.isExpand = false;
            }

            return faq;
        }));
    }

    const handleConnect = () => {
        setVisible(true);
    }

    const handleDisconnect = () => {
        disconnect();
    }

    const shortPubkey = (pubkey: string) => {
        const start = pubkey.substring(0, 4);
        const end = pubkey.substring(pubkey.length - 4);
        return `${start}...${end}`;
    }

    const buy = async () => {

        if (processing) {
            return toast.error('Purchase action already in progress.');
        }

        if (!publicKey || !program) {
            return toast.error('You need to connect wallet first.');
        }

        if (!globalState) {
            return toast.error('You need to initialize state first.');
        }

        console.log(endDate);
        if (endDate < moment()) {
            return toast.error('Sale finished. Not able to purchase.');
        }

        try {
            setProcessing(true);

            const [globalPDA,] = findProgramAddressSync(
                [Buffer.from(SOLKITTIES_PREFIX)],
                SOLKITTIES_PROGRAM_ID,
            );
            const [saleState,] = findProgramAddressSync(
                [Buffer.from(SOLKITTIES_PREFIX), publicKey.toBuffer(), Buffer.from(SALE_PREFIX)],
                SOLKITTIES_PROGRAM_ID,
            );

            const tx = await program.methods.sale(
                new BN(amount)
            )
                .accounts({
                    buyer: publicKey,
                    authority: globalState.authority,
                    globalState: globalPDA,
                    saleState,
                    systemProgram: web3.SystemProgram.programId
                })
                .rpc();

            toast.success('Ticket purchase successed')
            setProcessing(false);
        }
        catch (ex: any) {
            console.log(ex);
            toast.error(ex.toString())
            setProcessing(false);
        }
    }

    const handleBuy = () => {
        buy();
    }

    return (
        <div className="min-h-screen home flex flex-col justify-between">

            <Header />

            <div className='relative'>

                <div className='xl:w-[1200px] lg:w-[800px] md:w-[600px] md:mx-auto mx-4'>

                    <div className='flex lg:flex-row flex-col-reverse justify-between items-start mt-8'>

                        <img src='/assets/head_clip.png' className='h-32' alt='KITTIES SWEEPERS' />

                        <div className='flex lg:flex-col flex-row justify-between lg:w-fit w-full'>
                            <div className='rounded-xl border border-secondary h-fit flex items-center cursor-pointer hover:opacity-80'>
                                <img src="/assets/sol-wallet.png" className='w-10 border-r border-secondary py-1 ml-2' alt='cat' />
                                {
                                    publicKey ?
                                        <p className='px-4 text-xl text-white' onClick={handleConnect}>
                                            {shortPubkey(publicKey.toString())}
                                        </p>
                                        : <p className='px-4 text-xl text-white' onClick={handleConnect}>
                                            CONNECT WALLET
                                        </p>
                                }
                                {
                                    publicKey ?
                                        <div className='cursor-pointer hover:opacity-80' onClick={handleDisconnect}>
                                            <img src="/assets/disconnect-icon.png" className='w-6 mr-2' alt='disconnect' />
                                        </div>
                                        : null
                                }
                            </div>
                            {
                                publicKey ?
                                    <div className='flex gap-4 items-center justify-center mt-2'>
                                        <img src="/assets/ticket_icon.png" className='w-10' alt='cat' />
                                        <p className='text-xl text-white'>
                                            {saleState?.tickets.toNumber() ?? 0}
                                        </p>
                                    </div>
                                    : null
                            }
                        </div>

                    </div>

                    <div className='flex lg:flex-row flex-col justify-between items-center gap-8' style={{ background: 'url(/assets/border_line.png)' }}>
                        <div className='flex-1 relative'>
                            <div className='lucky-winner'>
                                <img src='/assets/money_dude.png' className='md:w-[500px] mx-auto z-10 relative' alt='Money dude' />
                                <div className='relative flex flex-col gap-2 py-2 justify-center mt-[-120px] text-center  z-10'>
                                    <span className='text-white text-2xl z-10 text-yellow-400'>SWEEPING IN</span>
                                    <span className='text-white text-xl font-bold z-10'>
                                        <Moment date={endDate} interval={1000} durationFromNow format='hh:mm:ss' filter={parseCountdown} />
                                    </span>
                                    <img src='/assets/sweeping_timer.png' className='w-full object-contain absolute top-0 h-24' alt='timer' />
                                </div>
                            </div>
                        </div>

                        <div className='flex-1 text-center'>
                            <div className='ticket-lights relative flex flex-col gap-4 items-center'>
                                <div className='flex gap-4 items-center z-10'>
                                    <span className='text-white text-2xl font-bold'>Tickets Sold:</span>
                                    <span className='text-black text-xl font-bold bg-white px-2 py-1 rounded-md'>{soldTickets ? soldTickets : '-'}</span>
                                </div>
                                <img src='/assets/ticket.gif' className='h-32 z-10' alt='Ticket' />
                                <img src='/assets/price_label.png' className='h-28 z-10' alt='Price Label' />
                            </div>
                            <div className='flex gap-4 items-end'>
                                <div className='flex flex-col text-white'>
                                    <span className='text-2xl'>Price</span>
                                    <div className='text-2xl border border-yellow-400 rounded-xl py-1 px-4'>◎ {ticketPrice ? ticketPrice : '-'}</div>
                                </div>
                                {
                                    publicKey ?
                                        <button type='button' className='bg-yellow-400 h-fit py-2 rounded-xl text-2xl flex-1 hover:opacity-80'
                                            onClick={handleBuy}>
                                            Buy Tickets
                                        </button>
                                        :
                                        <button type='button' className='bg-yellow-400 h-fit py-2 rounded-xl text-2xl flex-1 hover:opacity-80'
                                            onClick={handleConnect}>
                                            Connect
                                        </button>
                                }
                                <div className='flex flex-col text-white'>
                                    <span className='text-2xl'>Amount</span>
                                    <div className='text-2xl border border-primary rounded-xl flex space-between gap-4 py-1 px-4'>
                                        <button type='button' onClick={handleMinus}>-</button>
                                        <input type="string" className='bg-transparent w-16 text-center' name="amount" value={amount} onChange={handleAmount} />
                                        <button type='button' onClick={handlePlus}>+</button>
                                    </div>
                                </div>
                            </div>
                            <p className='text-white text-primary text-2xl font-bold pt-4'>Kitties Family Sweeps Together</p>
                        </div>
                    </div>

                    <div className='flex justify-center items-center gap-16 my-16'>
                        <div className='border-2 border-dashed border-dblue w-32 h-1'></div>
                        <p className='text-white text-4xl font-bold'>FAQ</p>
                        <div className='border-2 border-dashed border-dblue w-32 h-1'></div>
                    </div>

                    <div className='flex flex-col gap-4 mb-8'>
                        {
                            faqs.map((faq, idx) =>
                                <div className='bg-dblue rounded-xl text-white text-xl p-4' key={idx}>
                                    <div className="flex justify-between cursor-pointer" onClick={() => toggleExpand(faq)}>
                                        <p className='font-bold'>Q: {faq.q}</p>
                                        <img className={`w-6 h-6 ${faq.isExpand ? 'rotate-180' : ''}`} src='/assets/icon-arrow.png' alt='Arrow' />
                                    </div>
                                    {
                                        faq.isExpand ?
                                            <p className='mt-2'>
                                                <span className="font-bold">A: </span>
                                                {faq.a}
                                            </p>
                                            : null
                                    }

                                </div>
                            )
                        }
                    </div>

                    <div className='flex lg:flex-row flex-col lg:items-end items-center gap-4 justify-center'>
                        <img src='/assets/kitty_footer.png' alt='Kitty' className='h-48' />
                        <div className='flex flex-col items-end'>
                            <span className='text-lblue'>POWERED BY</span>
                            <img src='/assets/logo_solana.png' alt='Solana' className='h-10 mb-8' />
                        </div>
                    </div>

                </div>

            </div>

            <ToastContainer />

            <Footer />

        </div >

    );
};

export default Home;
