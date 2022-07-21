import React, { Suspense, useEffect } from 'react';
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
import { IS_DEV } from './util/Env';
import ButtonExamplesPage from './pages/ButtonExamplesPage';
import InputExamplesPage from './pages/InputExamplesPage';
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  gql,
} from '@apollo/react-hooks';

export const theGraphUniswapV2Client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
  }),
  cache: new InMemoryCache(),
});

export const theGraphUniswapV3Client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
  }),
  cache: new InMemoryCache(),
});

export const theGraphEthereumBlocksClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks',
  }),
  cache: new InMemoryCache(),
});

function App() {
  const [blockNumber, setBlockNumber] = React.useState<string | null>(null);
  const twentyFourHoursAgo = Date.now() / 1000 - 24 * 60 * 60;
  const BLOCK_QUERY = gql`
  {
    blocks(first: 1, orderBy: timestamp, orderDirection: asc, where: {timestamp_gt: "${twentyFourHoursAgo.toFixed(
      0
    )}"}) {
      id
      number
      timestamp
    }
  }
  `;

  useEffect(() => {
    let mounted = true;

    const queryBlocks = async () => {
      const response = await theGraphEthereumBlocksClient.query({
        query: BLOCK_QUERY,
      });
      if (mounted) {
        setBlockNumber(response.data.blocks[0].number);
      }
    };
    if (blockNumber === null) {
      queryBlocks();
    }

    return () => {
      mounted = false;
    };
  });
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
                    <Route path='pools' element={<BlendPoolSelectPage blockNumber={blockNumber} />} />
                    <Route
                      path='pool/:pooladdress'
                      element={<BlendPoolPage blockNumber={blockNumber} />}
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
                  { // Devmode-only example page routing
                    IS_DEV && (
                      <>
                        <Route path='/buttons' element={<ButtonExamplesPage />} />
                        <Route path='/inputs' element={<InputExamplesPage />} />
                        <Route path='/portfolio' element={<PortfolioPage />} />
                        <Route path='/governance' element={<GovernancePage />} />
                      </>
                  )}
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
