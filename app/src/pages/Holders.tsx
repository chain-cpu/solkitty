import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { FC, useEffect, useState } from 'react';
import { ToastContainer, } from 'react-toastify';

import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { useProgram } from '../hooks/useProgram';

const Holders: FC = () => {

    const { connection } = useConnection();
    const anchorWallet = useAnchorWallet();
    const program = useProgram(connection, anchorWallet);

    const [loading, setLoading] = useState<boolean>(false);
    const [holders, setHolders] = useState<Array<string>>([]);

    useEffect(() => {

        const loadHolders = async () => {
            if (program) {
                setLoading(true);

                const holders = [];
                const accounts = await program.account.saleState.all();
                console.log(accounts);
                for (const account of accounts) {
                    holders.push(account.account.authority.toString());
                }
                setHolders(holders);

                setLoading(false);
            }
        }

        loadHolders();

    }, [
        program
    ])


    return (
        <div className="min-h-screen home flex flex-col justify-between">

            <Header />

            <div className='relative'>

                <div className='xl:w-[1200px] lg:w-[800px] md:w-[600px] md:mx-auto mx-4'>

                    {
                        loading ? <div className='text-white'>Loading...</div>
                            : <div>
                                <div className='text-white mb-4'>Wallets</div>
                                {
                                    holders.map((holder, idx) =>
                                        <div key={idx} className="text-white mb-2">
                                            {holder}
                                        </div>
                                    )
                                }
                            </div>
                    }

                </div>

            </div>

            <ToastContainer />

            <Footer />

        </div >

    );
};

export default Holders;
