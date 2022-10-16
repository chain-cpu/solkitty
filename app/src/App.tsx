import { FC } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import { WalletConnectProvider } from './components/WalletConnectProvider';
import Home from './pages/Home';
import Holders from './pages/Holders';

import 'react-toastify/dist/ReactToastify.css';

export const App: FC = () => {
    return (
        <div>
            <WalletConnectProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/holders" element={<Holders />} />
                    </Routes>
                </BrowserRouter>
            </WalletConnectProvider>
        </div>
    );
};