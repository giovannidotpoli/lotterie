import React from 'react';
import './App.scss';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Lotto from './app/routes/Lotto';
import Header from './app/components/Header';
import { store } from './app/redux/store';
import { Provider } from 'react-redux';
function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <Routes>
            <Route
              path="/"
              element={
                  <Header />
              }
            />
            <Route
              path="/lotto"
              element={
                <>
                  <Header />
                  <Lotto />
                </>
              }
            />
          </Routes>
        </HashRouter>
      </Provider>
  );
}

export default App;
