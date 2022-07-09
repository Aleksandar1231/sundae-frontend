import React, { Suspense, lazy, useRef } from 'react';
import { Provider } from 'react-redux';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider as TP } from '@material-ui/core/styles';
import { ThemeProvider as TP1 } from 'styled-components';
import { UseWalletProvider } from 'use-wallet';
import usePromptNetwork from './hooks/useNetworkPrompt';
import BanksProvider from './contexts/Banks';
import TombFinanceProvider from './contexts/TombFinanceProvider';
import ModalsProvider from './contexts/Modals';
import store from './state';
import theme from './theme';
import newTheme from './newTheme';
import config from './config';
import Updaters from './state/Updaters';
import Loader from './components/Loader';
import Popups from './components/Popups';
import Metrics from './views/Metrics/Metrics';
import { RefreshContextProvider } from './contexts/RefreshContext';

const Home = lazy(() => import('./views/Home'));
const Farms = lazy(() => import('./views/Cemetery'));
const Boardroom = lazy(() => import('./views/Masonry'));
const Bonds = lazy(() => import('./views/Pit'));
const Nodes = lazy(() => import ('./views/Nodes'));
const Lottery = lazy(() => import('./views/Nodes/Lottery'));
const SundaeNode = lazy(() => import('./views/SundaeNode'));
const LastManStanding = lazy(() => import('./views/LastManStanding'));

const NoMatch = () => (
  <h3 style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
    URL Not Found. <a href="/">Go back home.</a>
  </h3>
);

const App: React.FC = () => {
  // Clear localStorage for mobile users
  if (typeof localStorage.version_app === 'undefined' || localStorage.version_app !== '1.1') {
    localStorage.clear();
    localStorage.setItem('connectorId', '');
    localStorage.setItem('version_app', '1.1');
  }
  const refHeader = useRef();
  usePromptNetwork();

  return (
      <Providers>
        <Suspense fallback={<Loader />}>
        <Router>
            <Routes>
              <Route path="/"  element={<Home/>}/>
              <Route path="/farms/*" element={<Farms/>}/>
              <Route path="/boardroom" element={<Boardroom/>}/>
              <Route path="/bonds" element={<Bonds/>}/>
              <Route path="/lastmanstanding" element={<LastManStanding refHeader={refHeader}/>}/>
              <Route path="/nodes">
                <Route index element={<Nodes />} />
                <Route path=":bankId" element={<SundaeNode/>}/>
              </Route>
              <Route path="/nodes-lottery" element={<Lottery/>}/>
              <Route path="/metrics" element={<Metrics/>}/>
              <Route path="*" element={<NoMatch/>}/>
          </Routes>
          
        </Router>
        </Suspense>
      </Providers>
  );
};

const Providers: React.FC<{ children: React.ReactNode | React.ReactNode[] }> = ({ children }) => {
  return (
    <TP1 theme={theme}>
      <TP theme={newTheme}>
        <UseWalletProvider
          chainId={config.chainId}
          connectors={{
            walletconnect: { rpcUrl: config.defaultProvider },
            walletlink: {
              url: config.defaultProvider,
              appName: 'Sundae Finance',
              appLogoUrl: './fudge.png',
            },
          }}
        >
          <Provider store={store}>
            <Updaters />
            <RefreshContextProvider>
              <TombFinanceProvider>
                <ModalsProvider>
                  <BanksProvider>
                    <>
                      <Popups />
                      {children}
                    </>
                  </BanksProvider>
                </ModalsProvider>
              </TombFinanceProvider>
            </RefreshContextProvider>
          </Provider>
        </UseWalletProvider>
      </TP>
    </TP1>
  );
};

export default App;
