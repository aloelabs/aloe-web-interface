import React, { Suspense, useEffect } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';

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
