import React from 'react';
import './App.scss';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Lotto from './app/routes/Lotto';
import Header from './app/components/Header';
import { store } from './app/redux/store';
import { Provider } from 'react-redux';
import Milionday from './app/routes/Milionday';
import Superenalotto from './app/routes/Superenalotto';

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
            <Route
              path="/milionday"
              element={
                <>
                  <Header />
                  <Milionday />
                </>
              }
            />
            <Route
              path="/superenalotto"
              element={
                <>
                  <Header />
                  <Superenalotto />
                </>
              }
            />
          </Routes>
        </HashRouter>
      </Provider>
  );
}

export default App;
