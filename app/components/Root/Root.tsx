import React from 'react';
import { History } from 'history';
import { Provider } from 'react-redux';
import { hot } from 'react-hot-loader/root';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider } from 'styled-components';
import { ConnectedRouter } from 'connected-react-router';
import theme from '~app/theme';
import App from '~app/components/App';

type Props = {
  store: ReturnType<typeof configureStore>;
  history: History;
};

const Root = ({ store, history }: Props) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </ConnectedRouter>
  </Provider>
);

export default hot(Root);
