import { FC, useState } from 'react';
import { Link } from 'react-router-dom';

export const Header: FC = () => {

    const [isOpen, setOpen] = useState<boolean>(false);

    const toggleMenu = () => {
        setOpen(!isOpen);
    }

    return (
        <div className='bg-white'>

            <div className='container mx-auto'>


                <div className='flex justify-between items-center p-2'>

                    <Link to={'/'}>
                        <div className='flex items-center gap-4'>
                            <img src='/assets/logo.png' alt='Logo' className="h-16" />
                            <span className='text-2xl font-bold'>SOL KITTIES</span>
                        </div>
                    </Link>

                    <div className='lg:flex hidden gap-4 text-xl text-gray'>
                        <Link to={'/verify'}>
                            <p className=''>
                                VERIFY
                            </p>
                        </Link>
                        <Link to={'/staking'}>
                            <p className=''>
                                STAKING
                            </p>
                        </Link>
                        <Link to={'/'}>
                            <p className=''>
                                SWEEPERS
                            </p>
                        </Link>
                        <Link to={'/roadmap'}>
                            <p className=''>
                                ROADMAP
                            </p>
                        </Link>
                        <Link to={'/faq'}>
                            <p className=''>
                                FAQ
                            </p>
                        </Link>
                        <Link to={'/whitepaper'}>
                            <p className=''>
                                WHITEPAPER
                            </p>
                        </Link>
                    </div>

                    <button type='button' className='cursor-pointer hover:opacity-80' onClick={toggleMenu}>
                        <img src='/assets/join_discord.png' alt='Join Discord' className='md:h-16 h-12' />
                    </button>

                </div>

            </div>
        </div >
    );
}