import React, { Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import WagmiProvider from './connector/WagmiProvider';
import Header from './components/header/Header';
import Footer from './components/common/Footer';
import BlendPoolSelectPage from './pages/BlendPoolSelectPage';
import BlendPoolPage from './pages/BlendPoolPage';
import PortfolioPage from './pages/PortfolioPage';
import GovernancePage from './pages/GovernancePage';

import AppBody from './components/common/AppBody';
import { RedirectPartialPath } from './util/RedirectPartialPath';
import { BlendTableProvider } from './data/context/BlendTableContext';
import ScrollToTop from './util/ScrollToTop';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/react-hooks';
export const uniswapClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
  }),
  cache: new InMemoryCache(),
});
export const etherenumBlocksClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks',
  }),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <>
      <Suspense fallback={null}>
        <WagmiProvider>
          <BlendTableProvider>
            <ScrollToTop />
            <AppBody>
              <Header />
              <main className='flex-grow'>
                <Routes>
                  <Route
                    path='/blend'
                    element={
                      <RedirectPartialPath
                        from={['/blend', '/blend/']}
                        to={'/blend/pools'}
                      />
                    }
                  >
                    <Route path='pools' element={<BlendPoolSelectPage />} />
                    <Route
                      path='pool/:pooladdress'
                      element={<BlendPoolPage />}
                    />
                    <Route
                      path='pool'
                      element={<Navigate replace to='/blend' />}
                    />
                    <Route
                      path='*'
                      element={<Navigate replace to='/blend/pools' />}
                    />
                  </Route>
                  <Route path='/portfolio' element={<PortfolioPage />} />
                  <Route path='/governance' element={<GovernancePage />} />
                  <Route path='/' element={<Navigate replace to='/blend' />} />
                  <Route path='*' element={<Navigate to='/' />} />
                </Routes>
              </main>
              <Footer />
            </AppBody>
          </BlendTableProvider>
        </WagmiProvider>
      </Suspense>
    </>
  );
}

export default App;
